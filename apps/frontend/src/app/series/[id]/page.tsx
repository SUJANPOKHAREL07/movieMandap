'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, gql } from '@apollo/client';
import UserNavBar from '@/components/UserNavBar';
import { useAuth } from '@/context/AuthContext';
import ConfirmDialog from '@/components/ConfirmDialog';
import {
  Play, ArrowLeft, BookmarkPlus, Tv, Calendar, Clock,
  ChevronDown, ChevronUp, Star, ThumbsUp, ThumbsDown, PenLine, Check, X, Edit2, MoreHorizontal, Trash2
} from 'lucide-react';

// ─── GraphQL ──────────────────────────────────────────────────────────────────

const GET_SERIES = gql`
  query GetSeries {
    getSeries {
      id title overview posterPath trailerLink releaseDate runtime adult dominantRating
      SeriesGenre { genre { name } }
      SeriesCastMember { person { name } character }
    }
  }
`;

const GET_SEASONS = gql`
  query GetSeasonsOfSeries($seriesId: Int!) {
    getSeasonsOfSeries(seriesId: $seriesId) {
      id seasonNumber title overview airDate episodeCount posterPath
    }
  }
`;

const GET_SEASON_REVIEWS = gql`
  query GetAllReviewsOfSeason($seasonId: Int!) {
    getAllReviewsOfSeason(seasonId: $seasonId) {
      id title content rating isSpoiler
      likesCount disLikesCount commentsCount
      userHasLiked userHasDisliked
      createdAt updatedAt
      user { id username }
    }
  }
`;

const GET_SERIES_REVIEWS = gql`
  query GetAllReviewOfSeries($seriesName: String!) {
    getAllReviewOfSeries(seriesName: $seriesName) {
      id title content rating isSpoiler
      likesCount disLikesCount commentsCount
      userHasLiked userHasDisliked
      createdAt updatedAt
      user { id username }
    }
  }
`;

const CREATE_SERIES_REVIEW = gql`
  mutation CreateSeriesReview($title: String!, $content: String!, $rating: Ratings!, $isSpoiler: Boolean!, $seriesName: String!) {
    createSeriesReview(title: $title, content: $content, rating: $rating, isSpoiler: $isSpoiler, seriesName: $seriesName) {
      success message
    }
  }
`;

const CREATE_SEASON_REVIEW = gql`
  mutation CreateSeasonReview($seasonId: Int!, $title: String!, $content: String!, $rating: Ratings!, $isSpoiler: Boolean!) {
    createSeasonReview(seasonId: $seasonId, title: $title, content: $content, rating: $rating, isSpoiler: $isSpoiler) {
      success message
    }
  }
`;

const DELETE_SEASON_REVIEW = gql`
  mutation DeleteSeasonReview($reviewId: Int!) {
    deleteSeasonReview(reviewId: $reviewId) { success message }
  }
`;

const TOGGLE_SEASON_LIKE = gql`
  mutation ToggleSeasonReviewLike($reviewId: Int!) {
    toggleSeasonReviewLike(reviewId: $reviewId) { success }
  }
`;

const TOGGLE_SEASON_DISLIKE = gql`
  mutation ToggleSeasonReviewDislike($reviewId: Int!) {
    toggleSeasonReviewDislike(reviewId: $reviewId) { success }
  }
`;

