'use client';

import React, { useEffect, useState } from 'react';
import MovieList from './MovieList';
import { fetchGraphQL } from '../lib/graphql';

type Movie = {
  id: number;
  title: string;
  originalTitle?: string | null;
  overview?: string | null;
  posterPath?: string | null;
  releaseDate?: string | null;
};

export default function MovieGallery() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadMovies() {
    setLoading(true);
    setError(null);
    try {
      const query = `query GetAllMovieData { getAllMovieData { id title originalTitle overview posterPath releaseDate } }`;
      const data = await fetchGraphQL(query);
      setMovies(data?.getAllMovieData || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load movies');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMovies();
  }, []);

  const filtered = movies.filter((m) =>
    (m.title || '').toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Cine Gudi</h1>
          <p className="text-sm text-gray-500">
            Browse movies from the backend
          </p>
        </div>
        <div className="w-80">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search movies..."
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </header>

      {loading && <div className="p-6">Loading movies...</div>}
      {error && <div className="p-6 text-red-600">{error}</div>}

      {!loading && !error && <MovieList movies={filtered} />}
    </div>
  );
}
