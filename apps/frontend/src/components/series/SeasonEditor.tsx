import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Pencil, Trash2, Clapperboard, Loader2, Save, Eye } from 'lucide-react';
import EpisodeEditor from './EpisodeEditor';
import { GET_SERIESS } from './SeriesManager';
import AdminAlert, { AlertType } from '../AdminAlert';
import ConfirmDialog from '../ConfirmDialog';

export const GET_SEASONS = gql`
  query GetSeasonsOfSeries($seriesId: Int!) {
    getSeasonsOfSeries(seriesId: $seriesId) {
      id
      seasonNumber
      title
      overview
      airDate
      episodeCount
      posterPath
      episodes {
        id
        episodeNumber
        title
        overview
        runtime
        airDate
        posterPath
      }
    }
  }
`;

const ADD_SEASON = gql`
  mutation AddSeason(
    $seriesId: Int!
    $seasonNumber: Int!
    $title: String
    $overview: String
    $airDate: Date
    $episodeCount: Int
    $posterBase64: String
  ) {
    addSeason(
      seriesId: $seriesId
      seasonNumber: $seasonNumber
      title: $title
      overview: $overview
      airDate: $airDate
      episodeCount: $episodeCount
      posterBase64: $posterBase64
    ) {
      success
      message
      season {
        id
      }
    }
  }
`;

const UPDATE_SEASON = gql`
  mutation UpdateSeason(
    $id: Int!
    $seasonNumber: Int
    $title: String
    $overview: String
    $airDate: Date
    $episodeCount: Int
    $posterBase64: String
  ) {
    updateSeason(
      id: $id
      seasonNumber: $seasonNumber
      title: $title
      overview: $overview
      airDate: $airDate
      episodeCount: $episodeCount
      posterBase64: $posterBase64
    ) {
      success
      message
    }
  }
`;

const DELETE_SEASON = gql`
  mutation DeleteSeason($id: Int!) {
    deleteSeason(id: $id) {
      success
      message
    }
  }
`;

