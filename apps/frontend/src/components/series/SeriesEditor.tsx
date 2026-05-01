import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { Save, X, Loader2, Image as ImageIcon, Trash2 } from 'lucide-react';
import SeasonEditor from './SeasonEditor';
import AdminAlert, { AlertType } from '../AdminAlert';
import ConfirmDialog from '../ConfirmDialog';
import { GET_SERIESS } from './SeriesManager';

const CREATE_SERIES = gql`
  mutation CreateSeries(
    $title: String!
    $originalTitle: String
    $overview: String
    $releaseDate: Date
    $runtime: Int!
    $posterBase64: String
    $budget: Int!
    $revenue: Int
    $status: SeriesStatus!
    $tagline: String!
    $adult: Boolean!
    $trailerLink: String
    $genreIds: [Int]
  ) {
    createSeries(
      title: $title
      originalTitle: $originalTitle
      overview: $overview
      releaseDate: $releaseDate
      runtime: $runtime
      posterBase64: $posterBase64
      budget: $budget
      revenue: $revenue
      status: $status
      tagline: $tagline
      adult: $adult
      trailerLink: $trailerLink
      genreIds: $genreIds
    ) {
      success
      message
      series {
        id
        title
        originalTitle
        overview
        posterPath
        runtime
        status
        releaseDate
        adult
        budget
        revenue
        tagline
        trailerLink
      }
    }
  }
`;

const UPDATE_SERIES = gql`
  mutation UpdateSeries(
    $id: Int!
    $title: String
    $originalTitle: String
    $overview: String
    $releaseDate: Date
    $runtime: Int
    $posterBase64: String
    $budget: Int
    $revenue: Int
    $status: SeriesStatus
    $tagline: String
    $adult: Boolean
    $trailerLink: String
    $genreIds: [Int]
  ) {
    updateSeries(
      id: $id
      title: $title
      originalTitle: $originalTitle
      overview: $overview
      releaseDate: $releaseDate
      runtime: $runtime
      posterBase64: $posterBase64
      budget: $budget
      revenue: $revenue
      status: $status
      tagline: $tagline
      adult: $adult
      trailerLink: $trailerLink
      genreIds: $genreIds
    ) {
      success
      message
      series {
        id
        title
        originalTitle
        overview
        posterPath
        runtime
        status
        releaseDate
        adult
        budget
        revenue
        tagline
        trailerLink
      }
    }
  }
`;

const GET_GENRES = gql`
  query GetGenres {
    getGenre {
      id
      name
    }
  }
`;

interface SeriesEditorProps {
  series: any;
  onCancel: (alert?: { type: AlertType; message: string } | null) => void;
  onSave: (series: any, alert?: { type: AlertType; message: string } | null) => void;
  onDelete?: () => void;
}

