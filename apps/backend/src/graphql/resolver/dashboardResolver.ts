import prisma from '../../prisma/client';

export const dashboardResolver = {
    Query: {
        getAdminDashboardStats: async () => {
            try {
                const [totalMovies, totalUsers, totalReviews] = await Promise.all([
                    prisma.movie.count(),
                    prisma.user.count(),
                    prisma.review.count(),
                ]);
                return { totalMovies, totalUsers, totalReviews };
            } catch (error) {
                console.error('Error fetching admin dashboard stats:', error);
                throw new Error('Failed to fetch admin dashboard stats');
            }
        },
        getTopReviewers: async (_: any, { limit }: { limit: number }) => {
            try {
                const topReviewers = await prisma.user.findMany({
                    orderBy: {
                        Review: {
                            _count: 'desc',
                        },
                    },
                    take: limit,
                    select: {
                        id: true,
                        username: true,
                        _count: {
                            select: { Review: true },
                        },
                    },
                });

                return topReviewers.map((user) => ({
                    id: user.id,
                    username: user.username,
                    reviewCount: user._count.Review,
                }));
            } catch (error) {
                console.error('Error fetching top reviewers:', error);
                throw new Error('Failed to fetch top reviewers');
            }
        },
        getTopMovies: async (_: any, { limit }: { limit: number }) => {
            try {
                const topMovies = await prisma.movie.findMany({
                    orderBy: {
                        Review: {
                            _count: 'desc',
                        },
                    },
                    take: limit,
                    select: {
                        id: true,
                        title: true,
                        posterPath: true,
                        _count: {
                            select: { Review: true },
                        },
                        Review: {
                            select: { rating: true },
                        },
                    },
                });

                const ratingMap: Record<string, number> = {
                    Worst: 1,
                    Bearable: 2,
                    Good_To_Watch: 3,
                    Worthy: 4,
                    Absolute_Cinema: 5
                };

                return topMovies.map((movie) => {
                    let totalScore = 0;
                    for (const review of movie.Review) {
                        totalScore += ratingMap[review.rating] || 3;
                    }
                    const averageRating = movie.Review.length > 0 ? (totalScore / movie.Review.length) : 0;

                    return {
                        id: movie.id,
                        title: movie.title,
                        posterPath: movie.posterPath,
                        reviewCount: movie._count.Review,
                        averageRating
                    };
                });
            } catch (error) {
                console.error('Error fetching top movies:', error);
                throw new Error('Failed to fetch top movies');
            }
        },
    },
};
