'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import UserNavBar from '@/components/UserNavBar';
import SeriesCard from '@/components/SeriesCard';
import { Play, Info } from 'lucide-react';
import { useQuery, gql } from '@apollo/client';
import { buildAccessMap, isRouteAllowedInMap, Role } from '@/lib/routeAccess';
import { useAuth } from '@/context/AuthContext';

const GET_SERIESS = gql`
  query GetSeriess {
    getSeries {
      id
      title
      overview
      posterPath
      voteAverage
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

  const { data, loading, error } = useQuery(GET_SERIESS);
  const { data: accessData } = useQuery(GET_ROUTE_ACCESS);
  const accessMap = buildAccessMap(accessData?.getRouteAccess ?? []);
  const userRole = ((currentUser?.role as Role) || 'user');
  const canSeeArated = isRouteAllowedInMap(accessMap, 'arated', userRole);

  // Fallback/Loading UI
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground animate-pulse">Loading Seriess...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-destructive">
        Error loading series: {error.message}
      </div>
    );
  }

  let series = data?.getSeries || [];

  // Filter if search query exists
  if (query) {
    series = series.filter((m: any) =>
      m.title.toLowerCase().includes(query) ||
      (m.overview && m.overview.toLowerCase().includes(query))
    );
  }

  // Select a random series for the hero section
  const featuredSeries = series.length > 0
    ? series[Math.floor(Math.random() * series.length)]
    : null;

  const heroImage = featuredSeries?.posterPath
    ? (featuredSeries.posterPath.startsWith('http') ? featuredSeries.posterPath : `https://image.tmdb.org/t/p/original${featuredSeries.posterPath}`)
    : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop';

  const splitTitle = featuredSeries?.title.split(' ') || [];
  const lastWord = splitTitle.pop();
  const restOfTitle = splitTitle.join(' ');

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 font-sans">
      <UserNavBar />

      {/* Editorial Hero Section */}
      {featuredSeries && (
        <div className="relative h-[85vh] w-full overflow-hidden flex items-center">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 scale-105"
            style={{
              backgroundImage: `url(${heroImage})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 w-full max-w-[96rem] mx-auto px-6">
            <div className="max-w-4xl space-y-8 pt-20 animate-fade-in-up">
              <div className="flex items-center gap-3 text-xs font-black tracking-[0.4em] uppercase text-primary stagger-1">
                <span className="w-8 h-px bg-primary"></span>
                Featured Series
              </div>
              <h1 className="text-editorial-hero title-glow stagger-2">
                <span className="text-white">{restOfTitle}</span>{' '}
                <span className="text-primary italic px-3">{lastWord}</span>
              </h1>
              <p className="text-2xl font-light text-muted-foreground line-clamp-2 max-w-2xl leading-relaxed italic-editorial stagger-3">
                "{featuredSeries.overview}"
              </p>
              <div className="flex items-center gap-6 pt-6 stagger-4">
                <button className="bg-primary text-black px-10 py-4 rounded-full font-black flex items-center gap-3 hover:scale-105 transition-all shadow-[0_0_30px_rgba(249,115,22,0.4)] uppercase tracking-widest text-xs">
                  <Play fill="currentColor" size={20} /> Play Now
                </button>
                <button className="bg-white/5 backdrop-blur-md text-white px-10 py-4 rounded-full font-black flex items-center gap-3 hover:bg-white/10 transition-all border border-white/10 uppercase tracking-widest text-xs">
                  <Info size={20} /> Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Series Grid Section */}
      <div className="max-w-[96rem] mx-auto px-6 -mt-20 relative z-10 space-y-12">
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              Trending Now
            </h2>
            <button className="text-sm text-primary hover:underline">View All</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {series.map((series: any) => {
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

        {/* A-Rated Seriess Section */}
        {canSeeArated && (() => {
          const aRatedSeriess = series.filter((m: any) => m.adult);
          if (aRatedSeriess.length === 0) return null;

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
                {aRatedSeriess.map((series: any) => {
                  const poster = series.posterPath
                    ? (series.posterPath.startsWith('http') ? series.posterPath : `https://image.tmdb.org/t/p/w500${series.posterPath}`)
                    : 'https://via.placeholder.com/500x750';

                  const releaseYear = series.releaseDate ? new Date(series.releaseDate).getFullYear() : 0;
                  const genreName = series.SeriesGenre?.[0]?.genre?.name || 'Unknown';

                  return (
                    <SeriesCard
                      key={`arated-${series.id}`}
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
          );
        })()}

        {/* Keeping strict structure from before, just reusing list for demo of second section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              New Releases
            </h2>
            <button className="text-sm text-primary hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...series].reverse().map((series: any) => {
              const poster = series.posterPath
                ? (series.posterPath.startsWith('http') ? series.posterPath : `https://image.tmdb.org/t/p/w500${series.posterPath}`)
                : 'https://via.placeholder.com/500x750';

              const releaseYear = series.releaseDate ? new Date(series.releaseDate).getFullYear() : 0;
              const genreName = series.SeriesGenre?.[0]?.genre?.name || 'Unknown';

              return (
                <SeriesCard
                  key={`new-${series.id}`}
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
