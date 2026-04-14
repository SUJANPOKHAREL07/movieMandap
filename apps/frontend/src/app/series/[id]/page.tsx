'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, gql } from '@apollo/client';
import UserNavBar from '@/components/UserNavBar';
import { useAuth } from '@/context/AuthContext';
import ConfirmDialog from '@/components/ConfirmDialog';
import {
  Play, ArrowLeft, BookmarkPlus, Tv, Calendar, Clock,
  Star, ThumbsUp, ThumbsDown, PenLine, Check, X, Edit2, MoreHorizontal, Trash2
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

  // Calculate Average Rating for Score
  const score = reviews.length > 0
    ? (reviews.reduce((acc: number, r: any) => acc + (r.rating === 'Absolute_Cinema' ? 10 : r.rating === 'Worthy' ? 8 : r.rating === 'Good_To_Watch' ? 6 : r.rating === 'Bearable' ? 4 : 2), 0) / reviews.length).toFixed(1)
    : "8.4"; // Default mock score if no reviews, to match image aesthetic

  return (
    <div className={`group transition-all duration-500 overflow-hidden border-b border-white/5 ${expanded ? 'bg-white/[0.02] py-10' : 'hover:bg-white/[0.02]'}`}>
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex flex-col md:flex-row items-center gap-8 p-6 text-left transition-all"
      >
        <div className="relative shrink-0">
          {season.posterPath ? (
            <img src={season.posterPath.startsWith('http') ? season.posterPath : `https://image.tmdb.org/t/p/w200${season.posterPath}`}
              alt={`Season ${season.seasonNumber}`} className={`w-36 h-52 object-cover rounded-xl shadow-2xl transition-transform duration-700 ${expanded ? 'scale-105 border-primary/50 border' : 'group-hover:scale-105'}`} />
          ) : (
            <div className="w-36 h-52 bg-white/5 rounded-xl flex items-center justify-center text-muted-foreground text-xs uppercase font-black">S{season.seasonNumber}</div>
          )}
          {expanded && (
            <div className="absolute -top-4 -right-4 bg-primary text-black font-black p-3 rounded-full shadow-xl animate-bounce">
              <Star size={20} fill="black" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div className="space-y-1">
            <h3 className="text-4xl font-black uppercase tracking-tighter">
              Season <span className="text-primary">{String(season.seasonNumber).padStart(2, '0')}</span>
            </h3>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
              {season.episodeCount || 0} Episodes {' // '} {season.airDate ? new Date(season.airDate).getFullYear() : 'TBD'}
            </p>
          </div>
          <p className={`text-muted-foreground leading-relaxed font-light italic-editorial ${expanded ? 'text-lg' : 'line-clamp-2'}`}>
            {season.overview || 'The debut season that redefined noir aesthetics. Explore depth critiques from our movieMandap community on the rise of the Lynch underground.'}
          </p>

          {!expanded && (
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 group-hover:text-primary transition-colors">
              EXPLORE ARCHIVES <MoreHorizontal size={14} />
            </div>
          )}
        </div>

        {expanded && (
          <div className="hidden lg:block shrink-0 px-10 border-l border-white/10 space-y-6">
            <div className="text-center space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Season Score</p>
              <div className="text-6xl font-black text-white leading-none tracking-tighter">
                {score}<span className="text-xs text-primary">/10</span>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Episode Quick-Links</p>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(ep => (
                  <div key={ep} className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-[10px] font-mono hover:border-primary hover:text-primary transition-all cursor-pointer">
                    {ep}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </button>

      {expanded && (
        <div className="px-6 pb-10 space-y-12 animate-fade-in-up">
          <div className="flex flex-col lg:flex-row gap-16">

            {/* Reviews Section */}
            <div className="lg:col-span-8 flex-1 space-y-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h4 className="text-2xl font-black uppercase tracking-tighter">User Verdicts</h4>
                {currentUser && (
                  <button onClick={() => setShowReviewForm(v => !v)} className="text-xs font-black uppercase bg-primary text-black px-4 py-2 rounded-full hover:scale-105 transition">
                    WRITE VERDICT
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
                <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl">
                  <p className="text-sm text-muted-foreground italic font-light italic-editorial">
                    "A sensory overload that demands your individual attention." — Be the first to share.
                  </p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {reviews.map((r: any) => (
                  <SeasonReviewCard key={r.id} review={r} onRefetch={() => refetch()} currentUser={currentUser} />
                ))}
              </div>
            </div>

            {/* Discussion / Quick Info sidebar */}
            <div className="lg:w-80 space-y-10">
              <div className="space-y-6">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Join the Discussion</h4>
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed font-light font-serif">
                    Share your unique perspective on Season {season.seasonNumber} with our curated editorial community.
                  </p>
                  <button className="w-full py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-primary transition">
                    ENTER FORUM
                  </button>
                </div>
              </div>
            </div>

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

  const splitTitle = series.title.split(' ');
  const lastWord = splitTitle.pop();
  const restOfTitle = splitTitle.join(' ');

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <UserNavBar />

      {/* Editorial Hero backdrop */}
      <div className="relative h-[85vh] w-full overflow-hidden flex items-center justify-center">
        {backdropUrl && (
          <div className="absolute inset-0 bg-cover bg-center opacity-40 scale-105" style={{ backgroundImage: `url(${backdropUrl})` }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 w-full max-w-[96rem] mx-auto px-6 text-center space-y-8 animate-fade-in">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-3 text-xs font-bold tracking-[0.3em] uppercase text-primary/80 stagger-1">
              <Tv size={14} />
              <span>Series Exclusive</span>
            </div>
            <h1 className="text-editorial-hero title-glow stagger-2">
              <span className="text-white">{restOfTitle}</span>{' '}
              <span className="text-primary italic px-2">{lastWord}</span>
            </h1>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm font-semibold text-muted-foreground stagger-3">
            {series.releaseDate && <span>{new Date(series.releaseDate).getFullYear()}</span>}
            <span className="w-1 h-1 bg-muted-foreground rounded-full" />
            {series.runtime && <span>{series.runtime} MIN / EP</span>}
            <span className="w-1 h-1 bg-muted-foreground rounded-full" />
            <div className="flex gap-2">
              {genres.slice(0, 2).map((g: string) => <span key={g} className="uppercase tracking-wider">{g}</span>)}
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4 stagger-4">
            {series.trailerLink && (
              <a href={series.trailerLink} target="_blank" rel="noreferrer" className="group bg-primary text-black px-10 py-4 rounded-full font-black flex items-center gap-3 hover:scale-105 transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                <Play fill="currentColor" size={20} /> WATCH TRAILER
              </a>
            )}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  if (!currentUser) { setConfirmConfig({ isOpen: true, title: 'Login Required', description: 'You need to be logged in to add to watchlist.', confirmText: 'Go to Login', variant: 'primary', onConfirm: () => router.push('/login') }); return; }
                  addWatchlist({ variables: { seriesName: series.title } });
                }}
                className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white transition-all group"
                title="Add to Watchlist"
              >
                <BookmarkPlus size={20} className="text-white group-hover:text-primary transition-colors" />
              </button>
              <button className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white transition-all group" title="Like">
                <ThumbsUp size={20} className="text-white group-hover:text-primary transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 animate-bounce">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-primary to-transparent" />
        </div>
      </div>

      {/* Integrated Editorial Layout */}
      <div className="max-w-[96rem] mx-auto px-6 py-20 relative">
        <div className="grid lg:grid-cols-12 gap-16">

          {/* Main Column - Overview & Seasons */}
          <div className="lg:col-span-8 space-y-24">

            <section className="space-y-6">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Overview</h2>
              <p className="text-3xl font-light leading-snug text-white/90 font-serif italic italic-editorial">
                "{series.overview || 'A haunting exploration of memory and the digital afterlife. A series that defies conventional genre boundaries, blending existential dread with visual poetry.'}"
              </p>
            </section>

            <section className="space-y-10">
              <div className="flex items-end justify-between border-b border-white/10 pb-4">
                <h2 className="text-4xl font-black uppercase tracking-tighter">Seasons</h2>
                <span className="text-muted-foreground font-mono text-xs mb-1">{seasons.length} TOTAL SEASONS</span>
              </div>
              <div className="space-y-4">
                {seasons.map((season: any) => (
                  <SeasonPanel key={season.id} season={season} currentUser={currentUser} seriesTitle={series.title} />
                ))}
              </div>
            </section>

          </div>

          {/* Sidebar - Critique & Details */}
          <div className="lg:col-span-4 space-y-20">

            <section className="space-y-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-2xl font-black uppercase tracking-tighter">Critique</h2>
                {currentUser && (
                  <button onClick={() => setShowReviewForm(v => !v)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition">
                    <PenLine size={16} className="text-primary" />
                  </button>
                )}
              </div>

              {showReviewForm && (
                <ReviewForm
                  label="Share Your Verdict"
                  onSubmit={form => createSeriesReview({ variables: { ...form, seriesName: series.title, rating: form.rating as any } })}
                />
              )}

              <div className="space-y-6">
                {reviews.length === 0 && !showReviewForm ? (
                  <p className="text-muted-foreground italic text-sm">Waiting for the first critical response...</p>
                ) : (
                  reviews.slice(0, 3).map((r: any) => (
                    <SeasonReviewCard key={r.id} review={r} onRefetch={() => refetchReviews()} currentUser={currentUser} />
                  ))
                )}
                {reviews.length > 3 && (
                  <button className="w-full py-4 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/5 transition">
                    VIEW ALL REVIEWS ({reviews.length})
                  </button>
                )}
              </div>
            </section>

            <section className="space-y-8 bg-white/5 p-8 rounded-3xl border border-white/10">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Production Info</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-muted-foreground uppercase">Status</span>
                  <span className="font-bold text-white uppercase">Released</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-muted-foreground uppercase">Rating</span>
                  <span className="font-bold text-white uppercase">{series.dominantRating?.replace(/_/g, ' ') || 'TBD'}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-muted-foreground uppercase">Network</span>
                  <span className="font-bold text-white uppercase text-right">Cinematic Editorial</span>
                </div>
              </div>

              {series.SeriesCastMember?.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Leading Cast</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {series.SeriesCastMember.slice(0, 4).map((c: any, i: number) => (
                      <div key={i} className="space-y-0.5">
                        <p className="font-bold text-sm text-white line-clamp-1">{c.person?.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase line-clamp-1">{c.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

          </div>
        </div>
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
