import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { ChevronLeft, Pencil, Trash2, Clock, Clapperboard, Loader2, Save } from 'lucide-react';
import { GET_SEASONS } from './SeasonEditor';
import { GET_SERIESS } from './SeriesManager';
import AdminAlert, { AlertType } from '../AdminAlert';
import ConfirmDialog from '../ConfirmDialog';

export const GET_EPISODES = gql`
  query GetEpisodesOfSeason($seasonId: Int!) {
    getEpisodesOfSeason(seasonId: $seasonId) {
      id
      episodeNumber
      title
      overview
      runtime
      airDate
      posterPath
    }
  }
`;

const ADD_EPISODE = gql`
  mutation AddEpisode(
    $seasonId: Int!
    $episodeNumber: Int!
    $title: String!
    $overview: String
    $airDate: Date
    $runtime: Int
    $posterBase64: String
  ) {
    addEpisode(
      seasonId: $seasonId
      episodeNumber: $episodeNumber
      title: $title
      overview: $overview
      airDate: $airDate
      runtime: $runtime
      posterBase64: $posterBase64
    ) {
      success
      message
      episode { id }
    }
  }
`;

const UPDATE_EPISODE = gql`
  mutation UpdateEpisode(
    $id: Int!
    $episodeNumber: Int
    $title: String
    $overview: String
    $airDate: Date
    $runtime: Int
    $posterBase64: String
  ) {
    updateEpisode(
      id: $id
      episodeNumber: $episodeNumber
      title: $title
      overview: $overview
      airDate: $airDate
      runtime: $runtime
      posterBase64: $posterBase64
    ) {
      success
      message
    }
  }
`;

const DELETE_EPISODE = gql`
  mutation DeleteEpisode($id: Int!) {
    deleteEpisode(id: $id) {
      success
      message
    }
  }
`;

