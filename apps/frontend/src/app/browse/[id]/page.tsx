'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, gql } from '@apollo/client';
import UserNavBar from '@/components/UserNavBar';
import { Play, Star, Calendar, Clock, ArrowLeft } from 'lucide-react';

const GET_MOVIES = gql`
  query GetMovies {
    getMovie {
      id
      title
      overview
      posterPath
      voteAverage
      releaseDate
      runtime
      MovieGenre {
        genre {
          name
        }
      }
    }
  }
`;

const GET_REVIEWS = gql`
  query GetAllReviewOfMovie($movieName: String!) {
    getAllReviewOfMovie(movieName: $movieName) {
      id
      title
      content
      rating
      isSpoiler
      creadtedAt
      user {
        username
      }
    }
  }
`;

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  // 1. Fetch all movies (since API doesn't support getById)
  const { data: movieData, loading: movieLoading, error: movieError } = useQuery(GET_MOVIES);

  // 2. Find the specific movie
  const movie = movieData?.getMovie?.find((m: any) => String(m.id) === String(id));

  // 3. Fetch reviews only if movie is found
  const { data: reviewData, loading: reviewLoading } = useQuery(GET_REVIEWS, {
    variables: { movieName: movie?.title || '' },
    skip: !movie,
  });

  if (movieLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (movieError || !movie) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-muted-foreground gap-4">
        <p className="text-xl">Movie not found</p>
        <button onClick={() => router.back()} className="text-primary hover:underline">Go Back</button>
      </div>
    );
  }

  const poster = movie.posterPath 
    ? (movie.posterPath.startsWith('http') ? movie.posterPath : `https://image.tmdb.org/t/p/original${movie.posterPath}`)
    : 'https://via.placeholder.com/500x750';

  const reviews = reviewData?.getAllReviewOfMovie || [];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <UserNavBar />

      {/* Backdrop / Hero */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 blur-sm transform scale-105"
          style={{ backgroundImage: `url(${poster})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        
        <div className="absolute top-24 left-6 z-20">
            <button 
                onClick={() => router.back()} 
                className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
            >
                <ArrowLeft size={20} /> Back
            </button>
        </div>

        <div className="relative z-10 max-w-[96rem] mx-auto px-6 h-full flex items-end md:items-center pb-12 md:pb-0">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-end w-full">
            {/* Poster Card */}
            <div className="hidden md:block w-64 lg:w-80 rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 rotate-1 hover:rotate-0 transition-transform duration-300">
                <img src={poster} alt={movie.title} className="w-full h-auto object-cover" />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-6 md:mb-10">
                <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
                    {movie.MovieGenre?.map((g: any, i: number) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/20 backdrop-blur-md">
                            {g.genre.name}
                        </span>
                    ))}
                    {movie.releaseDate && (
                        <span className="flex items-center gap-1.5 text-gray-300 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                            <Calendar size={14} /> {new Date(movie.releaseDate).getFullYear()}
                        </span>
                    )}
                    {movie.runtime && (
                        <span className="flex items-center gap-1.5 text-gray-300 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                            <Clock size={14} /> {movie.runtime}m
                        </span>
                    )}
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-xl">{movie.title}</h1>
                
                <p className="text-lg text-gray-300 max-w-3xl leading-relaxed drop-shadow-md">
                    {movie.overview || "No overview available."}
                </p>

                <div className="flex items-center gap-6 pt-4">
                    <button className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/25 transform hover:scale-105">
                        <Play fill="currentColor" size={20} /> Watch Movie
                    </button>
                    <div className="flex items-center gap-2">
                        <Star className="text-yellow-400 fill-yellow-400" size={28} />
                        <span className="text-2xl font-bold text-white">{movie.voteAverage?.toFixed(1) || 'N/A'}</span>
                        <span className="text-gray-400 text-sm mt-1">/ 10</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details & Reviews Section */}
      <div className="max-w-5xl mx-auto px-6 mt-16 space-y-16">
        
        {/* Reviews Section */}
        <section>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 border-b border-border p-b-4">
                User Reviews <span className="text-sm font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">{reviews.length}</span>
            </h2>
            
            {reviewLoading ? (
                <p className="text-muted-foreground">Loading reviews...</p>
            ) : reviews.length > 0 ? (
                <div className="grid gap-6">
                    {reviews.map((review: any) => (
                        <div key={review.id} className="bg-card p-6 rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold">
                                        {review.user?.username?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white leading-none">{review.user?.username || "Anonymous"}</h4>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star 
                                                        key={i} 
                                                        size={12} 
                                                        className={review.rating === 'Absolute_Cinema' || (i < 4 && review.rating === 'Worthy') ? "text-yellow-400 fill-yellow-400" : "text-gray-600"} 
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs text-muted-foreground">{new Date(Number(review.creadtedAt)).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                {review.isSpoiler && (
                                    <span className="text-xs bg-red-500/10 text-red-500 px-2 py-1 rounded border border-red-500/20">Spoiler</span>
                                )}
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-foreground">{review.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{review.content}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-secondary/20 rounded-xl border border-dashed border-border">
                    <p className="text-muted-foreground">No reviews yet. Be the first to share your thoughts!</p>
                </div>
            )}
        </section>

      </div>
    </div>
  );
}
