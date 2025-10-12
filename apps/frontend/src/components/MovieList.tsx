import React from 'react';

type Movie = {
  id: number;
  title: string;
  originalTitle?: string | null;
  overview?: string | null;
  posterPath?: string | null;
  releaseDate?: string | null;
};

export function MovieList({ movies }: { movies: Movie[] }) {
  if (!movies || movies.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600">No movies found.</div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-6">
      {movies.map((m) => (
        <div
          key={m.id}
          className="bg-white shadow rounded overflow-hidden hover:shadow-lg transition-shadow"
        >
          {m.posterPath ? (
            // posterPath served from backend /uploads
            <img
              src={
                m.posterPath.startsWith('http')
                  ? m.posterPath
                  : `${
                      process.env.NEXT_PUBLIC_BACKEND_URL ||
                      'http://localhost:8000'
                    }${m.posterPath}`
              }
              alt={m.title}
              className="w-full h-56 object-cover"
            />
          ) : (
            <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          <div className="p-4">
            <h3 className="font-semibold text-lg">{m.title}</h3>
            {m.originalTitle && (
              <p className="text-sm text-gray-500">{m.originalTitle}</p>
            )}
            {m.releaseDate && (
              <p className="mt-2 text-sm text-gray-600">{m.releaseDate}</p>
            )}
            {m.overview && (
              <p className="mt-3 text-sm text-gray-700 line-clamp-3">
                {m.overview}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MovieList;
