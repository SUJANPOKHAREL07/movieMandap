'use client';

import React from 'react';
import UserNavBar from '@/components/UserNavBar';
import MovieCard from '@/components/MovieCard';
import { Play, Info } from 'lucide-react';
import { useQuery, gql } from '@apollo/client';

const GET_MOVIES = gql`
  query GetMovies {
    getMovie {
      id
      title
      overview
      posterPath
      voteAverage
      releaseDate
      MovieGenre {
        genre {
          name
        }
      }
    }
  }
`;

export default function BrowsePage() {
  const { data, loading, error } = useQuery(GET_MOVIES);

  // Fallback/Loading UI
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

  const movies = data?.getMovie || [];
  
  // Select a random movie for the hero section
  const featuredMovie = movies.length > 0 
    ? movies[Math.floor(Math.random() * movies.length)]
    : null;

  const heroImage = featuredMovie?.posterPath 
    ? (featuredMovie.posterPath.startsWith('http') ? featuredMovie.posterPath : `https://image.tmdb.org/t/p/original${featuredMovie.posterPath}`)
    : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop';

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <UserNavBar />
      
      {/* Hero Section */}
      {featuredMovie && (
        <div className="relative h-[80vh] w-full overflow-hidden">
           {/* Background Image */}
           <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                  backgroundImage: `url(${heroImage})`,
              }}
           >
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent"></div>
           </div>

           {/* Hero Content */}
           <div className="relative h-full flex items-center max-w-[96rem] mx-auto px-6">
              <div className="max-w-2xl space-y-6 pt-20">
                  <span className="text-primary font-bold tracking-wider uppercase text-sm bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Featured Movie</span>
                  <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white drop-shadow-2xl line-clamp-2">
                      {featuredMovie.title}
                  </h1>
                  <p className="text-lg text-muted-foreground line-clamp-3">
                      {featuredMovie.overview}
                  </p>
                  <div className="flex items-center gap-4 pt-4">
                      <button className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/25">
                          <Play fill="currentColor" size={20} /> Play Now
                      </button>
                      <button className="bg-secondary/80 backdrop-blur-md text-foreground px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-secondary transition-all border border-white/10">
                          <Info size={20} /> More Info
                      </button>
                  </div>
              </div>
           </div>
        </div>
      )}

      {/* Movie Grid Section */}
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
                {movies.map((movie: any) => {
                    const poster = movie.posterPath 
                        ? (movie.posterPath.startsWith('http') ? movie.posterPath : `https://image.tmdb.org/t/p/w500${movie.posterPath}`)
                        : 'https://via.placeholder.com/500x750';
                    
                    const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 0;
                    const genreName = movie.MovieGenre?.[0]?.genre?.name || 'Unknown';

                    return (
                        <MovieCard 
                            key={movie.id}
                            title={movie.title}
                            rating={movie.voteAverage || 0}
                            year={releaseYear}
                            category={genreName}
                            image={poster}
                        />
                    );
                })}
            </div>
        </section>

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
                 {[...movies].reverse().map((movie: any) => {
                     const poster = movie.posterPath 
                         ? (movie.posterPath.startsWith('http') ? movie.posterPath : `https://image.tmdb.org/t/p/w500${movie.posterPath}`)
                         : 'https://via.placeholder.com/500x750';
                     
                     const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 0;
                     const genreName = movie.MovieGenre?.[0]?.genre?.name || 'Unknown';

                    return (
                        <MovieCard 
                            key={`new-${movie.id}`}
                            title={movie.title}
                            rating={movie.voteAverage || 0}
                            year={releaseYear}
                            category={genreName}
                            image={poster}
                        />
                    );
                })}
            </div>
        </section>
      </div>
    </div>
  );
}
