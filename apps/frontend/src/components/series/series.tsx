'use client';

import React, { useState } from 'react';
import SeriesUploadForm from './SeriesUploadForm';
import SeasonUploadForm from './SeasonUploadForm';
import { IoSearchOutline } from 'react-icons/io5';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Clapperboard, Trash2, Clock, Film, Pencil, Plus } from 'lucide-react';
import ConfirmDialog from '../ConfirmDialog';

const GET_SERIESS = gql`
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

const STATUS_COLORS: Record<string, string> = {
  RELEASED: 'bg-green-500/10 text-green-400 border-green-500/20',
  IN_PRODUCTION: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  POST_PRODUCTION: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  PLANNED: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/20',
  RUMORED: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
};

const Series = () => {
  const [isOpen, setisOpen] = useState(false);
  const [seriesToEdit, setSeriesToEdit] = useState<any>(null);
  const [addingSeasonForSeries, setAddingSeasonForSeries] = useState<{ id: number; title: string } | null>(null);
  const [seriesToDelete, setSeriesToDelete] = useState<{ id: number; title: string } | null>(null);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_SERIESS);
  const [deleteSeries] = useMutation(DELETE_SERIES);

  const confirmDelete = async () => {
    if (!seriesToDelete) return;
    setDeletingId(seriesToDelete.id);
    try {
      await deleteSeries({ variables: { title: seriesToDelete.title } });
      await refetch();
    } catch (e) {
      alert('Failed to delete series.');
    } finally {
      setDeletingId(null);
      setSeriesToDelete(null);
    }
  };

  const seriess = data?.getSeries ?? [];
  const filtered = seriess.filter((m: any) =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    (m.overview ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-orange-500 mb-1">Series Management</h1>
          <p className="text-muted-foreground text-sm">
            {seriess.length} series{seriess.length !== 1 ? 's' : ''} in the database
          </p>
        </div>
        <button
          onClick={() => {
            setSeriesToEdit(null);
            setisOpen(true);
          }}
          className="bg-orange-500 px-5 py-2.5 text-sm font-bold hover:bg-orange-600 duration-200 rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2"
        >
          <span className="text-lg">+</span> Add Series
        </button>
      </div>

      {isOpen && (
        <SeriesUploadForm
          seriesToEdit={seriesToEdit}
          onClose={() => {
            setisOpen(false);
            setSeriesToEdit(null);
            refetch();
          }}
        />
      )}

      {addingSeasonForSeries && (
        <SeasonUploadForm
          seriesId={addingSeasonForSeries.id}
          seriesTitle={addingSeasonForSeries.title}
          onClose={() => setAddingSeasonForSeries(null)}
        />
      )}

      <ConfirmDialog
        isOpen={!!seriesToDelete}
        onClose={() => setSeriesToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Series"
        description={`Are you sure you want to delete "${seriesToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />

      {/* Search */}
      <div className="border border-border p-3 rounded-2xl flex items-center gap-2 bg-card">
        <IoSearchOutline size={20} color="gray" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search seriess by title or overview..."
          className="w-full bg-transparent focus:ring-0 outline-none text-sm"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-xs text-zinc-500 hover:text-foreground">
            Clear
          </button>
        )}
      </div>

      {/* States */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl h-72 animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm">
          Failed to load seriess: {error.message}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
          <Film size={48} className="opacity-20" />
          <p>{search ? `No seriess match "${search}"` : 'No seriess yet. Add your first one!'}</p>
        </div>
      )}

      {/* Series Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((series: any) => (
            <div
              key={series.id}
              className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-200 flex flex-col"
            >
              {/* Poster */}
              <div className="relative h-48 bg-zinc-900 flex items-center justify-center overflow-hidden">
                {series.posterPath ? (
                  <img
                    src={series.posterPath}
                    alt={series.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <Clapperboard size={36} className="text-zinc-700" />
                )}
                {/* Action buttons */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <button
                    onClick={() => {
                      setSeriesToEdit(series);
                      setisOpen(true);
                    }}
                    className="p-1.5 bg-black/60 hover:bg-orange-500 text-white rounded-lg transition-all duration-200"
                    title="Edit series"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setAddingSeasonForSeries({ id: series.id, title: series.title })}
                    className="p-1.5 bg-black/60 hover:bg-purple-500 text-white rounded-lg transition-all duration-200"
                    title="Add season to series"
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    onClick={() => setSeriesToDelete({ id: series.id, title: series.title })}
                    disabled={deletingId === series.id}
                    className="p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50"
                    title="Delete series"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                {/* Status badge */}
                {series.status && (
                  <span className={`absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLORS[series.status] ?? ''}`}>
                    {series.status.replace('_', ' ')}
                  </span>
                )}
                {series.adult && (
                  <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">18+</span>
                )}
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col gap-2 flex-1">
                <h3 className="font-bold text-sm leading-tight line-clamp-2">{series.title}</h3>

                {series.overview && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{series.overview}</p>
                )}

                <div className="flex flex-wrap gap-1 mt-auto pt-2">
                  {series.SeriesGenre?.slice(0, 3).map((mg: any) => (
                    <span key={mg.genre?.id} className="text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full">
                      {mg.genre?.name}
                    </span>
                  ))}
                  {series.SeriesGenre?.length > 3 && (
                    <span className="text-[10px] text-zinc-500 px-1">+{series.SeriesGenre.length - 3}</span>
                  )}
                </div>

                {series.runtime && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock size={11} />
                    {series.runtime} min
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Series;
