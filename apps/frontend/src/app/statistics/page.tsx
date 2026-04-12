'use client';

import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Clapperboard, Users, Star, Trophy, TrendingUp, Sparkles, Activity } from 'lucide-react';

const GET_DASHBOARD_STATS = gql`
  query GetAdminDashboardStats {
    getAdminDashboardStats {
      totalMovies
      totalUsers
      totalReviews
    }
  }
`;

const GET_TOP_REVIEWERS = gql`
  query GetTopReviewers($limit: Int!) {
    getTopReviewers(limit: $limit) {
      id
      username
      reviewCount
    }
  }
`;

const GET_TOP_MOVIES = gql`
  query GetTopMovies($limit: Int!) {
    getTopMovies(limit: $limit) {
      id
      title
      posterPath
      reviewCount
      averageRating
    }
  }
`;

export default function StatisticsShowcasePage() {
    const { data: statsData, loading: statsLoading } = useQuery(GET_DASHBOARD_STATS);
    const { data: reviewersData, loading: reviewersLoading } = useQuery(GET_TOP_REVIEWERS, { variables: { limit: 10 } });
    const { data: topMoviesData, loading: moviesLoading } = useQuery(GET_TOP_MOVIES, { variables: { limit: 10 } });

    const stats = statsData?.getAdminDashboardStats || { totalMovies: '—', totalUsers: '—', totalReviews: '—' };
    const topReviewers = reviewersData?.getTopReviewers || [];
    const topMovies = topMoviesData?.getTopMovies || [];

    return (
        <div className="min-h-screen pt-24 pb-16 px-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-orange-600/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

            <div className="max-w-[80rem] mx-auto relative z-10 space-y-12 fade-in-up">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-500 text-sm font-semibold tracking-wide border border-orange-500/20">
                        <Sparkles size={16} /> MovieMandap Stats
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Showcase</span></h1>
                    <p className="text-lg text-muted-foreground">
                        Explore the pulse of our community. Real-time statistics, top trending movies, and our most dedicated reviewers.
                    </p>
                </div>

                {/* Global Stats Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="relative group bg-card/60 backdrop-blur-xl border border-border/60 hover:border-orange-500/50 p-8 rounded-3xl text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 stagger-1 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform duration-500">
                            <Clapperboard size={32} />
                        </div>
                        <p className="text-5xl font-black mb-2">{statsLoading ? '...' : stats.totalMovies}</p>
                        <p className="text-muted-foreground font-medium uppercase tracking-wider text-sm">Indexed Movies</p>
                    </div>

                    <div className="relative group bg-card/60 backdrop-blur-xl border border-border/60 hover:border-orange-500/50 p-8 rounded-3xl text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 stagger-2 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform duration-500">
                            <Users size={32} />
                        </div>
                        <p className="text-5xl font-black mb-2">{statsLoading ? '...' : stats.totalUsers}</p>
                        <p className="text-muted-foreground font-medium uppercase tracking-wider text-sm">Active Cinephiles</p>
                    </div>

                    <div className="relative group bg-card/60 backdrop-blur-xl border border-border/60 hover:border-orange-500/50 p-8 rounded-3xl text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 stagger-3 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform duration-500">
                            <Star size={32} />
                        </div>
                        <p className="text-5xl font-black mb-2">{statsLoading ? '...' : stats.totalReviews}</p>
                        <p className="text-muted-foreground font-medium uppercase tracking-wider text-sm">Reviews Penned</p>
                    </div>
                </div>

                {/* Detailed Lists */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">

                    {/* Top Movies Showcase */}
                    <div className="space-y-6 stagger-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500">
                                <TrendingUp size={20} />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">Most Discussed Movies</h2>
                        </div>

                        <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-3xl p-6 md:p-8">
                            {moviesLoading ? (
                                <div className="space-y-4 animate-pulse">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="flex gap-4 items-center">
                                            <div className="w-12 h-16 bg-muted/20 rounded-md"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-muted/20 w-1/3 rounded"></div>
                                                <div className="h-3 bg-muted/20 w-1/4 rounded"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : topMovies.length === 0 ? (
                                <p className="text-muted-foreground text-center py-10">No movies found.</p>
                            ) : (
                                <div className="space-y-4">
                                    {topMovies.map((movie: any, idx: number) => (
                                        <div key={movie.id} className="group relative flex items-center gap-4 p-4 rounded-2xl border border-transparent hover:border-orange-500/20 hover:bg-orange-500/5 transition-all duration-300">
                                            <div className="absolute -left-3 font-mono text-4xl font-black text-orange-500/10 group-hover:text-orange-500/20 transition-colors z-0">
                                                {idx + 1}
                                            </div>
                                            <div className="relative z-10 w-14 h-20 bg-muted/30 rounded-lg overflow-hidden shrink-0 border border-border/50 shadow-md">
                                                {movie.posterPath ? (
                                                    <img src={movie.posterPath} alt={movie.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30 bg-secondary/20">
                                                        <Clapperboard size={16} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="relative z-10 flex-1 min-w-0">
                                                <p className="text-lg font-bold truncate leading-tight mb-1">{movie.title}</p>
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1 font-medium"><Star size={14} className="text-orange-400 fill-current" /> {movie.averageRating.toFixed(1)}</span>
                                                    <span className="w-1 h-1 rounded-full bg-border"></span>
                                                    <span className="flex items-center gap-1"><Activity size={14} /> {movie.reviewCount} Reviews</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Top Reviewers Showcase */}
                    <div className="space-y-6 stagger-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500">
                                <Trophy size={20} />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">Cinephile Leaderboard</h2>
                        </div>

                        <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-3xl p-6 md:p-8">
                            {reviewersLoading ? (
                                <div className="space-y-4 animate-pulse">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="flex gap-4 items-center">
                                            <div className="w-12 h-12 bg-muted/20 rounded-full"></div>
                                            <div className="flex-1 h-4 bg-muted/20 w-1/3 rounded"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : topReviewers.length === 0 ? (
                                <p className="text-muted-foreground text-center py-10">No reviewers found.</p>
                            ) : (
                                <div className="space-y-4">
                                    {topReviewers.map((reviewer: any, idx: number) => (
                                        <div key={reviewer.id} className="group flex items-center gap-4 p-4 rounded-2xl border border-transparent hover:border-orange-500/20 hover:bg-orange-500/5 transition-all duration-300">
                                            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold shadow-lg shrink-0">
                                                {idx === 0 && <Trophy size={14} className="absolute -top-1 -right-1 text-yellow-300 fill-current" />}
                                                {reviewer.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-lg font-bold truncate">@{reviewer.username}</p>
                                                <p className="text-sm text-orange-500/80 font-medium">{reviewer.reviewCount} Reviews Written</p>
                                            </div>
                                            <div className="font-mono text-2xl font-black text-border group-hover:text-orange-500/30 transition-colors">
                                                #{idx + 1}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
