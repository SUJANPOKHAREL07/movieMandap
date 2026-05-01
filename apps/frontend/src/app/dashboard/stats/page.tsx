'use client';

import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Clapperboard, BarChart3, Users, Star, Trophy } from 'lucide-react';

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

export default function StatsPage() {
    const { data: statsData, loading: statsLoading } = useQuery(GET_DASHBOARD_STATS);
    const { data: reviewersData, loading: reviewersLoading } = useQuery(GET_TOP_REVIEWERS, { variables: { limit: 5 } });
    const { data: topMoviesData, loading: moviesLoading } = useQuery(GET_TOP_MOVIES, { variables: { limit: 5 } });

    const stats = statsData?.getAdminDashboardStats || { totalMovies: '—', totalUsers: '—', totalReviews: '—' };
    const topReviewers = reviewersData?.getTopReviewers || [];
    const topMovies = topMoviesData?.getTopMovies || [];

    return (
        <div className="space-y-8 fade-in-up">
            <div>
                <h1 className="text-3xl font-bold mb-1">Dashboard Analytics</h1>
                <p className="text-muted-foreground">
                    Platform-wide real-time visualizations and statistics.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4 transition-all duration-500 stagger-1 shadow-sm hover:shadow-md hover:border-primary/50 hover:-translate-y-[2px]">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-transform duration-300 hover:scale-110">
                        <Clapperboard size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">Total Movies</p>
                        <p className="text-3xl font-bold">{statsLoading ? '...' : stats.totalMovies}</p>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4 transition-all duration-500 stagger-2 shadow-sm hover:shadow-md hover:border-primary/50 hover:-translate-y-[2px]">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-transform duration-300 hover:scale-110">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">Total Users</p>
                        <p className="text-3xl font-bold">{statsLoading ? '...' : stats.totalUsers}</p>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4 transition-all duration-500 stagger-3 shadow-sm hover:shadow-md hover:border-primary/50 hover:-translate-y-[2px]">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-transform duration-300 hover:scale-110">
                        <Star size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">Total Reviews</p>
                        <p className="text-3xl font-bold">{statsLoading ? '...' : stats.totalReviews}</p>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4 transition-all duration-500 stagger-4 shadow-sm hover:shadow-md hover:border-primary/50 hover:-translate-y-[2px]">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-transform duration-300 hover:scale-110">
                        <BarChart3 size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">Platform</p>
                        <p className="text-3xl font-bold">Live</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                {/* Top Movies */}
                <div className="bg-card border border-border rounded-2xl p-6 flex flex-col transition-all duration-500 stagger-5 shadow-sm hover:shadow-md hover:border-primary/30">
                    <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                        <Trophy className="text-primary" size={24} />
                        <h2 className="text-xl font-bold">Top Trending Movies</h2>
                    </div>
                    {moviesLoading ? (
                        <div className="flex animate-pulse flex-col space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-16 bg-muted/20 rounded-lg w-full"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {(() => {
                                const maxReviews = Math.max(...topMovies.map((m: any) => m.reviewCount), 1);
                                return topMovies.map((movie: any, idx: number) => (
                                    <div key={movie.id} className="relative z-10 flex flex-col p-3 rounded-lg bg-background border border-border hover:bg-orange-500/5 transition-all duration-300 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs">
                                                    {idx + 1}
                                                </div>
                                                <p className="font-semibold text-sm">{movie.title}</p>
                                            </div>
                                            <div className="flex gap-3 text-xs">
                                                <span className="flex items-center gap-1 text-muted-foreground"><Star size={10} className="text-yellow-500 fill-current" /> {movie.averageRating.toFixed(1)}</span>
                                            </div>
                                        </div>

                                        {/* Horizontal Bar Chart representation */}
                                        <div className="mt-3 flex items-center gap-3 w-full">
                                            <div className="flex-1 bg-primary/10 rounded-full h-2 overflow-hidden flex">
                                                <div
                                                    className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                                                    style={{ width: `${(movie.reviewCount / maxReviews) * 100}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs font-bold w-16 text-right">{movie.reviewCount} <span className="text-muted-foreground font-normal">revs</span></p>
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                    )}
                </div>

                {/* Top Reviewers */}
                <div className="bg-card border border-border rounded-2xl p-6 flex flex-col transition-all duration-500 stagger-6 shadow-sm hover:shadow-md hover:border-primary/30">
                    <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                        <Users className="text-primary" size={24} />
                        <h2 className="text-xl font-bold">Top Active Reviewers</h2>
                    </div>
                    {reviewersLoading ? (
                        <div className="flex animate-pulse flex-col space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-16 bg-muted/20 rounded-lg w-full"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {(() => {
                                const maxReviews = Math.max(...topReviewers.map((r: any) => r.reviewCount), 1);
                                return topReviewers.map((reviewer: any, idx: number) => (
                                    <div key={reviewer.id} className="relative z-10 flex flex-col p-3 rounded-lg bg-background border border-border hover:bg-primary/5 transition-all duration-300 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs">
                                                {idx + 1}
                                            </div>
                                            <p className="font-semibold tracking-wide text-sm">@{reviewer.username}</p>
                                        </div>
                                        <div className="mt-3 flex items-center gap-3 w-full">
                                            <div className="flex-1 bg-primary/10 rounded-full h-2 overflow-hidden flex">
                                                <div
                                                    className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                                                    style={{ width: `${(reviewer.reviewCount / maxReviews) * 100}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs font-bold w-16 text-right text-primary">{reviewer.reviewCount} <span className="text-muted-foreground font-normal">revs</span></p>
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