const ADD_SERIES_WATCHLIST = gql`
  mutation CreateSeriesWatchList($seriesName: String!, $note: String) {
    createSeriesWatchList(seriesName: $seriesName, note: $note) { success message }
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const RATINGS = [
  { value: 'Worst', label: '★ Worst' },
  { value: 'Bearable', label: '★★ Bearable' },
  { value: 'Good_To_Watch', label: '★★★ Good To Watch' },
  { value: 'Worthy', label: '★★★★ Worthy' },
  { value: 'Absolute_Cinema', label: '★★★★★ Absolute Cinema' },
];

const getRatingStyle = (rating: string) => {
  const r = rating?.toUpperCase() || '';
  if (r.includes('ABSOLUTE')) return 'bg-gradient-to-br from-orange-500 to-yellow-500 text-white';
  if (r.includes('WORTHY')) return 'bg-gradient-to-br from-blue-600 to-cyan-400 text-white';
  if (r.includes('GOOD')) return 'bg-gradient-to-br from-emerald-600 to-teal-400 text-white';
  if (r.includes('BEARABLE')) return 'bg-gradient-to-br from-amber-500 to-yellow-300 text-black';
  if (r.includes('WORST')) return 'bg-gradient-to-br from-rose-600 to-orange-400 text-white';
  return 'bg-secondary text-muted-foreground';
};

// ─── Mini Review Form ─────────────────────────────────────────────────────────

function ReviewForm({ onSubmit, label }: { onSubmit: (form: any) => void; label: string }) {
  const [form, setForm] = useState({ title: '', content: '', rating: 'Good_To_Watch', isSpoiler: false });
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSubmit(form); };
  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-5 space-y-4">
      <h3 className="font-bold text-lg flex items-center gap-2"><PenLine size={16} className="text-primary" />{label}</h3>
      <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-sm" />
      <textarea required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={3} placeholder="Share your thoughts..." className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-sm resize-none" />
      <div className="flex gap-4 flex-wrap">
        <select value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} className="flex-1 px-4 py-2 bg-secondary border border-border rounded-lg text-sm">
          {RATINGS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <div onClick={() => setForm({ ...form, isSpoiler: !form.isSpoiler })} className={`w-10 h-6 rounded-full transition-all flex items-center px-1 border-2 ${form.isSpoiler ? 'bg-red-500 border-red-500' : 'bg-secondary border-border'}`}>
            <div className={`w-3.5 h-3.5 rounded-full bg-white shadow transition-transform ${form.isSpoiler ? 'translate-x-4' : ''}`} />
          </div>
          <span className={form.isSpoiler ? 'text-red-500 font-bold' : 'text-muted-foreground'}>Spoiler</span>
        </label>
      </div>
      <button type="submit" className="w-full bg-primary text-black font-bold py-2.5 rounded-xl hover:bg-orange-600 transition">
        Submit Review
      </button>
    </form>
  );
}

// ─── Season Review Card ────────────────────────────────────────────────────────

function SeasonReviewCard({ review, onRefetch, currentUser }: { review: any; onRefetch: () => void; currentUser: any }) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [spoilerRevealed, setSpoilerRevealed] = useState(false);
  const [toggleLike] = useMutation(TOGGLE_SEASON_LIKE);
  const [toggleDislike] = useMutation(TOGGLE_SEASON_DISLIKE);
  const [deleteReview] = useMutation(DELETE_SEASON_REVIEW);

  const isOwner = currentUser?.id === review.user?.id;
  const isEdited = Number(review.updatedAt) > Number(review.createdAt) + 1000;

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-400">
            {review.user?.username?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-semibold text-sm">{review.user?.username}</p>
            <p className="text-xs text-muted-foreground" suppressHydrationWarning>{new Date(Number(review.createdAt)).toLocaleDateString()}{isEdited && ' (edited)'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full font-bold ${getRatingStyle(review.rating)}`}>
            {review.rating?.replace(/_/g, ' ')}
          </span>
          {review.isSpoiler && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full font-bold">Spoiler</span>}
          {isOwner && (
            <div className="relative">
              <button onClick={() => setShowMenu(v => !v)} className="p-1 hover:bg-secondary rounded-lg"><MoreHorizontal size={14} /></button>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 mt-1 w-28 bg-card border border-border rounded-lg shadow-xl z-50 py-1">
                    <button onClick={async () => { setShowMenu(false); await deleteReview({ variables: { reviewId: review.id } }); onRefetch(); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10">
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div>
        <p className="font-bold">{review.title}</p>
        {review.isSpoiler && !spoilerRevealed ? (
          <button onClick={() => setSpoilerRevealed(true)} className="text-xs text-red-400 hover:underline mt-1">⚠ Spoiler — click to reveal</button>
        ) : (
          <p className="text-sm text-foreground/80 mt-1">{review.content}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => currentUser ? toggleLike({ variables: { reviewId: review.id } }).then(onRefetch) : router.push('/login')}
          className={`flex items-center gap-1 text-xs font-semibold transition-colors ${review.userHasLiked ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
          <ThumbsUp size={12} className={review.userHasLiked ? 'fill-primary' : ''} /> {review.likesCount || 0}
        </button>
        <button
          onClick={() => currentUser ? toggleDislike({ variables: { reviewId: review.id } }).then(onRefetch) : router.push('/login')}
          className={`flex items-center gap-1 text-xs font-semibold transition-colors ${review.userHasDisliked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}>
          <ThumbsDown size={12} className={review.userHasDisliked ? 'fill-red-500' : ''} /> {review.disLikesCount || 0}
        </button>
      </div>
    </div>
  );
}

// ─── Season Panel ─────────────────────────────────────────────────────────────

function SeasonPanel({ season, currentUser, seriesTitle }: { season: any; currentUser: any; seriesTitle: string }) {
  const [expanded, setExpanded] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { data, refetch } = useQuery(GET_SEASON_REVIEWS, {
    variables: { seasonId: season.id },
    skip: !expanded,
  });

  const [createReview] = useMutation(CREATE_SEASON_REVIEW, {
    onCompleted: () => { setShowReviewForm(false); refetch(); },
  });

  const reviews = data?.getAllReviewsOfSeason || [];

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition"
      >
        <div className="flex items-center gap-3">
          {season.posterPath ? (
            <img src={season.posterPath.startsWith('http') ? season.posterPath : `https://image.tmdb.org/t/p/w100${season.posterPath}`}
              alt={`Season ${season.seasonNumber}`} className="w-10 h-14 object-cover rounded" />
          ) : (
            <div className="w-10 h-14 bg-secondary rounded flex items-center justify-center text-muted-foreground text-xs">S{season.seasonNumber}</div>
          )}
          <div className="text-left">
            <p className="font-bold">Season {season.seasonNumber}{season.title ? ` — ${season.title}` : ''}</p>
            <p className="text-xs text-muted-foreground">
              {season.episodeCount ? `${season.episodeCount} episodes` : ''}
              {season.airDate ? ` · ${new Date(season.airDate).getFullYear()}` : ''}
            </p>
            {season.overview && <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 max-w-md">{season.overview}</p>}
          </div>
        </div>
        {expanded ? <ChevronUp size={18} className="text-muted-foreground shrink-0" /> : <ChevronDown size={18} className="text-muted-foreground shrink-0" />}
      </button>

      {expanded && (
        <div className="px-4 pb-5 pt-2 border-t border-border space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wide">Season Reviews ({reviews.length})</h4>
            {currentUser && (
              <button onClick={() => setShowReviewForm(v => !v)} className="text-xs text-primary hover:underline flex items-center gap-1">
                <PenLine size={12} /> Write Review
              </button>
            )}
          </div>

          {showReviewForm && (
            <ReviewForm
              label={`Review Season ${season.seasonNumber}`}
              onSubmit={form => createReview({ variables: { seasonId: season.id, ...form, rating: form.rating as any } })}
            />
          )}

          {reviews.length === 0 && !showReviewForm && (
            <p className="text-sm text-muted-foreground text-center py-4">No reviews yet. Be the first!</p>
          )}

          <div className="space-y-3">
            {reviews.map((r: any) => (
              <SeasonReviewCard key={r.id} review={r} onRefetch={() => refetch()} currentUser={currentUser} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function SeriesDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'seasons' | 'reviews'>('overview');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<any>({ isOpen: false, onConfirm: () => { } });

  const { data } = useQuery(GET_SERIES);
  const series = data?.getSeries?.find((s: any) => String(s.id) === String(id));

  const { data: seasonsData } = useQuery(GET_SEASONS, {
    variables: { seriesId: Number(id) },
    skip: !id,
  });
  const seasons = seasonsData?.getSeasonsOfSeries || [];

  const { data: reviewsData, refetch: refetchReviews } = useQuery(GET_SERIES_REVIEWS, {
    variables: { seriesName: series?.title },
    skip: !series?.title,
  });
  const reviews = reviewsData?.getAllReviewOfSeries || [];

  const [createSeriesReview] = useMutation(CREATE_SERIES_REVIEW, {
    onCompleted: () => { setShowReviewForm(false); refetchReviews(); },
  });

  const [addWatchlist] = useMutation(ADD_SERIES_WATCHLIST, {
    onCompleted: (d) => setConfirmConfig({
      isOpen: true, onConfirm: () => { },
      title: d.createSeriesWatchList.success ? 'Added!' : 'Error',
      description: d.createSeriesWatchList.message,
      confirmText: 'OK', variant: 'primary',
    }),
  });

  if (!series) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const posterUrl = series.posterPath
    ? (series.posterPath.startsWith('http') ? series.posterPath : `https://image.tmdb.org/t/p/w500${series.posterPath}`)
    : 'https://via.placeholder.com/400x600';

  const backdropUrl = series.posterPath
    ? (series.posterPath.startsWith('http') ? series.posterPath : `https://image.tmdb.org/t/p/original${series.posterPath}`)
    : '';

  const genres = series.SeriesGenre?.map((g: any) => g.genre?.name).filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <UserNavBar />

      {/* Hero backdrop */}
      <div className="relative h-[60vh] overflow-hidden">
        {backdropUrl && (
          <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${backdropUrl})` }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />

        <div className="relative h-full max-w-[96rem] mx-auto px-6 flex items-end pb-10">
          <div className="flex gap-6 items-end">
            <img src={posterUrl} alt={series.title} className="w-36 h-52 object-cover rounded-2xl shadow-2xl border border-border hidden md:block" />
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <button onClick={() => router.back()} className="flex items-center gap-1 hover:text-foreground transition">
                  <ArrowLeft size={14} /> Back
                </button>
                <span>·</span>
                <Tv size={14} className="text-purple-400" />
                <span className="text-purple-400 font-semibold">Series</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold">{series.title}</h1>
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                {series.releaseDate && <span className="flex items-center gap-1"><Calendar size={13} />{new Date(series.releaseDate).getFullYear()}</span>}
                {series.runtime && <span className="flex items-center gap-1"><Clock size={13} />{series.runtime} min/ep</span>}
                {genres.map((g: string) => <span key={g} className="bg-secondary px-2 py-0.5 rounded-full text-xs">{g}</span>)}
                {series.dominantRating && <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getRatingStyle(series.dominantRating)}`}>{series.dominantRating.replace(/_/g, ' ')}</span>}
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                {series.trailerLink && (
                  <a href={series.trailerLink} target="_blank" rel="noreferrer" className="bg-primary text-black px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-600 transition text-sm">
                    <Play fill="currentColor" size={16} /> Watch Trailer
                  </a>
                )}
                <button
                  onClick={() => {
                    if (!currentUser) { setConfirmConfig({ isOpen: true, title: 'Login Required', description: 'You need to be logged in to add to watchlist.', confirmText: 'Go to Login', variant: 'primary', onConfirm: () => router.push('/login') }); return; }
                    addWatchlist({ variables: { seriesName: series.title } });
                  }}
                  className="bg-secondary border border-border text-foreground px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-secondary/70 transition text-sm"
                >
                  <BookmarkPlus size={16} /> Add to Watchlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-[96rem] mx-auto px-6">
        <div className="flex border-b border-border mb-8">
          {(['overview', 'seasons', 'reviews'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              {tab} {tab === 'seasons' && seasons.length > 0 && `(${seasons.length})`}
              {tab === 'reviews' && reviews.length > 0 && `(${reviews.length})`}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-8 pb-16">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="font-bold text-xl mb-2">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">{series.overview || 'No overview available.'}</p>
              </div>
              {series.SeriesCastMember?.length > 0 && (
                <div>
                  <h2 className="font-bold text-xl mb-3">Cast</h2>
                  <div className="flex flex-wrap gap-2">
                    {series.SeriesCastMember.slice(0, 12).map((c: any, i: number) => (
                      <div key={i} className="bg-secondary rounded-lg px-3 py-2 text-sm text-center">
                        <p className="font-semibold">{c.person?.name}</p>
                        {c.character && <p className="text-xs text-muted-foreground">{c.character}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-4 space-y-3 text-sm">
                <h3 className="font-bold">Details</h3>
                {series.adult && <p className="text-red-400 font-bold">🔞 Adult Content</p>}
                {series.runtime && <div className="flex justify-between"><span className="text-muted-foreground">Runtime</span><span>{series.runtime} min/ep</span></div>}
                {series.releaseDate && <div className="flex justify-between"><span className="text-muted-foreground">First Air Date</span><span>{new Date(series.releaseDate).toLocaleDateString()}</span></div>}
              </div>
            </div>
          </div>
        )}

        {/* Seasons Tab */}
        {activeTab === 'seasons' && (
          <div className="pb-16 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Tv size={20} className="text-purple-400" />
                {seasons.length} Season{seasons.length !== 1 ? 's' : ''}
              </h2>
            </div>
            {seasons.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Tv size={40} className="mx-auto mb-4 opacity-30" />
                <p>No seasons added yet.</p>
              </div>
            ) : (
              seasons.map((season: any) => (
                <SeasonPanel key={season.id} season={season} currentUser={currentUser} seriesTitle={series.title} />
              ))
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="pb-16 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Series Reviews ({reviews.length})</h2>
              {currentUser && (
                <button onClick={() => setShowReviewForm(v => !v)} className="flex items-center gap-2 text-sm bg-primary text-black px-4 py-2 rounded-xl font-bold hover:bg-orange-600 transition">
                  <PenLine size={14} /> Write Review
                </button>
              )}
            </div>

            {showReviewForm && (
              <ReviewForm
                label="Review this Series"
                onSubmit={form => createSeriesReview({ variables: { ...form, seriesName: series.title, rating: form.rating as any } })}
              />
            )}

            {reviews.length === 0 && !showReviewForm && (
              <div className="text-center py-16 text-muted-foreground">
                <Star size={40} className="mx-auto mb-4 opacity-30" />
                <p>No reviews yet. Be the first!</p>
              </div>
            )}

            <div className="space-y-4">
              {reviews.map((r: any) => (
                <SeasonReviewCard key={r.id} review={r} onRefetch={() => refetchReviews()} currentUser={currentUser} />
              ))}
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig((p: any) => ({ ...p, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title || ''}
        description={confirmConfig.description || ''}
        confirmText={confirmConfig.confirmText || 'OK'}
        variant={confirmConfig.variant || 'primary'}
      />
    </div>
  );
}