export default function SeriesEditor({ series, onCancel, onSave, onDelete }: SeriesEditorProps) {
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'SEASONS'>('DETAILS');
  const isEditing = !!series;

  const [formData, setFormData] = useState({
    title: series?.title || '',
    originalTitle: series?.originalTitle || '',
    overview: series?.overview || '',
    releaseDate: series?.releaseDate ? new Date(series.releaseDate).toISOString().split('T')[0] : '',
    runtime: series?.runtime?.toString() || '0',
    budget: series?.budget?.toString() || '0',
    revenue: series?.revenue?.toString() || '0',
    status: series?.status || 'IN_PRODUCTION',
    tagline: series?.tagline || '',
    adult: series?.adult || false,
    trailerLink: series?.trailerLink || '',
  });

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState(series?.posterPath || '');
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>(
    series?.SeriesGenre?.map((sg: any) => sg.genre?.id).filter(Boolean) || []
  );
  const [alertInfo, setAlertInfo] = useState<{ type: AlertType; message: string } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const { data: genreData } = useQuery(GET_GENRES);

  // Switch to DETAILS tab seamlessly when clicking a different series
  useEffect(() => {
    setActiveTab('DETAILS');
    setFormData({
      title: series?.title || '',
      originalTitle: series?.originalTitle || '',
      overview: series?.overview || '',
      releaseDate: series?.releaseDate ? new Date(series.releaseDate).toISOString().split('T')[0] : '',
      runtime: series?.runtime?.toString() || '0',
      budget: series?.budget?.toString() || '0',
      revenue: series?.revenue?.toString() || '0',
      status: series?.status || 'IN_PRODUCTION',
      tagline: series?.tagline || '',
      adult: series?.adult || false,
      trailerLink: series?.trailerLink || '',
    });
    setPosterPreview(series?.posterPath || '');
    setPosterFile(null);
    setSelectedGenreIds(series?.SeriesGenre?.map((sg: any) => sg.genre?.id).filter(Boolean) || []);
  }, [series?.id]);


  const [createSeries, { loading: creating }] = useMutation(CREATE_SERIES, {
    refetchQueries: [{ query: GET_SERIESS }],
  });
  const [updateSeries, { loading: updating }] = useMutation(UPDATE_SERIES, {
    refetchQueries: [{ query: GET_SERIESS }],
  });
  const isSaving = creating || updating;

  const toggleGenre = (id: number) => {
    setSelectedGenreIds(prev => prev.includes(id) ? prev.filter(gId => gId !== id) : [...prev, id]);
  };

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPosterFile(file);
    const reader = new FileReader();
    reader.onload = () => setPosterPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const executeSave = async () => {
    setAlertInfo({ type: 'info', message: isEditing ? 'Updating series... Please wait.' : 'Creating series... Please wait.' });
    try {
      let posterBase64;
      if (posterFile) {
        posterBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(posterFile);
        });
      }

      const payload = {
        title: formData.title,
        originalTitle: formData.originalTitle || undefined,
        overview: formData.overview || undefined,
        releaseDate: formData.releaseDate ? new Date(formData.releaseDate).toISOString() : undefined,
        runtime: parseInt(formData.runtime),
        budget: parseInt(formData.budget),
        revenue: parseInt(formData.revenue),
        status: formData.status,
        tagline: formData.tagline || '',
        adult: formData.adult,
        trailerLink: formData.trailerLink || undefined,
        genreIds: selectedGenreIds,
        posterBase64,
      };

      if (isEditing) {
        const res = await updateSeries({ variables: { ...payload, id: series.id } });
        if (res.data?.updateSeries?.success) {
          setAlertInfo({ type: 'success', message: 'Series updated successfully.' });
          setTimeout(() => onSave(res.data.updateSeries.series, { type: 'success', message: 'Series updated successfully.' }), 1500);
        } else {
          setAlertInfo({ type: 'error', message: res.data?.updateSeries?.message || 'Update failed' });
        }
      } else {
        const res = await createSeries({ variables: payload });
        if (res.data?.createSeries?.success) {
          onSave(res.data.createSeries.series, { type: 'success', message: 'Series created successfully.' });
        } else {
          setAlertInfo({ type: 'error', message: res.data?.createSeries?.message || 'Create failed' });
        }
      }
    } catch (err: any) {
      setAlertInfo({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-950/50 relative">
      {/* Header Tabs & Actions */}
      <div className="px-4 sm:px-8 py-4 sm:py-5 border-b border-zinc-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex bg-zinc-900/80 p-1 rounded-2xl border border-zinc-800/50 shadow-inner w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('DETAILS')}
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${activeTab === 'DETAILS' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Series Details
          </button>
          <button
            onClick={() => setActiveTab('SEASONS')}
            disabled={!isEditing}
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${!isEditing ? 'opacity-30 cursor-not-allowed' : activeTab === 'SEASONS' ? 'bg-primary shadow-[0_0_15px_rgba(249,115,22,0.4)] text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Seasons & Episodes
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 sm:gap-3 w-full sm:w-auto">
          {isEditing && onDelete && (
            <button onClick={onDelete} type="button" className="p-2.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
              <Trash2 size={18} />
            </button>
          )}
          <button onClick={() => onCancel()} type="button" className="p-2.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl transition-all">
            <X size={18} />
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex-1 sm:flex-none bg-zinc-100 hover:bg-white text-black px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span className="whitespace-nowrap">{isEditing ? 'Save Changes' : 'Create Series'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-8 custom-scrollbar relative">
        <ConfirmDialog
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={executeSave}
          title={isEditing ? 'Update Series' : 'Create Series'}
          description={isEditing ? 'Are you sure you want to update this series?' : 'Are you sure you want to create this series?'}
          confirmText={isEditing ? 'Update' : 'Create'}
          variant="warning"
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
        {activeTab === 'DETAILS' ? (
          <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-10">
            {/* Left Col: Poster */}
            <div className="w-full lg:w-64 shrink-0 space-y-4">
              <label className="block text-sm font-bold text-zinc-400 mb-2 text-center lg:text-left">Series Poster</label>
              <div className="relative aspect-[2/3] w-48 sm:w-64 mx-auto lg:w-full rounded-2xl bg-zinc-900 border-2 border-dashed border-zinc-800 hover:border-primary/50 transition-colors overflow-hidden group cursor-pointer">
                {posterPreview ? (
                  <img src={posterPreview} alt="Poster" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 group-hover:text-primary transition-colors">
                    <ImageIcon size={32} className="mb-2" />
                    <span className="text-xs font-bold">Upload Image</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePosterChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Right Col: Forms */}
            <form id="series-form" onSubmit={handleSubmit} className="flex-1 space-y-6">
              <div>
                <label className="text-sm font-bold text-zinc-400 mb-2 block">Series Title <span className="text-red-500">*</span></label>
                <input
                  type="text" required
                  value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-primary rounded-xl px-4 py-3 text-white outline-none transition-all text-base sm:text-lg font-bold"
                  placeholder="e.g., Breaking Bad"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-zinc-500 mb-2 block">Release Date</label>
                  <input
                    type="date"
                    value={formData.releaseDate} onChange={e => setFormData({ ...formData, releaseDate: e.target.value })}
                    className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-primary rounded-xl px-4 py-2.5 text-white outline-none"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-zinc-500 mb-2 block">Runtime (mins)</label>
                  <input
                    type="number"
                    value={formData.runtime} onChange={e => setFormData({ ...formData, runtime: e.target.value })}
                    className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-primary rounded-xl px-4 py-2.5 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-zinc-500 mb-2 block">Overview</label>
                <textarea
                  value={formData.overview} onChange={e => setFormData({ ...formData, overview: e.target.value })}
                  rows={4}
                  className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-primary rounded-xl px-4 py-3 text-white outline-none resize-none custom-scrollbar"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-zinc-500 mb-2 block">Status</label>
                  <select
                    value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-primary rounded-xl px-4 py-2.5 text-white outline-none appearance-none cursor-pointer"
                  >
                    <option value="RELEASED">Released</option>
                    <option value="IN_PRODUCTION">In Production</option>
                    <option value="POST_PRODUCTION">Post Production</option>
                    <option value="PLANNED">Planned</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="RUMORED">Rumored</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-0 sm:pt-8">
                  <input
                    type="checkbox"
                    id="adult"
                    checked={formData.adult}
                    onChange={e => setFormData({ ...formData, adult: e.target.checked })}
                    className="w-5 h-5 rounded border-zinc-700 text-primary focus:ring-primary focus:ring-offset-zinc-900 bg-zinc-900"
                  />
                  <label htmlFor="adult" className="text-sm font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded">18+ Adult Content</label>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-zinc-400">Genres</label>
                  <span className="text-xs text-zinc-500">{selectedGenreIds.length} selected</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {genreData?.getGenre?.map((g: any) => {
                    const isSelected = selectedGenreIds.includes(g.id);
                    return (
                      <button
                        type="button"
                        key={g.id}
                        onClick={() => toggleGenre(g.id)}
                        className={`px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg border transition-all ${isSelected ? 'bg-primary/20 text-primary border-primary/50' : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-600'}`}
                      >
                        {g.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            </form>
          </div>
        ) : (
          <SeasonEditor series={series} />
        )}
      </div>
    </div >
  );
}
