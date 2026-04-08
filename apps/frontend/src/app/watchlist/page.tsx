'use client';

import React from 'react';
import { useQuery, gql } from '@apollo/client';
import UserNavBar from '@/components/UserNavBar';
import { Bookmark, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const GET_WATCHLIST = gql`
  query GetAllWatchList {
    getAllWatchList {
      note
      status
      movie {
        title
        posterPath
      }
    }
  }
`;

export default function WatchlistPage() {
    const { data, loading, error } = useQuery(GET_WATCHLIST);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <p className="mt-4 text-muted-foreground animate-pulse">Loading your Watchlist...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <p className="text-xl text-destructive font-semibold">Error loading watchlist</p>
                <Link href="/" className="mt-6 text-primary hover:underline">Return to Browse</Link>
            </div>
        );
    }

    const watchlist = data?.getAllWatchList || [];

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <UserNavBar />

            <div className="max-w-[96rem] mx-auto px-6 pt-28 space-y-10">
                <div className="flex items-center gap-4 border-b border-border pb-6">
                    <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center border border-primary/20">
                        <Bookmark size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">My Watchlist</h1>
                        <p className="text-muted-foreground">Keep track of movies you want to watch</p>
                    </div>
                </div>

                {watchlist.length === 0 ? (
                    <div className="text-center py-20 bg-card/30 rounded-3xl border border-dashed border-border/50">
                        <Bookmark className="mx-auto text-muted-foreground mb-4 opacity-50" size={48} />
                        <h3 className="text-xl font-bold mb-2">Your watchlist is empty</h3>
                        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                            Looks like you haven't added any movies to your list yet. Start exploring to find something to watch!
                        </p>
                        <Link
                            href="/"
                            className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 inline-block"
                        >
                            Explore Movies
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {watchlist.map((item: any, idx: number) => {
                            const movie = item.movie;
                            const poster = movie.posterPath
                                ? (movie.posterPath.startsWith('http') ? movie.posterPath : `https://image.tmdb.org/t/p/w500${movie.posterPath}`)
                                : 'https://via.placeholder.com/500x750';

                            return (
                                <div key={idx} className="group flex flex-col bg-card rounded-2xl border border-border/50 overflow-hidden shadow-xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300">
                                    <div className="relative aspect-[2/3] overflow-hidden">
                                        <img src={poster} alt={movie.title} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="absolute top-3 right-3">
                                            {item.status === 'Watched' ? (
                                                <span className="flex items-center gap-1.5 bg-green-500/90 text-white text-xs font-bold px-2.5 py-1 rounded-md backdrop-blur-md shadow-lg">
                                                    <CheckCircle2 size={14} /> Watched
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 bg-black/70 border border-white/10 text-white text-xs font-bold px-2.5 py-1 rounded-md backdrop-blur-md shadow-lg">
                                                    <Clock size={14} /> To Watch
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-1">{movie.title}</h3>
                                        {item.note ? (
                                            <p className="text-sm text-muted-foreground italic bg-secondary/50 p-2.5 rounded-lg border border-border/30 mb-2">"{item.note}"</p>
                                        ) : (
                                            <div className="flex-1"></div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
