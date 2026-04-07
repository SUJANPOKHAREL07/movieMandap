'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, gql } from '@apollo/client';
import UserNavBar from '@/components/UserNavBar';
import { Play, Star, Calendar, Clock, ArrowLeft, BookmarkPlus, PenLine, Check } from 'lucide-react';

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
      comments {
        id
        content
        user {
          username
        }
      }
    }
  }
`;

const CREATE_COMMENT = gql`
  mutation CreateComment($content: String!, $reviewId: Int!) {
    createComment(content: $content, reviewId: $reviewId) {
      success
      message
    }
  }
`;

const CREATE_REVIEW = gql`
  mutation CreateReview(
    $title: String!
    $content: String!
    $rating: Ratings!
    $isSpoiler: Boolean!
    $movieName: String!
  ) {
    createReview(
      title: $title
      content: $content
      rating: $rating
      isSpoiler: $isSpoiler
      movieName: $movieName
    ) {
      success
      message
    }
  }
`;

const ADD_WATCHLIST = gql`
  mutation CreateWatchList($movieName: String!, $note: String) {
    createWatchList(movieName: $movieName, note: $note) {
      success
      message
    }
  }
`;

const RATINGS = [
  { value: 'Worst', label: '★ Worst' },
  { value: 'Bearable', label: '★★ Bearable' },
  { value: 'Good_To_Watch', label: '★★★ Good To Watch' },
  { value: 'Worthy', label: '★★★★ Worthy' },
  { value: 'Absolute_Cinema', label: '★★★★★ Absolute Cinema' },
];

const ReviewCard = ({ review, onRefetch }: { review: any, onRefetch: () => void }) => {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [addComment, { loading: addingComment }] = useMutation(CREATE_COMMENT, {
    onCompleted: () => {
      setCommentText('');
      setShowCommentBox(false);
      onRefetch();
    }
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment({ variables: { content: commentText, reviewId: review.id } });
  };

  return (
    <div className="bg-card p-6 rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
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
      <p className="text-gray-400 leading-relaxed mb-4">{review.content}</p>

      {/* Action Bar */}
      <div className="flex items-center gap-4 text-sm mt-4 border-t border-border/50 pt-4">
        <button
          onClick={() => setShowCommentBox(!showCommentBox)}
          className="text-muted-foreground hover:text-primary transition-colors font-semibold"
        >
          {review.comments?.length || 0} Comments
        </button>
      </div>

      {showCommentBox && (
        <div className="mt-4 pt-4 border-t border-border/50">
          {/* List existing comments */}
          <div className="space-y-4 mb-4">
            {review.comments?.map((comment: any) => (
              <div key={comment.id} className="flex gap-3 items-start bg-secondary/30 p-3 rounded-lg border border-border/30">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                  {comment.user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <span className="text-sm font-bold text-white mr-2">{comment.user?.username || 'Anonymous'}</span>
                  <p className="text-sm text-gray-300 mt-1">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-secondary border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white"
            />
            <button disabled={addingComment || !commentText.trim()} type="submit" className="bg-primary text-black px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-orange-600 transition-colors">
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    title: '',
    content: '',
    rating: 'Good_To_Watch',
    isSpoiler: false,
  });
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Watchlist state
  const [watchlistAdded, setWatchlistAdded] = useState(false);

  // 1. Fetch all movies (since API doesn't support getById)
  const { data: movieData, loading: movieLoading, error: movieError } = useQuery(GET_MOVIES);

  // 2. Find the specific movie
  const movie = movieData?.getMovie?.find((m: any) => String(m.id) === String(id));

  // 3. Fetch reviews only if movie is found
  const { data: reviewData, loading: reviewLoading, refetch: refetchReviews } = useQuery(GET_REVIEWS, {
    variables: { movieName: movie?.title || '' },
    skip: !movie,
  });

  const [createReview, { loading: submittingReview }] = useMutation(CREATE_REVIEW);
  const [addToWatchlist, { loading: addingWatchlist }] = useMutation(ADD_WATCHLIST);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    if (!reviewForm.title.trim() || !reviewForm.content.trim()) {
      setReviewError('Title and content are required.');
      return;
    }
    try {
      const { data } = await createReview({
        variables: {
          title: reviewForm.title,
          content: reviewForm.content,
          rating: reviewForm.rating,
          isSpoiler: reviewForm.isSpoiler,
          movieName: movie?.title,
        },
      });
      if (data?.createReview?.success) {
        setReviewSuccess(true);
        setReviewForm({ title: '', content: '', rating: 'Good_To_Watch', isSpoiler: false });
        setShowReviewForm(false);
        await refetchReviews();
        setTimeout(() => setReviewSuccess(false), 3000);
      } else {
        setReviewError(data?.createReview?.message || 'Failed to submit review');
      }
    } catch (err: any) {
      setReviewError(err.message || 'An error occurred');
    }
  };

  const handleAddToWatchlist = async () => {
    try {
      const { data } = await addToWatchlist({ variables: { movieName: movie?.title } });
      if (data?.createWatchList?.success) setWatchlistAdded(true);
    } catch (err) {
      // silently fail
    }
  };

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

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/25 transform hover:scale-105">
                  <Play fill="currentColor" size={20} /> Watch Movie
                </button>
                <button
                  onClick={handleAddToWatchlist}
                  disabled={addingWatchlist || watchlistAdded}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold border border-white/20 bg-white/5 hover:bg-white/10 transition-all disabled:opacity-60"
                >
                  {watchlistAdded ? <Check size={18} className="text-green-400" /> : <BookmarkPlus size={18} />}
                  {watchlistAdded ? 'Added' : 'My List'}
                </button>
                <div className="flex items-center gap-2 ml-auto">
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
          <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              User Reviews <span className="text-sm font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">{reviews.length}</span>
            </h2>
            <button
              onClick={() => { setShowReviewForm(!showReviewForm); setReviewError(''); }}
              className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              <PenLine size={15} /> {showReviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          </div>

          {/* Success Toast */}
          {reviewSuccess && (
            <div className="mb-6 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-400 text-sm">
              <Check size={16} /> Review submitted successfully!
            </div>
          )}

          {/* Write a Review Form */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mb-10 bg-card border border-border rounded-2xl p-6 space-y-5">
              <h3 className="font-bold text-lg">Your Review</h3>

              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Title</label>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={e => setReviewForm({ ...reviewForm, title: e.target.value })}
                  placeholder="Give your review a title"
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Your thoughts</label>
                <textarea
                  value={reviewForm.content}
                  onChange={e => setReviewForm({ ...reviewForm, content: e.target.value })}
                  placeholder="Share what you thought about this movie..."
                  rows={4}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Rating</label>
                  <select
                    value={reviewForm.rating}
                    onChange={e => setReviewForm({ ...reviewForm, rating: e.target.value })}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  >
                    {RATINGS.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end gap-3 pb-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-sm">
                    <div
                      onClick={() => setReviewForm({ ...reviewForm, isSpoiler: !reviewForm.isSpoiler })}
                      className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${reviewForm.isSpoiler ? 'bg-red-500' : 'bg-secondary'
                        }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${reviewForm.isSpoiler ? 'translate-x-4' : ''}`} />
                    </div>
                    <span className="text-muted-foreground">Contains Spoiler</span>
                  </label>
                </div>
              </div>

              {reviewError && (
                <p className="text-sm text-red-400 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">{reviewError}</p>
              )}

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full py-3 bg-primary hover:bg-orange-600 text-black font-bold rounded-xl transition-all disabled:opacity-50"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          {reviewLoading ? (
            <p className="text-muted-foreground">Loading reviews...</p>
          ) : reviews.length > 0 ? (
            <div className="grid gap-6">
              {reviews.map((review: any) => (
                <ReviewCard key={review.id} review={review} onRefetch={() => refetchReviews()} />
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
