'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import UserNavBar from '@/components/UserNavBar';
import MovieCard from '@/components/MovieCard';
import { Play, Film } from 'lucide-react';
import { useQuery, gql } from '@apollo/client';
import { buildAccessMap, isRouteAllowedInMap, Role } from '@/lib/routeAccess';
import { useAuth } from '@/context/AuthContext';

const GET_MOVIES = gql`
  query GetMovies {
    getMovie {
      id
      title
      overview
      posterPath
      voteAverage
      dominantRating
      releaseDate
      adult
      MovieGenre {
        genre {
          name
        }
      }
    }
  }
`;

const GET_ROUTE_ACCESS = gql`
  query GetRouteAccess {
    getRouteAccess {
      routeId
      role
      allowed
    }
  }
`;

function MoviesContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';
  const { currentUser } = useAuth();

  const { data, loading, error } = useQuery(GET_MOVIES);
  const { data: accessData } = useQuery(GET_ROUTE_ACCESS);
  const accessMap = buildAccessMap(accessData?.getRouteAccess ?? []);
  const userRole = ((currentUser?.role as Role) || 'user');

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground animate-pulse">Loading Movies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-destructive">
        Error loading movies: {error.message}
      </div>
    );
  }

  let movies = data?.getMovie || [];

  if (query) {
    movies = movies.filter((m: any) =>
      m.title.toLowerCase().includes(query) ||
      (m.overview && m.overview.toLowerCase().includes(query))
    );
  }

  const featuredMovie = movies.length > 0 ? movies[0] : null;
  const heroImage = featuredMovie?.posterPath
    ? (featuredMovie.posterPath.startsWith('http') ? featuredMovie.posterPath : `https://image.tmdb.org/t/p/original${featuredMovie.posterPath}`)
    : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2659&auto=format&fit=crop';

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <UserNavBar />

      {/* Hero Section */}
      {featuredMovie && (
        <div className="relative h-[60vh] w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent"></div>
          </div>
          <div className="relative h-full flex items-center justify-center md:justify-start max-w-[96rem] mx-auto px-6">
            <div className="max-w-2xl space-y-4 md:space-y-6 pt-20 text-center md:text-left">
              <span className="text-primary font-bold tracking-wider uppercase text-[10px] sm:text-xs bg-primary/10 px-3 py-1 rounded-full border border-primary/20 flex items-center gap-2 w-fit mx-auto md:mx-0">
                <Film size={14} /> Cinema Experience
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-foreground drop-shadow-2xl line-clamp-2">
                Explore All Movies
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto md:mx-0">Discover our entire collection of blockbuster films and indie gems.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[96rem] mx-auto px-6 -mt-20 relative z-10 space-y-12">
        {/* All Movies Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              All Movies
            </h2>
            <span className="text-sm text-muted-foreground">{movies.length} titles available</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie: any) => {
              const poster = movie.posterPath
                ? (movie.posterPath.startsWith('http') ? movie.posterPath : `https://image.tmdb.org/t/p/w500${movie.posterPath}`)
                : 'https://via.placeholder.com/500x750';
              const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 0;
              const genreName = movie.MovieGenre?.[0]?.genre?.name || 'Unknown';
              return (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  dominantRating={movie.dominantRating || 'No Ratings'}
                  year={releaseYear}
                  category={genreName}
                  image={poster}
                  adult={movie.adult}
                />
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function MoviesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div></div>}>
      <MoviesContent />
    </Suspense>
  );
}
