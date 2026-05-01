'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import UserNavBar from '@/components/UserNavBar';
import MovieCard from '@/components/MovieCard';
import SeriesCard from '@/components/SeriesCard';
import { Play, Info, Tv } from 'lucide-react';
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

const GET_SERIES = gql`
  query GetSeries {
    getSeries {
      id
      title
      overview
      posterPath
      dominantRating
      releaseDate
      adult
      SeriesGenre {
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

function BrowseContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';
  const { currentUser } = useAuth();

  const { data, loading, error } = useQuery(GET_MOVIES);
  const { data: seriesData, loading: seriesLoading } = useQuery(GET_SERIES);
  const { data: accessData } = useQuery(GET_ROUTE_ACCESS);
  const accessMap = buildAccessMap(accessData?.getRouteAccess ?? []);
  const userRole = ((currentUser?.role as Role) || 'user');
  const canSeeArated = isRouteAllowedInMap(accessMap, 'arated', userRole);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground animate-pulse">Loading...</p>
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
  let seriesList = seriesData?.getSeries || [];

  if (query) {
    movies = movies.filter((m: any) =>
      m.title.toLowerCase().includes(query) ||
      (m.overview && m.overview.toLowerCase().includes(query))
    );
    seriesList = seriesList.filter((s: any) =>
      s.title.toLowerCase().includes(query) ||
      (s.overview && s.overview.toLowerCase().includes(query))
    );
  }

  const featuredMovie = movies.length > 0 ? movies[Math.floor(Math.random() * movies.length)] : null;
  const heroImage = featuredMovie?.posterPath
    ? (featuredMovie.posterPath.startsWith('http') ? featuredMovie.posterPath : `https://image.tmdb.org/t/p/original${featuredMovie.posterPath}`)
    : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop';

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <UserNavBar />

      {/* Hero Section */}
      {featuredMovie && (
        <div className="relative h-[80vh] w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent"></div>
          </div>
          <div className="relative h-full flex items-center justify-center md:justify-start max-w-[96rem] mx-auto px-6">
            <div className="max-w-2xl space-y-4 md:space-y-6 pt-20 text-center md:text-left">
              <span className="text-primary font-bold tracking-wider uppercase text-[10px] sm:text-xs bg-primary/10 px-3 py-1 rounded-full border border-primary/20 w-fit mx-auto md:mx-0">Featured Movie</span>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight text-foreground drop-shadow-2xl line-clamp-2">
                {featuredMovie.title}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground line-clamp-3 max-w-xl mx-auto md:mx-0">{featuredMovie.overview}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
                <button className="bg-primary text-primary-foreground px-6 sm:px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/25">
                  <Play fill="currentColor" size={20} /> Play Now
                </button>
                <button className="bg-secondary/80 backdrop-blur-md text-foreground px-6 sm:px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-secondary transition-all border border-border">
                  <Info size={20} /> More Info
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[96rem] mx-auto px-6 -mt-20 relative z-10 space-y-12">
        {/* Trending Movies */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              Trending Movies
            </h2>
            <button className="text-sm text-primary hover:underline">View All</button>
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

        {/* Series Section */}
        {!seriesLoading && seriesList.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="w-1 h-6 bg-yellow-500 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]"></span>
                <Tv size={20} className="text-yellow-400" />
                Featured Series
              </h2>
              <Link href="/series" className="text-sm text-yellow-400 hover:underline">Explore All Series</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {seriesList.map((series: any) => {
                const poster = series.posterPath
                  ? (series.posterPath.startsWith('http') ? series.posterPath : `https://image.tmdb.org/t/p/w500${series.posterPath}`)
                  : 'https://via.placeholder.com/500x750';
                const releaseYear = series.releaseDate ? new Date(series.releaseDate).getFullYear() : 0;
                const genreName = series.SeriesGenre?.[0]?.genre?.name || 'Unknown';
                return (
                  <SeriesCard
                    key={series.id}
                    id={series.id}
                    title={series.title}
                    dominantRating={series.dominantRating || 'No Ratings'}
                    year={releaseYear}
                    category={genreName}
                    image={poster}
                    adult={series.adult}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* A-Rated Movies */}
        {canSeeArated && (() => {
          const aRatedMovies = movies.filter((m: any) => m.adult);
          if (aRatedMovies.length === 0) return null;
          return (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <span className="w-1 h-6 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)]"></span>
                  <span className="text-red-500 drop-shadow-md">A-Rated Collection</span>
                </h2>
                <button className="text-sm text-red-500 hover:text-red-400 hover:underline">View All</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {aRatedMovies.map((movie: any) => {
                  const poster = movie.posterPath
                    ? (movie.posterPath.startsWith('http') ? movie.posterPath : `https://image.tmdb.org/t/p/w500${movie.posterPath}`)
                    : 'https://via.placeholder.com/500x750';
                  const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 0;
                  const genreName = movie.MovieGenre?.[0]?.genre?.name || 'Unknown';
                  return (
                    <MovieCard
                      key={`arated-${movie.id}`}
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
          );
        })()}

        {/* New Movie Releases */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              New Releases
            </h2>
            <button className="text-sm text-primary hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...movies].reverse().map((movie: any) => {
              const poster = movie.posterPath
                ? (movie.posterPath.startsWith('http') ? movie.posterPath : `https://image.tmdb.org/t/p/w500${movie.posterPath}`)
                : 'https://via.placeholder.com/500x750';
              const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 0;
              const genreName = movie.MovieGenre?.[0]?.genre?.name || 'Unknown';
              return (
                <MovieCard
                  key={`new-${movie.id}`}
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

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div></div>}>
      <BrowseContent />
    </Suspense>
  );
}


