'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, gql } from '@apollo/client';
import UserNavBar from '@/components/UserNavBar';
import { useAuth } from '@/context/AuthContext';
import ConfirmDialog from '@/components/ConfirmDialog';
import {
  Play, ArrowLeft, BookmarkPlus, Calendar, Clock,
  Star, ThumbsUp, ThumbsDown, PenLine, Edit2, MoreHorizontal, Trash2, Reply, MessageSquare
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
      episodes {
        id
        episodeNumber
        title
        overview
        airDate
        runtime
        posterPath
      }
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
      comments {
        id content parentId likesCount disLikesCount userHasLiked userHasDisliked createdAt updatedAt
        user { id username }
        replies {
          id content parentId likesCount disLikesCount userHasLiked userHasDisliked createdAt updatedAt
          user { id username }
          replies {
            id content parentId likesCount disLikesCount userHasLiked userHasDisliked createdAt updatedAt
            user { id username }
          }
        }
      }
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
      comments {
        id content parentId likesCount disLikesCount userHasLiked userHasDisliked createdAt updatedAt
        user { id username }
        replies {
          id content parentId likesCount disLikesCount userHasLiked userHasDisliked createdAt updatedAt
          user { id username }
          replies {
            id content parentId likesCount disLikesCount userHasLiked userHasDisliked createdAt updatedAt
            user { id username }
          }
        }
      }
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

const UPDATE_SERIES_REVIEW = gql`
  mutation UpdateSeriesReview($reviewId: Int!, $title: String!, $content: String!, $rating: Ratings!, $isSpoiler: Boolean!) {
    updateSeriesReview(reviewId: $reviewId, title: $title, content: $content, rating: $rating, isSpoiler: $isSpoiler) {
      success message
    }
  }
`;



const DELETE_SERIES_REVIEW = gql`
  mutation DeleteSeriesReview($reviewId: Int!) {
    deleteSeriesReview(reviewId: $reviewId) { success message }
  }
`;

const TOGGLE_SERIES_REVIEW_LIKE = gql`
  mutation ToggleSeriesReviewLike($reviewId: Int!) {
    toggleSeriesReviewLike(reviewId: $reviewId) { success }
  }
`;

const TOGGLE_SERIES_REVIEW_DISLIKE = gql`
  mutation ToggleSeriesReviewDislike($reviewId: Int!) {
    toggleSeriesReviewDislike(reviewId: $reviewId) { success }
  }
`;

const CREATE_SERIES_COMMENT = gql`
  mutation CreateSeriesComment($reviewId: Int!, $content: String!, $parentId: Int) {
    createSeriesComment(reviewId: $reviewId, content: $content, parentId: $parentId) { success }
  }
`;

const UPDATE_SERIES_COMMENT = gql`
  mutation UpdateSeriesComment($commentId: Int!, $content: String!) {
    updateSeriesComment(commentId: $commentId, content: $content) { success }
  }
`;

const DELETE_SERIES_COMMENT = gql`
  mutation DeleteSeriesComment($commentId: Int!) {
    deleteSeriesComment(commentId: $commentId) { success }
  }
`;

const TOGGLE_SERIES_COMMENT_LIKE = gql`
  mutation ToggleSeriesCommentLike($commentId: Int!) {
    toggleSeriesCommentLike(commentId: $commentId) { success }
  }
`;

const TOGGLE_SERIES_COMMENT_DISLIKE = gql`
  mutation ToggleSeriesCommentDislike($commentId: Int!) {
    toggleSeriesCommentDislike(commentId: $commentId) { success }
  }
`;

const CREATE_SEASON_REVIEW = gql`
  mutation CreateSeasonReview($seasonId: Int!, $title: String!, $content: String!, $rating: Ratings!, $isSpoiler: Boolean!) {
    createSeasonReview(seasonId: $seasonId, title: $title, content: $content, rating: $rating, isSpoiler: $isSpoiler) {
      success message
    }
  }
`;

const UPDATE_SEASON_REVIEW = gql`
  mutation UpdateSeasonReview($reviewId: Int!, $title: String!, $content: String!, $rating: Ratings!, $isSpoiler: Boolean!) {
    updateSeasonReview(reviewId: $reviewId, title: $title, content: $content, rating: $rating, isSpoiler: $isSpoiler) {
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

const CREATE_SEASON_COMMENT = gql`
  mutation CreateSeasonComment($reviewId: Int!, $content: String!, $parentId: Int) {
    createSeasonComment(reviewId: $reviewId, content: $content, parentId: $parentId) { success }
  }
`;

const UPDATE_SEASON_COMMENT = gql`
  mutation UpdateSeasonComment($commentId: Int!, $content: String!) {
    updateSeasonComment(commentId: $commentId, content: $content) { success }
  }
`;

const DELETE_SEASON_COMMENT = gql`
  mutation DeleteSeasonComment($commentId: Int!) {
    deleteSeasonComment(commentId: $commentId) { success }
  }
`;

const TOGGLE_SEASON_COMMENT_LIKE = gql`
  mutation ToggleSeasonCommentLike($commentId: Int!) {
    toggleSeasonCommentLike(commentId: $commentId) { success }
  }
`;

const TOGGLE_SEASON_COMMENT_DISLIKE = gql`
  mutation ToggleSeasonCommentDislike($commentId: Int!) {
    toggleSeasonCommentDislike(commentId: $commentId) { success }
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

// ─── Rating Config ─────────────────────────────────────────────────────────────

const RATING_CONFIG = [
  { key: 'Worst',          label: 'Worst',           color: '#ef4444' },
  { key: 'Bearable',       label: 'Bearable',         color: '#f97316' },
  { key: 'Good_To_Watch',  label: 'Good To Watch',    color: '#eab308' },
  { key: 'Worthy',         label: 'Worthy',           color: '#3b82f6' },
  { key: 'Absolute_Cinema',label: 'Absolute Cinema',  color: '#22c55e' },
];

function RatingGaugeMeter({ reviews }: { reviews: any[] }) {
  const counts: Record<string, number> = { Worst: 0, Bearable: 0, Good_To_Watch: 0, Worthy: 0, Absolute_Cinema: 0 };
  reviews.forEach(r => { if (r.rating in counts) counts[r.rating]++; });
  const total = reviews.length;

  const dominantIdx = total > 0
    ? RATING_CONFIG.reduce((best, rc, i, arr) => counts[rc.key] >= counts[arr[best].key] ? i : best, 0)
    : 2;
  const dominant = RATING_CONFIG[dominantIdx];

  // SVG gauge: semicircle, cx=110, cy=100, r=78, strokeWidth=18
  const cx = 110, cy = 100, r = 78, sw = 18;

  function arcPath(startDeg: number, endDeg: number) {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const sx = cx + r * Math.cos(toRad(startDeg));
    const sy = cy - r * Math.sin(toRad(startDeg));
    const ex = cx + r * Math.cos(toRad(endDeg));
    const ey = cy - r * Math.sin(toRad(endDeg));
    return `M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${r} ${r} 0 0 0 ${ex.toFixed(2)} ${ey.toFixed(2)}`;
  }

  // Segments: Worst=180°→144°, Bearable=142°→108°, GoodToWatch=106°→72°, Worthy=70°→36°, AbsCinema=34°→2°
  const segments = [
    [178, 144], [142, 108], [106, 72], [70, 36], [34, 2],
  ];
  // Needle center angles per segment
  const needleAngles = [162, 126, 90, 54, 18];
  const needleAngle = needleAngles[dominantIdx];
  const toRad = (d: number) => (d * Math.PI) / 180;
  const needleLen = r - sw / 2 - 6;
  const nx = cx + needleLen * Math.cos(toRad(needleAngle));
  const ny = cy - needleLen * Math.sin(toRad(needleAngle));
  const b1x = cx + 7 * Math.cos(toRad(needleAngle + 90));
  const b1y = cy - 7 * Math.sin(toRad(needleAngle + 90));
  const b2x = cx + 7 * Math.cos(toRad(needleAngle - 90));
  const b2y = cy - 7 * Math.sin(toRad(needleAngle - 90));

  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-5">
      <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground text-center">Community Verdict</h3>

      {total === 0 ? (
        <p className="text-center text-muted-foreground text-sm py-6">No reviews yet — be the first!</p>
      ) : (
        <>
          {/* Gauge SVG */}
          <div className="flex flex-col items-center gap-1">
            <svg viewBox="0 0 220 108" className="w-52 h-auto">
              {/* Background arc */}
              <path d={arcPath(178, 2)} fill="none" stroke="#ffffff10" strokeWidth={sw} strokeLinecap="round" />
              {/* Colored segments */}
              {RATING_CONFIG.map((rc, i) => (
                <path
                  key={rc.key}
                  d={arcPath(segments[i][0], segments[i][1])}
                  fill="none"
                  stroke={rc.color}
                  strokeWidth={sw}
                  strokeLinecap="round"
                  opacity={dominantIdx === i ? 1 : 0.22}
                />
              ))}
              {/* Needle */}
              <polygon
                points={`${nx.toFixed(1)},${ny.toFixed(1)} ${b1x.toFixed(1)},${b1y.toFixed(1)} ${b2x.toFixed(1)},${b2y.toFixed(1)}`}
                fill="white" opacity={0.9}
              />
              <circle cx={cx} cy={cy} r={7} fill="#111" stroke="white" strokeWidth={2} />
            </svg>
            <p className="text-base font-black" style={{ color: dominant.color }}>{dominant.label}</p>
            <p className="text-[11px] text-muted-foreground">{total} vote{total !== 1 ? 's' : ''}</p>
          </div>

          {/* Vote breakdown bars */}
          <div className="space-y-2">
            {[...RATING_CONFIG].reverse().map(rc => {
              const count = counts[rc.key];
              const pct = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={rc.key} className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground w-28 text-right shrink-0">{rc.label}</span>
                  <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: rc.color }} />
                  </div>
                  <span className="text-[11px] font-bold w-5 text-right shrink-0" style={{ color: count > 0 ? rc.color : '#666' }}>{count}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Mini Review Form ─────────────────────────────────────────────────────────

function ReviewForm({ onSubmit, label, initialValues, onCancel }: { onSubmit: (form: any) => Promise<{ success: boolean; message?: string }>; label: string; initialValues?: any; onCancel?: () => void }) {
  const [form, setForm] = useState(initialValues || { title: '', content: '', rating: 'Good_To_Watch', isSpoiler: false });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await onSubmit(form);
      if (res && !res.success) {
        setError(res.message || 'Failed to submit review');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-5 space-y-4">
      <h3 className="font-bold text-lg flex items-center justify-between">
        <span className="flex items-center gap-2"><PenLine size={16} className="text-primary" />{label}</span>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
        )}
      </h3>
      <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
      <textarea required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={3} placeholder="Share your thoughts..." className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary" />
      <div className="flex gap-4 flex-wrap">
        <select value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} className="flex-1 px-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary">
          {RATINGS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <div onClick={() => setForm({ ...form, isSpoiler: !form.isSpoiler })} className={`w-10 h-6 rounded-full transition-all flex items-center px-1 border-2 ${form.isSpoiler ? 'bg-red-500 border-red-500' : 'bg-secondary border-border'}`}>
            <div className={`w-3.5 h-3.5 rounded-full bg-white shadow transition-transform ${form.isSpoiler ? 'translate-x-4' : ''}`} />
          </div>
          <span className={form.isSpoiler ? 'text-red-500 font-bold' : 'text-muted-foreground'}>Spoiler</span>
        </label>
      </div>
      {error && <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">{error}</p>}
      <button disabled={submitting} type="submit" className="w-full bg-primary text-black font-bold py-2.5 rounded-xl hover:bg-orange-600 transition disabled:opacity-50">
        {submitting ? 'Submitting...' : initialValues ? 'Update Review' : 'Submit Review'}
      </button>
    </form>
  );
}

// ─── Season Comment Item ───────────────────────────────────────────────────────

function SeasonCommentItem({ comment, onRefetch, currentUser, parentSetConfirmConfig, depth = 0 }: any) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [activeMenu, setActiveMenu] = useState(false);

  const [updateComment] = useMutation(UPDATE_SEASON_COMMENT);
  const [deleteComment] = useMutation(DELETE_SEASON_COMMENT);
  const [toggleLike] = useMutation(TOGGLE_SEASON_COMMENT_LIKE);
  const [toggleDislike] = useMutation(TOGGLE_SEASON_COMMENT_DISLIKE);
  const [createComment] = useMutation(CREATE_SEASON_COMMENT);

  const handleUpdate = async () => {
    if (!editedContent.trim()) return;
    await updateComment({ variables: { commentId: comment.id, content: editedContent } });
    setIsEditing(false);
    onRefetch();
  };

  const handleDelete = async () => {
    parentSetConfirmConfig({
      isOpen: true,
      title: "Delete Comment",
      description: "Are you sure you want to delete this comment? This action cannot be undone.",
      confirmText: "Delete",
      variant: 'danger',
      onConfirm: async () => {
        await deleteComment({ variables: { commentId: comment.id } });
        onRefetch();
      }
    });
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    await createComment({
      variables: {
        reviewId: Number(comment.reviewId),
        content: replyContent,
        parentId: comment.id
      }
    });
    setReplyContent('');
    setShowReplyBox(false);
    onRefetch();
  };

  const canLike = !!currentUser;
  const canComment = !!currentUser;

  return (
    <div className={`mt-4 ${depth > 0 ? 'ml-6 border-l-2 border-border/30 pl-4' : ''}`}>
      <div className="flex items-start gap-3 group">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
          {comment.user?.username?.[0]?.toUpperCase() || 'A'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="bg-secondary/30 rounded-2xl p-3 inline-block max-w-full">
            <div className="flex items-center justify-between gap-4 mb-1">
              <span className="text-sm font-bold text-foreground">
                {comment.user?.username || 'Anonymous'}
              </span>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap" suppressHydrationWarning>
                {new Date(Number(comment.createdAt)).toLocaleDateString()}
              </span>
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:outline-none"
                  rows={2}
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setIsEditing(false)} className="text-xs text-muted-foreground">Cancel</button>
                  <button onClick={handleUpdate} className="text-xs text-primary font-bold">Save</button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-foreground/90 break-words">{comment.content}</p>
            )}
          </div>

          <div className="flex items-center gap-4 mt-1 ml-2">
            <button
              onClick={() => {
                if (!currentUser) return router.push('/login');
                toggleLike({ variables: { commentId: comment.id } }).then(() => onRefetch());
              }}
              className={`flex items-center gap-1 text-[11px] font-semibold transition-colors ${comment.userHasLiked ? 'text-primary' : 'text-muted-foreground hover:text-primary'} ${!canLike ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ThumbsUp size={12} className={comment.userHasLiked ? 'fill-primary' : ''} /> {comment.likesCount || 0}
            </button>
            <button
              onClick={() => {
                if (!currentUser) return router.push('/login');
                toggleDislike({ variables: { commentId: comment.id } }).then(() => onRefetch());
              }}
              className={`flex items-center gap-1 text-[11px] font-semibold transition-colors ${comment.userHasDisliked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'} ${!canLike ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ThumbsDown size={12} className={comment.userHasDisliked ? 'fill-red-500' : ''} /> {comment.disLikesCount || 0}
            </button>
            {canComment && depth < 3 && (
              <button
                onClick={() => setShowReplyBox(!showReplyBox)}
                className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                <Reply size={12} /> Reply
              </button>
            )}
            {currentUser?.id === comment.user?.id && !isEditing && (
              <div className="relative">
                <button
                  onClick={() => setActiveMenu(!activeMenu)}
                  className="p-1 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-all"
                >
                  <MoreHorizontal size={14} />
                </button>
                {activeMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(false)} />
                    <div className="absolute left-0 mt-1 w-24 bg-card border border-border/50 rounded-lg shadow-xl z-50 overflow-hidden py-1">
                      <button
                        onClick={() => { setIsEditing(true); setActiveMenu(false); }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-foreground hover:bg-secondary/50 transition-colors"
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                      <button
                        onClick={() => { handleDelete(); setActiveMenu(false); }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {showReplyBox && (
            <form onSubmit={handleReply} className="mt-3 flex flex-col gap-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 bg-secondary/20 border border-border/50 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReplyBox(false)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-primary hover:bg-primary/80 text-black font-bold px-4 py-1.5 rounded-xl text-xs transition-all">
                  Reply
                </button>
              </div>
            </form>
          )}

          {comment.replies?.map((reply: any) => (
            <SeasonCommentItem
              key={reply.id}
              comment={{ ...reply, reviewId: comment.reviewId }}
              onRefetch={onRefetch}
              currentUser={currentUser}
              parentSetConfirmConfig={parentSetConfirmConfig}
              depth={depth + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Season Review Card ────────────────────────────────────────────────────────

function SeasonReviewCard({ review, onRefetch, currentUser }: { review: any; onRefetch: () => void; currentUser: any }) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [spoilerRevealed, setSpoilerRevealed] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [toggleLike] = useMutation(TOGGLE_SEASON_LIKE);
  const [toggleDislike] = useMutation(TOGGLE_SEASON_DISLIKE);
  const [deleteReview] = useMutation(DELETE_SEASON_REVIEW);
  const [updateReview] = useMutation(UPDATE_SEASON_REVIEW);
  const [createComment] = useMutation(CREATE_SEASON_COMMENT);

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant: 'danger' | 'warning' | 'primary';
    confirmText?: string;
    showCancel?: boolean;
  }>({
    isOpen: false, title: '', description: '', onConfirm: () => { }, variant: 'primary'
  });

  const isOwner = currentUser?.id === review.user?.id;
  const isEdited = Number(review.updatedAt) > Number(review.createdAt) + 1000;

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || !currentUser) return;
    await createComment({ variables: { reviewId: review.id, content: commentContent } });
    setCommentContent('');
    onRefetch();
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-3">
      {confirmConfig.isOpen && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
          onConfirm={() => { confirmConfig.onConfirm(); setConfirmConfig(prev => ({ ...prev, isOpen: false })); }}
          title={confirmConfig.title}
          description={confirmConfig.description}
          variant={confirmConfig.variant}
        />
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
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
                  <div className="absolute right-0 mt-1 w-32 bg-card border border-border rounded-lg shadow-xl z-50 py-1">
                    <button onClick={() => { setIsEditing(true); setShowMenu(false); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-foreground hover:bg-secondary/50">
                      <Edit2 size={12} /> Edit
                    </button>
                    <button onClick={async () => {
                      setShowMenu(false);
                      setConfirmConfig({
                        isOpen: true,
                        title: "Delete Review",
                        description: "Are you sure you want to delete this review? This action cannot be undone.",
                        variant: 'danger',
                        onConfirm: async () => {
                          await deleteReview({ variables: { reviewId: review.id } });
                          onRefetch();
                        }
                      });
                    }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10">
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {isEditing ? (
        <ReviewForm
          label="Edit Your Verdict"
          initialValues={{ title: review.title, content: review.content, rating: review.rating, isSpoiler: review.isSpoiler }}
          onCancel={() => setIsEditing(false)}
          onSubmit={async (form) => {
            const { data } = await updateReview({ variables: { reviewId: review.id, ...form } });
            if (data?.updateSeasonReview?.success) {
              setIsEditing(false);
              onRefetch();
              return { success: true };
            }
            return { success: false, message: data?.updateSeasonReview?.message };
          }}
        />
      ) : (
        <div>
          <p className="font-bold">{review.title}</p>
        {review.isSpoiler && !spoilerRevealed ? (
          <button onClick={() => setSpoilerRevealed(true)} className="text-xs text-red-400 hover:underline mt-1">⚠ Spoiler — click to reveal</button>
        ) : (
          <p className="text-sm text-foreground/80 mt-1">{review.content}</p>
        )}
      </div>
    )}

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
        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-1 text-xs font-semibold transition-colors ${showComments ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
        >
          <MessageSquare size={12} className={showComments ? 'text-primary' : ''} /> {review.comments?.length || 0} comments
        </button>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t border-border/50">
          {currentUser && (
            <form onSubmit={handlePostComment} className="flex gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                {currentUser.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full bg-secondary/20 border border-border/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
                <div className="flex justify-end mt-2">
                  <button type="submit" disabled={!commentContent.trim()} className="bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold px-4 py-1.5 rounded-xl text-xs transition-all">
                    Comment
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {review.comments?.length > 0 ? (
              review.comments.map((comment: any) => (
                <SeasonCommentItem
                  key={comment.id}
                  comment={{ ...comment, reviewId: review.id }}
                  onRefetch={onRefetch}
                  currentUser={currentUser}
                  parentSetConfirmConfig={setConfirmConfig}
                  depth={0}
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground text-xs py-4">No comments yet. Be the first to start the discussion!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Series Comment Item ───────────────────────────────────────────────────────

function SeriesCommentItem({ comment, onRefetch, currentUser, parentSetConfirmConfig, depth = 0 }: any) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [activeMenu, setActiveMenu] = useState(false);

  const [updateComment] = useMutation(UPDATE_SERIES_COMMENT);
  const [deleteComment] = useMutation(DELETE_SERIES_COMMENT);
  const [toggleLike] = useMutation(TOGGLE_SERIES_COMMENT_LIKE);
  const [toggleDislike] = useMutation(TOGGLE_SERIES_COMMENT_DISLIKE);
  const [createComment] = useMutation(CREATE_SERIES_COMMENT);

  const handleUpdate = async () => {
    if (!editedContent.trim()) return;
    await updateComment({ variables: { commentId: comment.id, content: editedContent } });
    setIsEditing(false);
    onRefetch();
  };

  const handleDelete = async () => {
    parentSetConfirmConfig({
      isOpen: true,
      title: "Delete Comment",
      description: "Are you sure you want to delete this comment? This action cannot be undone.",
      confirmText: "Delete",
      variant: 'danger',
      onConfirm: async () => {
        await deleteComment({ variables: { commentId: comment.id } });
        onRefetch();
      }
    });
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    await createComment({
      variables: {
        reviewId: Number(comment.reviewId),
        content: replyContent,
        parentId: comment.id
      }
    });
    setReplyContent('');
    setShowReplyBox(false);
    onRefetch();
  };

  const canLike = !!currentUser;
  const canComment = !!currentUser;

  return (
    <div className={`mt-4 ${depth > 0 ? 'ml-6 border-l-2 border-border/30 pl-4' : ''}`}>
      <div className="flex items-start gap-3 group">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
          {comment.user?.username?.[0]?.toUpperCase() || 'A'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="bg-secondary/30 rounded-2xl p-3 inline-block max-w-full">
            <div className="flex items-center justify-between gap-4 mb-1">
              <span className="text-sm font-bold text-foreground">
                {comment.user?.username || 'Anonymous'}
              </span>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap" suppressHydrationWarning>
                {new Date(Number(comment.createdAt)).toLocaleDateString()}
              </span>
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:outline-none"
                  rows={2}
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setIsEditing(false)} className="text-xs text-muted-foreground">Cancel</button>
                  <button onClick={handleUpdate} className="text-xs text-primary font-bold">Save</button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-foreground/90 break-words">{comment.content}</p>
            )}
          </div>

          <div className="flex items-center gap-4 mt-1 ml-2">
            <button
              onClick={() => {
                if (!currentUser) return router.push('/login');
                toggleLike({ variables: { commentId: comment.id } }).then(() => onRefetch());
              }}
              className={`flex items-center gap-1 text-[11px] font-semibold transition-colors ${comment.userHasLiked ? 'text-primary' : 'text-muted-foreground hover:text-primary'} ${!canLike ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ThumbsUp size={12} className={comment.userHasLiked ? 'fill-primary' : ''} /> {comment.likesCount || 0}
            </button>
            <button
              onClick={() => {
                if (!currentUser) return router.push('/login');
                toggleDislike({ variables: { commentId: comment.id } }).then(() => onRefetch());
              }}
              className={`flex items-center gap-1 text-[11px] font-semibold transition-colors ${comment.userHasDisliked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'} ${!canLike ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ThumbsDown size={12} className={comment.userHasDisliked ? 'fill-red-500' : ''} /> {comment.disLikesCount || 0}
            </button>
            {canComment && depth < 3 && (
              <button
                onClick={() => setShowReplyBox(!showReplyBox)}
                className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                <Reply size={12} /> Reply
              </button>
            )}
            {currentUser?.id === comment.user?.id && !isEditing && (
              <div className="relative">
                <button
                  onClick={() => setActiveMenu(!activeMenu)}
                  className="p-1 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-all"
                >
                  <MoreHorizontal size={14} />
                </button>
                {activeMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(false)} />
                    <div className="absolute left-0 mt-1 w-24 bg-card border border-border/50 rounded-lg shadow-xl z-50 overflow-hidden py-1">
                      <button
                        onClick={() => { setIsEditing(true); setActiveMenu(false); }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-foreground hover:bg-secondary/50 transition-colors"
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                      <button
                        onClick={() => { handleDelete(); setActiveMenu(false); }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {showReplyBox && (
            <form onSubmit={handleReply} className="mt-3 flex flex-col gap-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 bg-secondary/20 border border-border/50 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReplyBox(false)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-primary hover:bg-primary/80 text-black font-bold px-4 py-1.5 rounded-xl text-xs transition-all">
                  Reply
                </button>
              </div>
            </form>
          )}

          {comment.replies?.map((reply: any) => (
            <SeriesCommentItem
              key={reply.id}
              comment={{ ...reply, reviewId: comment.reviewId }}
              onRefetch={onRefetch}
              currentUser={currentUser}
              parentSetConfirmConfig={parentSetConfirmConfig}
              depth={depth + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Series Review Card ────────────────────────────────────────────────────────

function SeriesReviewCard({ review, onRefetch, currentUser }: { review: any; onRefetch: () => void; currentUser: any }) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [spoilerRevealed, setSpoilerRevealed] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [toggleLike] = useMutation(TOGGLE_SERIES_REVIEW_LIKE);
  const [toggleDislike] = useMutation(TOGGLE_SERIES_REVIEW_DISLIKE);
  const [deleteReview] = useMutation(DELETE_SERIES_REVIEW);
  const [updateReview] = useMutation(UPDATE_SERIES_REVIEW);
  const [createComment] = useMutation(CREATE_SERIES_COMMENT);

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant: 'danger' | 'warning' | 'primary';
    confirmText?: string;
    showCancel?: boolean;
  }>({
    isOpen: false, title: '', description: '', onConfirm: () => { }, variant: 'primary'
  });

  const isOwner = currentUser?.id === review.user?.id;
  const isEdited = Number(review.updatedAt) > Number(review.createdAt) + 1000;

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || !currentUser) return;
    await createComment({ variables: { reviewId: review.id, content: commentContent } });
    setCommentContent('');
    onRefetch();
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-3">
      {confirmConfig.isOpen && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
          onConfirm={() => { confirmConfig.onConfirm(); setConfirmConfig(prev => ({ ...prev, isOpen: false })); }}
          title={confirmConfig.title}
          description={confirmConfig.description}
          variant={confirmConfig.variant}
        />
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
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
                  <div className="absolute right-0 mt-1 w-32 bg-card border border-border rounded-lg shadow-xl z-50 py-1">
                    <button onClick={() => { setIsEditing(true); setShowMenu(false); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-foreground hover:bg-secondary/50">
                      <Edit2 size={12} /> Edit
                    </button>
                    <button onClick={async () => {
                      setShowMenu(false);
                      setConfirmConfig({
                        isOpen: true,
                        title: "Delete Review",
                        description: "Are you sure you want to delete this review? This action cannot be undone.",
                        variant: 'danger',
                        onConfirm: async () => {
                          await deleteReview({ variables: { reviewId: review.id } });
                          onRefetch();
                        }
                      });
                    }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10">
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {isEditing ? (
        <ReviewForm
          label="Edit Your Verdict"
          initialValues={{ title: review.title, content: review.content, rating: review.rating, isSpoiler: review.isSpoiler }}
          onCancel={() => setIsEditing(false)}
          onSubmit={async (form) => {
            const { data } = await updateReview({ variables: { reviewId: review.id, ...form } });
            if (data?.updateSeriesReview?.success) {
              setIsEditing(false);
              onRefetch();
              return { success: true };
            }
            return { success: false, message: data?.updateSeriesReview?.message };
          }}
        />
      ) : (
        <div>
          <p className="font-bold">{review.title}</p>
        {review.isSpoiler && !spoilerRevealed ? (
          <button onClick={() => setSpoilerRevealed(true)} className="text-xs text-red-400 hover:underline mt-1">⚠ Spoiler — click to reveal</button>
        ) : (
          <p className="text-sm text-foreground/80 mt-1">{review.content}</p>
        )}
      </div>
    )}

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
        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-1 text-xs font-semibold transition-colors ${showComments ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
        >
          <MessageSquare size={12} className={showComments ? 'text-primary' : ''} /> {review.comments?.length || 0} comments
        </button>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t border-border/50">
          {currentUser && (
            <form onSubmit={handlePostComment} className="flex gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                {currentUser.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full bg-secondary/20 border border-border/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
                <div className="flex justify-end mt-2">
                  <button type="submit" disabled={!commentContent.trim()} className="bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold px-4 py-1.5 rounded-xl text-xs transition-all">
                    Comment
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {review.comments?.length > 0 ? (
              review.comments.map((comment: any) => (
                <SeriesCommentItem
                  key={comment.id}
                  comment={{ ...comment, reviewId: review.id }}
                  onRefetch={onRefetch}
                  currentUser={currentUser}
                  parentSetConfirmConfig={setConfirmConfig}
                  depth={0}
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground text-xs py-4">No comments yet. Be the first to start the discussion!</p>
            )}
          </div>
        </div>
      )}
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

  const [createReview] = useMutation(CREATE_SEASON_REVIEW);

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
            <div className="flex items-center gap-4">
              <h3 className="text-4xl font-black uppercase tracking-tighter">
                Season <span className="text-primary">{String(season.seasonNumber).padStart(2, '0')}</span>
              </h3>
              {currentUser?.role === 'ADMIN' && (
                <button
                  className="p-1.5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-all disabled:opacity-50"
                >
                  <Edit2 size={16} />
                </button>
              )}
            </div>
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

      </button>

      {expanded && (
        <div className="px-6 pb-10 space-y-12 animate-fade-in-up">
          <div className="flex flex-col lg:flex-row gap-16">

            {/* Reviews Section */}
            <div className="lg:col-span-8 flex-1 space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-4 gap-4">
                <h4 className="text-2xl font-black uppercase tracking-tighter">User Verdicts</h4>
                {currentUser && (
                  <button onClick={() => setShowReviewForm(v => !v)} className="text-xs font-black uppercase bg-primary text-black px-4 py-2 rounded-full hover:scale-105 transition w-fit">
                    WRITE VERDICT
                  </button>
                )}
              </div>

              {/* Two-column reviews area: Gauge + List */}
              <div className="flex flex-col lg:flex-row xl:flex-row gap-8 items-start">
                {/* Gauge Panel */}
                <div className="w-full lg:w-64 xl:w-64 shrink-0 lg:sticky lg:top-4">
                  <RatingGaugeMeter reviews={reviews} />
                </div>

                {/* Review cards column */}
                <div className="flex-1 space-y-6 w-full min-w-0">
                  {showReviewForm && (
                    <ReviewForm
                      label={`Review Season ${season.seasonNumber}`}
                      onSubmit={async (form) => {
                        try {
                          const { data } = await createReview({ variables: { ...form, seasonId: season.id, rating: form.rating as any } });
                          if (data?.createSeasonReview?.success) {
                            setShowReviewForm(false);
                            refetch();
                            return { success: true };
                          }
                          return { success: false, message: data?.createSeasonReview?.message };
                        } catch (err: any) {
                          return { success: false, message: err.message };
                        }
                      }}
                    />
                  )}

                  {reviews.length === 0 && !showReviewForm ? (
                    <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl w-full">
                      <p className="text-sm text-muted-foreground italic font-light italic-editorial px-4">
                        "A sensory overload that demands your individual attention." — Be the first to share.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6 w-full">
                      {reviews.map((r: any) => (
                        <SeasonReviewCard key={r.id} review={r} onRefetch={() => refetch()} currentUser={currentUser} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Episodes List */}
            <div className="lg:w-96 space-y-8 bg-white/[0.03] p-8 rounded-3xl border border-white/5 h-fit">
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Episodes</h4>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{season.episodes?.length || 0} Total Releases</p>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                {season.episodes?.length > 0 ? (
                  season.episodes.map((ep: any) => (
                    <div key={ep.id} className="group/ep p-4 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black text-primary uppercase tracking-tighter">EP {String(ep.episodeNumber).padStart(2, '0')}</span>
                        {ep.airDate && <span className="text-[9px] text-muted-foreground font-mono">{new Date(ep.airDate).toLocaleDateString()}</span>}
                      </div>
                      <h5 className="text-sm font-bold text-white group-hover/ep:text-primary transition-colors mb-1">{ep.title || `Episode ${ep.episodeNumber}`}</h5>
                      {ep.overview && <p className="text-xs text-muted-foreground line-clamp-2 font-light leading-relaxed">{ep.overview}</p>}
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center border border-dashed border-white/10 rounded-2xl">
                    <p className="text-[10px] text-muted-foreground uppercase font-black">No episodes listed for this archival season.</p>
                  </div>
                )}
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

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <UserNavBar />

      {/* Backdrop / Hero */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 blur-sm transform scale-105"
          style={{ backgroundImage: `url(${posterUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

        <div className="relative z-10 max-w-[96rem] mx-auto px-6 h-full flex flex-col">
          <div className="pt-24 shrink-0">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all bg-background/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:bg-background/40 shadow-lg"
            >
              <ArrowLeft size={20} /> Back
            </button>
          </div>

          <div className="flex-1 flex items-end md:items-center pb-12 md:pb-0">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-end w-full">
              {/* Poster Card */}
              <div className="hidden md:block w-64 lg:w-80 rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-border rotate-1 hover:rotate-0 transition-transform duration-300">
                <img src={posterUrl} alt={series.title} className="w-full h-auto object-cover" />
              </div>

              {/* Content */}
              <div className="flex-1 space-y-6 md:mb-10">
                <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
                  {series.SeriesGenre?.map((g: any, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/20 backdrop-blur-md">
                      {g.genre.name}
                    </span>
                  ))}
                  {series.releaseDate && (
                    <span className="flex items-center gap-1.5 text-muted-foreground bg-secondary px-3 py-1 rounded-full border border-border">
                      <Calendar size={14} /> {new Date(series.releaseDate).getFullYear()}
                    </span>
                  )}
                  {series.runtime && (
                    <span className="flex items-center gap-1.5 text-muted-foreground bg-secondary px-3 py-1 rounded-full border border-border">
                      <Clock size={14} /> {series.runtime}m / EP
                    </span>
                  )}
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-foreground leading-tight drop-shadow-xl">{series.title}</h1>

                <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed drop-shadow-md">
                  {series.overview || "No overview available."}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-4">
                  {series.trailerLink && (
                    <a href={series.trailerLink} target="_blank" rel="noreferrer" className="group bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/25 transform hover:scale-105">
                      <Play fill="currentColor" size={20} /> Watch Trailer
                    </a>
                  )}
                  <button
                    onClick={() => {
                      if (!currentUser) { setConfirmConfig({ isOpen: true, title: 'Login Required', description: 'You need to be logged in to add to watchlist.', confirmText: 'Go to Login', variant: 'primary', onConfirm: () => router.push('/login') }); return; }
                      addWatchlist({ variables: { seriesName: series.title } });
                    }}
                    className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold border border-border bg-secondary/50 hover:bg-secondary transition-all"
                  >
                    <BookmarkPlus size={18} /> My List
                  </button>
                  <div className="flex items-center gap-2 ml-auto">
                    <div className={`backdrop-blur-md px-6 py-3 rounded-2xl border transition-all duration-500 ${getRatingStyle(series.dominantRating || '')}`}>
                      <span className="text-2xl font-black uppercase tracking-tighter whitespace-nowrap">{series.dominantRating?.replace(/_/g, ' ') || 'No Ratings'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details & Reviews Section */}
      <div className="max-w-5xl mx-auto px-6 mt-16 space-y-16">

        {/* Seasons Section */}
        <section>
          <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              Seasons <span className="text-sm font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">{seasons.length}</span>
            </h2>
          </div>
          <div className="space-y-4">
            {seasons.map((season: any) => (
              <SeasonPanel
                key={season.id}
                season={season}
                currentUser={currentUser}
                seriesTitle={series.title}
              />
            ))}
          </div>
        </section>



        {/* Reviews Section */}
        <section>
          <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              Overall Reviews <span className="text-sm font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">{reviews.length}</span>
            </h2>
            {currentUser && (
              <button
                onClick={() => setShowReviewForm(v => !v)}
                className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 px-4 py-2 rounded-lg text-sm font-semibold transition-all">
                <PenLine size={15} /> Write a Review
              </button>
            )}
          </div>

          {/* Two-column: Gauge + Reviews */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Gauge Panel — sticky on large screens */}
            <div className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24">
              <RatingGaugeMeter reviews={reviews} />
            </div>

            {/* Review cards column */}
            <div className="flex-1 space-y-6">
              {showReviewForm && (
                <ReviewForm
                  label="Share Your Overall Verdict"
                  onSubmit={async (form) => {
                    try {
                      const { data } = await createSeriesReview({ variables: { ...form, seriesName: series.title, rating: form.rating as any } });
                      if (data?.createSeriesReview?.success) {
                        setShowReviewForm(false);
                        refetchReviews();
                        return { success: true };
                      }
                      return { success: false, message: data?.createSeriesReview?.message };
                    } catch (err: any) {
                      return { success: false, message: err.message };
                    }
                  }}
                />
              )}

              {reviews.length === 0 && !showReviewForm ? (
                <div className="py-16 text-center border border-dashed border-border/50 rounded-2xl">
                  <p className="text-muted-foreground text-sm italic">Waiting for the first critical response...</p>
                  {currentUser && (
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="mt-4 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 px-5 py-2 rounded-lg text-sm font-semibold transition-all"
                    >
                      Write the first review
                    </button>
                  )}
                </div>
              ) : (
                reviews.map((r: any) => (
                  <SeriesReviewCard key={r.id} review={r} onRefetch={() => refetchReviews()} currentUser={currentUser} />
                ))
              )}
            </div>
          </div>
        </section>

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