export default function SeasonEditor({ series }: { series: any }) {
    const { data, loading, error, refetch } = useQuery(GET_SEASONS, {
        variables: { seriesId: series.id },
        fetchPolicy: 'cache-and-network',
    });

    const [addSeason] = useMutation(ADD_SEASON, {
        refetchQueries: [
            { query: GET_SEASONS, variables: { seriesId: series.id } },
            { query: GET_SERIESS }
        ]
    });
    const [updateSeason] = useMutation(UPDATE_SEASON, {
        refetchQueries: [
            { query: GET_SEASONS, variables: { seriesId: series.id } },
            { query: GET_SERIESS }
        ]
    });
    const [deleteSeason] = useMutation(DELETE_SEASON, {
        refetchQueries: [
            { query: GET_SEASONS, variables: { seriesId: series.id } },
            { query: GET_SERIESS }
        ]
    });

    const [editingSeason, setEditingSeason] = useState<any | null>(null);
    const [activeSeasonForEpisodes, setActiveSeasonForEpisodes] = useState<any | null>(null);
    const [alertInfo, setAlertInfo] = useState<{ type: AlertType; message: string } | null>(null);
    const [seasonToDelete, setSeasonToDelete] = useState<number | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const [formData, setFormData] = useState({
        seasonNumber: 1,
        title: '',
        overview: '',
        airDate: '',
        posterBase64: '',
    });

    const seasons = data?.getSeasonsOfSeries || [];

    React.useEffect(() => {
        if (!editingSeason) {
            setFormData(prev => ({ ...prev, seasonNumber: seasons.length + 1 }));
        }
    }, [seasons.length, editingSeason]);

    if (error) return (
        <div className="p-8 text-center bg-red-500/10 rounded-3xl border border-red-500/20">
            <h3 className="text-red-500 font-bold mb-2">Error Loading Seasons</h3>
            <p className="text-zinc-500 text-sm">{error.message}</p>
        </div>
    );

    if (activeSeasonForEpisodes) {
        return <EpisodeEditor season={activeSeasonForEpisodes} series={series} onBack={() => setActiveSeasonForEpisodes(null)} />;
    }

    const handleEditClick = (season: any) => {
        setEditingSeason(season);
        setFormData({
            seasonNumber: season.seasonNumber,
            title: season.title || '',
            overview: season.overview || '',
            airDate: season.airDate ? new Date(season.airDate).toISOString().split('T')[0] : '',
            posterBase64: '', // We don't load the old base64, we wait for a new one
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const executeSave = async () => {
        setAlertInfo({ type: 'info', message: editingSeason ? 'Updating season... Please wait.' : 'Creating season... Please wait.' });
        try {
            const payload = {
                seasonNumber: parseInt(String(formData.seasonNumber)),
                title: formData.title || undefined,
                overview: formData.overview || undefined,
                airDate: formData.airDate ? new Date(formData.airDate).toISOString() : undefined,
                posterBase64: formData.posterBase64 || undefined,
            };

            let res;
            if (editingSeason) {
                res = await updateSeason({ variables: { id: editingSeason.id, ...payload } });
            } else {
                res = await addSeason({ variables: { seriesId: series.id, ...payload } });
            }

            const result = editingSeason ? res.data?.updateSeason : res.data?.addSeason;
            if (result?.success) {
                setEditingSeason(null);
                await refetch();
                setAlertInfo({ type: 'success', message: result.message });
                setTimeout(() => setAlertInfo(null), 3000);
            } else {
                setAlertInfo({ type: 'error', message: result?.message || 'Operation failed' });
            }
        } catch (err: any) {
            setAlertInfo({ type: 'error', message: err.message });
        }
    };

    const handleDelete = async () => {
        if (!seasonToDelete) return;
        try {
            const res = await deleteSeason({ variables: { id: seasonToDelete } });
            if (res.data?.deleteSeason?.success) {
                setAlertInfo({ type: 'success', message: 'Season deleted successfully.' });
                setTimeout(() => setAlertInfo(null), 3000);
            } else {
                setAlertInfo({ type: 'error', message: res.data?.deleteSeason?.message || 'Delete failed' });
            }
        } catch (e: any) {
            setAlertInfo({ type: 'error', message: e.message || 'Failed to delete season.' });
        } finally {
            setSeasonToDelete(null);
        }
    };

    return (
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-10">
            <ConfirmDialog
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={executeSave}
                title={editingSeason ? 'Update Season' : 'Add Season'}
                description={editingSeason ? 'Are you sure you want to update this season?' : 'Are you sure you want to add this season?'}
                confirmText={editingSeason ? 'Update' : 'Add'}
                variant="warning"
            />
            <ConfirmDialog
                isOpen={!!seasonToDelete}
                onClose={() => setSeasonToDelete(null)}
                onConfirm={handleDelete}
                title="Delete Season"
                description="Are you sure you want to delete this season? This will delete all episodes in this season and cannot be undone."
                confirmText="Delete"
                variant="danger"
            />
            {/* Left: Season List */}
            <div className="flex-1 space-y-4">
                {alertInfo && (
                    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-4 pointer-events-none">
                        <div className="pointer-events-auto">
                            <AdminAlert
                                type={alertInfo.type}
                                message={alertInfo.message}
                                onClose={() => setAlertInfo(null)}
                            />
                        </div>
                    </div>
                )}
                <h3 className="text-xl font-bold text-white mb-6">Seasons ({seasons.length})</h3>
                {loading ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
                ) : seasons.length === 0 ? (
                    <div className="text-center py-10 text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
                        No seasons yet. Add Season 1 to get started.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {seasons.map((season: any) => (
                            <div key={season.id} className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-primary/30 transition-all group flex">
                                <div className="w-24 shrink-0 bg-black flex items-center justify-center relative">
                                    {season.posterPath ? (
                                        <img src={season.posterPath} alt={season.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <Clapperboard size={24} className="text-zinc-800" />
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 bg-black/80 font-mono text-[10px] text-center font-bold text-white py-1">
                                        S{season.seasonNumber.toString().padStart(2, '0')}
                                    </div>
                                </div>

                                <div className="p-4 flex-1 flex flex-col justify-center">
                                    <h4 className="font-bold text-white">{season.title || `Season ${season.seasonNumber}`}</h4>
                                    <div className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
                                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">{season.episodes?.length || 0} Episodes</span>
                                        {season.airDate && <span>• {new Date(season.airDate).getFullYear()}</span>}
                                    </div>
                                </div>

                                <div className="p-4 flex items-center gap-2 border-l border-zinc-800/50 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setActiveSeasonForEpisodes(season)} className="p-2 bg-primary hover:opacity-90 text-black rounded-lg transition-all" title="Manage Episodes">
                                        <Eye size={16} />
                                    </button>
                                    <button onClick={() => handleEditClick(season)} className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-all" title="Edit Season">
                                        <Pencil size={16} />
                                    </button>
                                    <button onClick={() => setSeasonToDelete(season.id)} className="p-2 bg-zinc-800 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Delete Season">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Right: Add/Edit Season Form */}
            <div className="w-full lg:w-80 shrink-0">
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sticky top-0">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-white">{editingSeason ? 'Edit Season' : 'Add New Season'}</h3>
                        {editingSeason && (
                            <button
                                onClick={() => { setEditingSeason(null); setFormData({ seasonNumber: seasons.length + 1, title: '', overview: '', airDate: '', posterBase64: '' }); }}
                                className="text-xs text-zinc-500 hover:text-white"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-zinc-500 block mb-1">Season Number</label>
                            <input
                                type="number" required min="1"
                                value={formData.seasonNumber} onChange={e => setFormData({ ...formData, seasonNumber: parseInt(e.target.value) })}
                                className="w-full bg-black/50 border border-zinc-800 focus:border-primary rounded-xl px-3 py-2 text-white outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-zinc-500 block mb-1">Custom Title (Optional)</label>
                            <input
                                type="text"
                                value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-black/50 border border-zinc-800 focus:border-primary rounded-xl px-3 py-2 text-white outline-none placeholder:text-zinc-700"
                                placeholder="e.g., The Return"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-zinc-500 block mb-1">Air Date</label>
                            <input
                                type="date"
                                value={formData.airDate} onChange={e => setFormData({ ...formData, airDate: e.target.value })}
                                className="w-full bg-black/50 border border-zinc-800 focus:border-primary rounded-xl px-3 py-2 text-white outline-none"
                                style={{ colorScheme: 'dark' }}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-zinc-500 block mb-1">Specific Season Poster Form</label>
                            <input
                                type="file" accept="image/*"
                                onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const reader = new FileReader();
                                    reader.onload = () => setFormData({ ...formData, posterBase64: reader.result as string });
                                    reader.readAsDataURL(file);
                                }}
                                className="w-full text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
                            />
                        </div>

                        <button type="submit" className="w-full mt-4 bg-primary hover:opacity-90 text-black font-bold py-3 text-sm rounded-xl transition-all flex justify-center items-center gap-2">
                            <Save size={16} />
                            {editingSeason ? 'Save Season' : 'Add Season'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