export default function EpisodeEditor({ season, series, onBack }: any) {
    const { data, loading, error, refetch } = useQuery(GET_EPISODES, {
        variables: { seasonId: season.id },
        fetchPolicy: 'cache-and-network',
    });

    const [addEpisode] = useMutation(ADD_EPISODE, {
        refetchQueries: [
            { query: GET_EPISODES, variables: { seasonId: season.id } },
            { query: GET_SEASONS, variables: { seriesId: series.id } },
            { query: GET_SERIESS }
        ]
    });
    const [updateEpisode] = useMutation(UPDATE_EPISODE, {
        refetchQueries: [
            { query: GET_EPISODES, variables: { seasonId: season.id } },
            { query: GET_SEASONS, variables: { seriesId: series.id } },
            { query: GET_SERIESS }
        ]
    });
    const [deleteEpisode] = useMutation(DELETE_EPISODE, {
        refetchQueries: [
            { query: GET_EPISODES, variables: { seasonId: season.id } },
            { query: GET_SEASONS, variables: { seriesId: series.id } },
            { query: GET_SERIESS }
        ]
    });

    const [editingEpisode, setEditingEpisode] = useState<any | null>(null);
    const [alertInfo, setAlertInfo] = useState<{ type: AlertType; message: string } | null>(null);
    const [episodeToDelete, setEpisodeToDelete] = useState<number | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const episodes = data?.getEpisodesOfSeason || [];

    React.useEffect(() => {
        if (!editingEpisode) {
            setFormData(prev => ({ ...prev, episodeNumber: episodes.length + 1 }));
        }
    }, [episodes.length, editingEpisode]);

    if (error) return (
        <div className="p-8 text-center bg-red-500/10 rounded-3xl border border-red-500/20">
            <h3 className="text-red-500 font-bold mb-2">Error Loading Episodes</h3>
            <p className="text-zinc-500 text-sm">{error.message}</p>
        </div>
    );

    const [formData, setFormData] = useState({
        episodeNumber: episodes.length + 1,
        title: '',
        overview: '',
        airDate: '',
        runtime: '',
        posterBase64: '',
    });

    const handleEditClick = (ep: any) => {
        setEditingEpisode(ep);
        setFormData({
            episodeNumber: ep.episodeNumber,
            title: ep.title,
            overview: ep.overview || '',
            airDate: ep.airDate ? new Date(ep.airDate).toISOString().split('T')[0] : '',
            runtime: ep.runtime?.toString() || '',
            posterBase64: '', // require new upload if changing poster
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const executeSave = async () => {
        setAlertInfo({ type: 'info', message: editingEpisode ? 'Updating episode... Please wait.' : 'Creating episode... Please wait.' });
        try {
            const payload = {
                episodeNumber: parseInt(String(formData.episodeNumber)),
                title: formData.title,
                overview: formData.overview || undefined,
                airDate: formData.airDate ? new Date(formData.airDate).toISOString() : undefined,
                runtime: formData.runtime ? parseInt(formData.runtime) : undefined,
                posterBase64: formData.posterBase64 || undefined,
            };

            let res;
            if (editingEpisode) {
                res = await updateEpisode({ variables: { id: editingEpisode.id, ...payload } });
            } else {
                res = await addEpisode({ variables: { seasonId: season.id, ...payload } });
            }

            const result = editingEpisode ? res.data?.updateEpisode : res.data?.addEpisode;
            if (result?.success) {
                setEditingEpisode(null);
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
        if (!episodeToDelete) return;
        try {
            const res = await deleteEpisode({ variables: { id: episodeToDelete } });
            if (res.data?.deleteEpisode?.success) {
                setAlertInfo({ type: 'success', message: 'Episode deleted successfully.' });
                setTimeout(() => setAlertInfo(null), 3000);
            } else {
                setAlertInfo({ type: 'error', message: res.data?.deleteEpisode?.message || 'Delete failed' });
            }
        } catch (e: any) {
            setAlertInfo({ type: 'error', message: e.message || 'Failed to delete episode.' });
        } finally {
            setEpisodeToDelete(null);
        }
    };

    return (
        <div className="max-w-5xl mx-auto h-full flex flex-col pt-2 pb-10">
            <ConfirmDialog
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={executeSave}
                title={editingEpisode ? 'Update Episode' : 'Add Episode'}
                description={editingEpisode ? 'Are you sure you want to update this episode?' : 'Are you sure you want to add this episode?'}
                confirmText={editingEpisode ? 'Update' : 'Add'}
                variant="warning"
            />
            <ConfirmDialog
                isOpen={!!episodeToDelete}
                onClose={() => setEpisodeToDelete(null)}
                onConfirm={handleDelete}
                title="Delete Episode"
                description="Are you sure you want to delete this episode? This action cannot be undone."
                confirmText="Delete"
                variant="danger"
            />
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
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="p-2 bg-zinc-900 border border-zinc-800 hover:border-primary/50 hover:bg-zinc-800 rounded-xl transition-all">
                    <ChevronLeft size={20} className="text-zinc-400" />
                </button>
                <div>
                    <div className="text-xs text-primary font-bold mb-1">{series.title}</div>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                        {season.title || `Season ${season.seasonNumber}`}
                        <span className="text-zinc-600 text-lg font-normal py-0.5">/ Episodes</span>
                    </h3>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10 flex-1">
                {/* Left: Episode List */}
                <div className="flex-1 space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
                    ) : episodes.length === 0 ? (
                        <div className="text-center py-10 text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
                            No episodes yet for this season.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {episodes.map((ep: any) => (
                                <div key={ep.id} className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-primary/30 transition-all group flex h-24">
                                    <div className="w-32 shrink-0 bg-black flex items-center justify-center relative">
                                        {ep.posterPath ? (
                                            <img src={ep.posterPath} alt={ep.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <Clapperboard size={20} className="text-zinc-800" />
                                        )}
                                        <div className="absolute top-1 left-1 bg-black/80 font-mono text-[10px] px-1.5 rounded text-white font-bold backdrop-blur-sm">
                                            EP {ep.episodeNumber.toString().padStart(2, '0')}
                                        </div>
                                    </div>

                                    <div className="p-3 flex-1 flex flex-col justify-center min-w-0">
                                        <h4 className="font-bold text-sm text-white truncate">{ep.title}</h4>
                                        {ep.overview && <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{ep.overview}</p>}
                                        <div className="flex items-center gap-3 mt-auto text-[10px] text-zinc-400 font-medium">
                                            {ep.runtime && <span className="flex items-center gap-1"><Clock size={10} /> {ep.runtime}m</span>}
                                            {ep.airDate && <span>Aired: {new Date(ep.airDate).toLocaleDateString()}</span>}
                                        </div>
                                    </div>

                                    <div className="p-3 flex flex-col items-center justify-center gap-2 border-l border-zinc-800/50 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEditClick(ep)} className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded transition-all" title="Edit Episode">
                                            <Pencil size={14} />
                                        </button>
                                        <button onClick={() => setEpisodeToDelete(ep.id)} className="p-1.5 bg-zinc-800 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-all" title="Delete Episode">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Add/Edit Episode Form */}
                <div className="w-full lg:w-80 shrink-0">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sticky top-0">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-white shrink-0 text-sm">{editingEpisode ? 'Edit Episode' : 'Add New Episode'}</h3>
                            {editingEpisode && (
                                <button
                                    onClick={() => { setEditingEpisode(null); setFormData({ episodeNumber: episodes.length + 1, title: '', overview: '', airDate: '', runtime: '', posterBase64: '' }); }}
                                    className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded transition-all"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-zinc-500 block mb-1">Episode #</label>
                                    <input
                                        type="number" required min="1"
                                        value={formData.episodeNumber} onChange={e => setFormData({ ...formData, episodeNumber: parseInt(e.target.value) })}
                                        className="w-full bg-black/50 border border-zinc-800 focus:border-primary rounded-xl px-3 py-2 text-white outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-zinc-500 block mb-1">Runtime</label>
                                    <input
                                        type="number"
                                        value={formData.runtime} onChange={e => setFormData({ ...formData, runtime: e.target.value })}
                                        className="w-full bg-black/50 border border-zinc-800 focus:border-primary rounded-xl px-3 py-2 text-white outline-none text-sm"
                                        placeholder="Mins"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-zinc-500 block mb-1">Title <span className="text-red-500">*</span></label>
                                <input
                                    type="text" required
                                    value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-black/50 border border-zinc-800 focus:border-primary rounded-xl px-3 py-2 text-white outline-none text-sm placeholder:text-zinc-700"
                                    placeholder="e.g., Pilot"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-zinc-500 block mb-1">Overview</label>
                                <textarea
                                    value={formData.overview} onChange={e => setFormData({ ...formData, overview: e.target.value })}
                                    rows={2}
                                    className="w-full bg-black/50 border border-zinc-800 focus:border-primary rounded-xl px-3 py-2 text-white outline-none text-sm resize-none custom-scrollbar"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-zinc-500 block mb-1">Air Date</label>
                                <input
                                    type="date"
                                    value={formData.airDate} onChange={e => setFormData({ ...formData, airDate: e.target.value })}
                                    className="w-full bg-black/50 border border-zinc-800 focus:border-primary rounded-xl px-3 py-2 text-white outline-none text-sm"
                                    style={{ colorScheme: 'dark' }}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-zinc-500 block mb-1">Episode Thumbnail</label>
                                <input
                                    type="file" accept="image/*"
                                    onChange={e => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const reader = new FileReader();
                                        reader.onload = () => setFormData({ ...formData, posterBase64: reader.result as string });
                                        reader.readAsDataURL(file);
                                    }}
                                    className="w-full text-xs text-zinc-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
                                />
                            </div>

                            <button type="submit" className="w-full mt-2 bg-primary hover:opacity-90 text-black font-bold py-2.5 text-sm rounded-xl transition-all flex justify-center items-center gap-2">
                                <Save size={16} />
                                {editingEpisode ? 'Save Episode' : 'Add Episode'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
