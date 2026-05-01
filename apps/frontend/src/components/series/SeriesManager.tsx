import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Search, Plus, Film, ChevronRight, Loader2, Clapperboard } from 'lucide-react';
import SeriesEditor from './SeriesEditor';
import AdminAlert from '../AdminAlert';
import ConfirmDialog from '../ConfirmDialog';

export const GET_SERIESS = gql`
  query GetSeries {
    getSeries {
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
      SeriesGenre {
        genre {
          id
          name
        }
      }
    }
  }
`;

const DELETE_SERIES = gql`
  mutation DeleteSeries($title: String) {
    deleteSeries(title: $title) {
      success
      message
    }
  }
`;

export default function SeriesManager() {
  const [search, setSearch] = useState('');
  const [selectedSeries, setSelectedSeries] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [seriesToDelete, setSeriesToDelete] = useState<{ id: number; title: string } | null>(null);
  const [alertInfo, setAlertInfo] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);

  const { data, loading, error } = useQuery(GET_SERIESS, { fetchPolicy: 'cache-and-network' });
  const [deleteSeries] = useMutation(DELETE_SERIES, {
    refetchQueries: [{ query: GET_SERIESS }],
  });

  const seriesList = data?.getSeries ?? [];
  const filtered = seriesList.filter((s: any) =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    (s.overview ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!seriesToDelete) return;
    const { title, id } = seriesToDelete;
    try {
      await deleteSeries({ variables: { title } });
      if (selectedSeries?.id === id) setSelectedSeries(null);
      setAlertInfo({ type: 'success', message: `Series "${title}" deleted successfully.` });
      setTimeout(() => setAlertInfo(null), 3000);
    } catch (e: any) {
      setAlertInfo({ type: 'error', message: e.message || 'Failed to delete series.' });
    } finally {
      setSeriesToDelete(null);
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-black/40 border border-zinc-800/50 rounded-3xl shadow-2xl backdrop-blur-3xl">
      {/* LEFT SIDEBAR: Master List */}
      <div className="w-[380px] flex flex-col border-r border-zinc-800/50 bg-zinc-950/40 shrink-0">
        <div className="p-5 border-b border-zinc-800/50">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
              Series Library
            </h1>
            <button
              onClick={() => { setSelectedSeries(null); setIsCreating(true); }}
              className="bg-primary hover:opacity-90 text-white p-2 rounded-xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]"
            >
              <Plus size={18} />
            </button>
          </div>
          <div className="relative group">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search series..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-primary/50 rounded-xl py-2.5 pl-9 pr-4 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 relative custom-scrollbar">
          {loading && seriesList.length === 0 ? (
            <div className="flex justify-center py-10"><Loader2 size={24} className="animate-spin text-primary" /></div>
          ) : error ? (
            <div className="p-3">
              <AdminAlert
                type="error"
                message={error.message}
                className="rounded-xl p-3 text-xs"
              />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-600 h-full">
              <Film size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-medium">No series found.</p>
            </div>
          ) : (
            filtered.map((series: any) => {
              const isSelected = selectedSeries?.id === series.id;
              return (
                <button
                  key={series.id}
                  onClick={() => { setIsCreating(false); setSelectedSeries(series); }}
                  className={`w-full text-left p-3 rounded-2xl flex gap-4 transition-all duration-300 group ${isSelected
                    ? 'bg-gradient-to-r from-primary/10 to-transparent border-primary/30 shadow-[inset_4px_0_0_rgba(249,115,22,1)] border-y border-r'
                    : 'border border-transparent hover:bg-zinc-900/50 hover:border-zinc-800'
                    }`}
                >
                  <div className="w-12 h-16 rounded-lg bg-zinc-900 overflow-hidden shrink-0 border border-zinc-800 shadow-inner">
                    {series.posterPath ? (
                      <img src={series.posterPath} alt={series.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700"><Clapperboard size={18} /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className={`font-bold text-sm truncate transition-colors ${isSelected ? 'text-primary' : 'text-zinc-200 group-hover:text-white'}`}>
                      {series.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-zinc-500 font-medium">
                      {series.releaseDate ? new Date(series.releaseDate).getFullYear() : 'TBA'}
                      <div className="w-1 h-1 rounded-full bg-zinc-700" />
                      {series.status?.replace('_', ' ')}
                    </div>
                  </div>
                  <ChevronRight size={16} className={`my-auto shrink-0 transition-all duration-300 ${isSelected ? 'text-primary translate-x-1' : 'text-zinc-700 translate-x-0'}`} />
                </button>
              );
            })
          )}
        </div>
      </div>
      <ConfirmDialog
        isOpen={!!seriesToDelete}
        onClose={() => setSeriesToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Series"
        description={`Are you sure you want to delete "${seriesToDelete?.title}"? This action cannot be undone.`}
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

      {/* RIGHT MAIN AREA: Detail / Editor */}
      <div className="flex-1 bg-zinc-950/20 flex flex-col relative overflow-hidden">
        {isCreating ? (
          <SeriesEditor
            series={null}
            onCancel={(alert) => {
              setIsCreating(false);
              if (alert) {
                setAlertInfo(alert);
                setTimeout(() => setAlertInfo(null), 3000);
              }
            }}
            onSave={(newSeries: any, alert) => {
              setSelectedSeries(newSeries);
              setIsCreating(false);
              if (alert) {
                setAlertInfo(alert);
                setTimeout(() => setAlertInfo(null), 3000);
              }
            }}
          />
        ) : selectedSeries ? (
          <SeriesEditor
            key={selectedSeries.id}
            series={selectedSeries}
            onCancel={(alert) => {
              setSelectedSeries(null);
              if (alert) {
                setAlertInfo(alert);
                setTimeout(() => setAlertInfo(null), 3000);
              }
            }}
            onSave={(updatedSeries: any, alert) => {
              setSelectedSeries(updatedSeries);
              if (alert) {
                setAlertInfo(alert);
                setTimeout(() => setAlertInfo(null), 3000);
              }
            }}
            onDelete={() => setSeriesToDelete({ title: selectedSeries.title, id: selectedSeries.id })}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
            <div className="w-24 h-24 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 flex items-center justify-center mb-6 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
              <Clapperboard size={32} className="text-zinc-600 relative z-10" />
            </div>
            <h2 className="text-xl font-bold text-zinc-400 mb-2">Select a Series</h2>
            <p className="text-sm">Choose a series from the left to edit, or create a new one.</p>
            <button
              onClick={() => setIsCreating(true)}
              className="mt-8 px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-primary/30 text-zinc-300 font-bold rounded-xl transition-all"
            >
              Start Creating
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
