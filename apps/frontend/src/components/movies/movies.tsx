'use client';

import React, { useState } from 'react';
import MovieUploadForm from './MovieUploadForm';
import { IoSearchOutline } from 'react-icons/io5';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Clapperboard, Trash2, Clock, Film, Pencil } from 'lucide-react';
import ConfirmDialog from '../ConfirmDialog';
import AdminAlert from '../AdminAlert';

const GET_MOVIES = gql`
  query GetMovies {
    getMovie {
      id
      title
      originalTitle
      overview
      posterPath
      runtime
      status
      releaseDate
      adult
      MovieGenre {
        genre {
          id
          name
        }
      }
    }
  }
`;

const DELETE_MOVIE = gql`
  mutation DeleteMovie($title: String) {
    deleteMovie(title: $title) {
      success
      message
    }
  }
`;

const STATUS_COLORS: Record<string, string> = {
  RELEASED: 'bg-green-500/10 text-green-400 border-green-500/20',
  IN_PRODUCTION: 'bg-primary/10 text-primary border-primary/20',
  POST_PRODUCTION: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  PLANNED: 'bg-primary/10 text-primary border-primary/20',
  CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/20',
  RUMORED: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
};

const Movies = () => {
  const [isOpen, setisOpen] = useState(false);
  const [movieToEdit, setMovieToEdit] = useState<any>(null);
  const [movieToDelete, setMovieToDelete] = useState<{ id: number; title: string } | null>(null);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [alertInfo, setAlertInfo] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_MOVIES);
  const [deleteMovie] = useMutation(DELETE_MOVIE);

  const confirmDelete = async () => {
    if (!movieToDelete) return;
    setDeletingId(movieToDelete.id);
    try {
      await deleteMovie({ variables: { title: movieToDelete.title } });
      await refetch();
      setAlertInfo({ type: 'success', message: `Movie "${movieToDelete.title}" deleted successfully.` });
      setTimeout(() => setAlertInfo(null), 3000);
    } catch (e: any) {
      setAlertInfo({ type: 'error', message: e.message || 'Failed to delete movie.' });
    } finally {
      setDeletingId(null);
      setMovieToDelete(null);
    }
  };

  const movies = data?.getMovie ?? [];
  const filtered = movies.filter((m: any) =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    (m.overview ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="space-y-8">
      {alertInfo && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] w-full max-w-lg px-4 pointer-events-none">
          <div className="pointer-events-auto">
            <AdminAlert
              type={alertInfo.type}
              message={alertInfo.message}
              onClose={() => setAlertInfo(null)}
            />
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-1">Movies Management</h1>
          <p className="text-muted-foreground text-sm">
            {movies.length} blockbuster titles in your library
          </p>
        </div>
        <button
          onClick={() => {
            setMovieToEdit(null);
            setisOpen(true);
          }}
          className="w-full sm:w-auto bg-primary text-black font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
        >
          <Clapperboard size={18} /> Add Movie
        </button>
      </div>

      {/* Search Input */}
      <div className="border border-border p-3 rounded-2xl flex items-center gap-2 bg-card shadow-sm transition-all focus-within:border-primary/50">
        <IoSearchOutline size={20} className="text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search movies by title, overview..."
          className="w-full bg-transparent focus:ring-0 outline-none text-sm"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-xs text-zinc-500 hover:text-foreground">
            Clear
          </button>
        )}
      </div>

      {isOpen && (
        <MovieUploadForm
          movieToEdit={movieToEdit}
          onClose={(alert) => {
            setisOpen(false);
            setMovieToEdit(null);
            if (alert) {
              setAlertInfo(alert);
              setTimeout(() => setAlertInfo(null), 3000);
            }
            refetch();
          }}
        />
      )}

      <ConfirmDialog
        isOpen={!!movieToDelete}
        onClose={() => setMovieToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Movie"
        description={`Are you sure you want to delete "${movieToDelete?.title}"? This action cannot be undone.`}
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
          placeholder="Search movies by title or overview..."
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
        <AdminAlert
          type="error"
          title="Loading Error"
          message={`Failed to load movies: ${error.message}`}
        />
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
          <Film size={48} className="opacity-20" />
          <p>{search ? `No movies match "${search}"` : 'No movies yet. Add your first one!'}</p>
        </div>
      )}

      {/* Movie Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((movie: any) => (
            <div
              key={movie.id}
              className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 flex flex-col"
            >
              {/* Poster */}
              <div className="relative h-48 bg-zinc-900 flex items-center justify-center overflow-hidden">
                {movie.posterPath ? (
                  <img
                    src={movie.posterPath}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <Clapperboard size={36} className="text-zinc-700" />
                )}
                {/* Action buttons */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <button
                    onClick={() => {
                      setMovieToEdit(movie);
                      setisOpen(true);
                    }}
                    className="p-1.5 bg-black/60 hover:bg-primary hover:text-black text-white rounded-lg transition-all duration-200"
                    title="Edit movie"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setMovieToDelete({ id: movie.id, title: movie.title })}
                    disabled={deletingId === movie.id}
                    className="p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50"
                    title="Delete movie"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                {/* Status badge */}
                {movie.status && (
                  <span className={`absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLORS[movie.status] ?? ''}`}>
                    {movie.status.replace('_', ' ')}
                  </span>
                )}
                {movie.adult && (
                  <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">18+</span>
                )}
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col gap-2 flex-1">
                <h3 className="font-bold text-sm leading-tight line-clamp-2">{movie.title}</h3>

                {movie.overview && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{movie.overview}</p>
                )}

                <div className="flex flex-wrap gap-1 mt-auto pt-2">
                  {movie.MovieGenre?.slice(0, 3).map((mg: any) => (
                    <span key={mg.genre?.id} className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                      {mg.genre?.name}
                    </span>
                  ))}
                  {movie.MovieGenre?.length > 3 && (
                    <span className="text-[10px] text-zinc-500 px-1">+{movie.MovieGenre.length - 3}</span>
                  )}
                </div>

                {movie.runtime && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock size={11} />
                    {movie.runtime} min
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

export default Movies;
