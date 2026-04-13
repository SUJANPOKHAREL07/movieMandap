'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, gql } from '@apollo/client';
import UserNavBar from '@/components/UserNavBar';
import { Play, Star, Calendar, Clock, ArrowLeft, BookmarkPlus, PenLine, Check, Trash2, Edit2, X, MoreHorizontal, ThumbsUp, ThumbsDown, MessageSquare, Reply } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ConfirmDialog from '@/components/ConfirmDialog';
import { buildAccessMap, isRouteAllowedInMap, Role } from '@/lib/routeAccess';

const GET_MOVIES = gql`
  query GetMovies {
    getMovie {
      id
      title
      overview
      posterPath
      voteAverage
      dominantRating
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
      likesCount
      disLikesCount
      commentsCount
      userHasLiked
      userHasDisliked
      createdAt
      updatedAt
      user {
        id
        username
      }
      comments {
        id
        content
        parentId
        likesCount
        disLikesCount
        userHasLiked
        userHasDisliked
        createdAt
        updatedAt
        user {
          id
          username
        }
        replies {
          id
          content
          parentId
          likesCount
          disLikesCount
          userHasLiked
          userHasDisliked
          createdAt
          updatedAt
          user {
            id
            username
          }
          replies {
            id
            content
            parentId
            likesCount
            disLikesCount
            userHasLiked
            userHasDisliked
            createdAt
            updatedAt
            user {
              id
              username
            }
          }
        }
      }
    }
  }
`;

const UPDATE_REVIEW = gql`
  mutation UpdateReview($reviewId: Int!, $title: String, $content: String, $rating: Ratings, $isSpoiler: Boolean) {
    updateReview(reviewId: $reviewId, title: $title, content: $content, rating: $rating, isSpoiler: $isSpoiler) {
      success
      message
    }
  }
`;

const DELETE_REVIEW = gql`
  mutation DeleteReview($reviewId: Int!) {
    deleteReview(reviewId: $reviewId) {
      success
      message
    }
  }
`;

const UPDATE_COMMENT = gql`
  mutation UpdateComment($commentId: Int!, $content: String!) {
    updateComment(commentId: $commentId, content: $content) {
      success
      message
    }
  }
`;

const DELETE_COMMENT = gql`
  mutation DeleteComment($commentId: Int!) {
    deleteComment(commentId: $commentId) {
      success
      message
    }
  }
`;

const CREATE_COMMENT = gql`
  mutation CreateComment($content: String!, $reviewId: Int!, $parentId: Int) {
    createComment(content: $content, reviewId: $reviewId, parentId: $parentId) {
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

const GET_ROUTE_ACCESS = gql`
  query GetRouteAccess {
    getRouteAccess {
      routeId
      role
      allowed
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

const TOGGLE_REVIEW_LIKE = gql`
  mutation ToggleReviewLike($reviewId: Int!) {
    toggleReviewLike(reviewId: $reviewId) {
      success
      message
    }
  }
`;

const TOGGLE_REVIEW_DISLIKE = gql`
  mutation ToggleReviewDislike($reviewId: Int!) {
    toggleReviewDislike(reviewId: $reviewId) {
      success
      message
    }
  }
`;

const TOGGLE_COMMENT_LIKE = gql`
  mutation ToggleCommentLike($commentId: Int!) {
    toggleCommentLike(commentId: $commentId) {
      success
      message
    }
  }
`;

const TOGGLE_COMMENT_DISLIKE = gql`
  mutation ToggleCommentDislike($commentId: Int!) {
    toggleCommentDislike(commentId: $commentId) {
      success
      message
    }
  }
`;

const getRatingStyle = (rating: string) => {
  const r = rating.toUpperCase();
  if (r.includes('ABSOLUTE CINEMA')) return 'bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-500 text-white border-orange-400/50 shadow-[0_0_30px_rgba(249,115,22,0.6)]';
  if (r.includes('WORTHY')) return 'bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 text-white border-blue-400/50 shadow-[0_0_30px_rgba(59,130,246,0.6)]';
  if (r.includes('GOOD TO WATCH')) return 'bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-400 text-white border-emerald-400/50 shadow-[0_0_30px_rgba(16,185,129,0.6)]';
  if (r.includes('BEARABLE')) return 'bg-gradient-to-br from-amber-500 via-amber-400 to-yellow-300 text-black border-amber-400/50 shadow-[0_0_30px_rgba(245,158,11,0.6)]';
  if (r.includes('WORST')) return 'bg-gradient-to-br from-rose-600 via-red-500 to-orange-400 text-white border-red-400/50 shadow-[0_0_30px_rgba(239,68,68,0.6)]';
  return 'bg-secondary/40 border-border text-muted-foreground';
};

const CommentItem = ({
  comment,
  onRefetch,
  canComment,
  canLike,
  parentSetConfirmConfig,
  depth = 0
}: {
  comment: any,
  onRefetch: () => void,
  canComment: boolean,
  canLike: boolean,
  parentSetConfirmConfig: any,
  depth?: number
}) => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [activeMenu, setActiveMenu] = useState(false);

  // New local confirmation state for CommentItem
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant: 'danger' | 'warning' | 'primary';
    confirmText?: string;
    showCancel?: boolean;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => { },
    variant: 'primary',
    showCancel: true,
  });

  const closeConfirm = () => setConfirmConfig(prev => ({ ...prev, isOpen: false }));

  const [updateComment] = useMutation(gql`
    mutation UpdateComment($commentId: Int!, $content: String!) {
      updateComment(commentId: $commentId, content: $content) { success }
    }
  `);

  const [deleteComment] = useMutation(gql`
    mutation DeleteComment($commentId: Int!) {
      deleteComment(commentId: $commentId) { success }
    }
  `);

  const [toggleLike] = useMutation(TOGGLE_COMMENT_LIKE);
  const [toggleDislike] = useMutation(TOGGLE_COMMENT_DISLIKE);
  const [createComment] = useMutation(CREATE_COMMENT);

  const handleUpdate = async () => {
    if (!editedContent.trim()) return;
    await updateComment({ variables: { commentId: comment.id, content: editedContent } });
    setIsEditing(false);
    onRefetch();
  };

  const handleDelete = async () => {
    setConfirmConfig({
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
        reviewId: Number(comment.reviewId), // This needs to be passed down or available
        content: replyContent,
        parentId: comment.id
      }
    });
    setReplyContent('');
    setShowReplyBox(false);
    onRefetch();
  };

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
                if (!currentUser) {
                  parentSetConfirmConfig({
                    isOpen: true,
                    title: 'Authentication Required',
                    description: 'You need to be logged in to like a comment. Would you like to login or register now?',
                    confirmText: 'Go to Login',
                    variant: 'primary',
                    onConfirm: () => router.push('/login')
                  });
                  return;
                }
                if (!canLike) return;
                toggleLike({ variables: { commentId: comment.id } }).then(() => onRefetch());
              }}
              disabled={!canLike}
              className={`flex items-center gap-1 text-[11px] font-semibold transition-colors ${comment.userHasLiked ? 'text-primary' : 'text-muted-foreground hover:text-primary'} ${!canLike ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ThumbsUp size={12} className={comment.userHasLiked ? 'fill-primary' : ''} /> {comment.likesCount || 0}
            </button>
            <button
              onClick={() => {
                if (!currentUser) {
                  parentSetConfirmConfig({
                    isOpen: true,
                    title: 'Authentication Required',
                    description: 'You need to be logged in to dislike a comment. Would you like to login or register now?',
                    confirmText: 'Go to Login',
                    variant: 'primary',
                    onConfirm: () => router.push('/login')
                  });
                  return;
                }
                if (!canLike) return;
                toggleDislike({ variables: { commentId: comment.id } }).then(() => onRefetch());
              }}
              disabled={!canLike}
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

          {/* Render Replies */}
          {comment.replies?.map((reply: any) => (
            <CommentItem
              key={reply.id}
              comment={{ ...reply, reviewId: comment.reviewId }}
              onRefetch={onRefetch}
              canComment={canComment}
              canLike={canLike}
              parentSetConfirmConfig={parentSetConfirmConfig}
              depth={depth + 1}
            />
          ))}
        </div>
      </div>

      {/* Render local ConfirmDialog for CommentItem */}
      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        description={confirmConfig.description}
        confirmText={confirmConfig.confirmText}
        variant={confirmConfig.variant}
        showCancel={confirmConfig.showCancel}
      />
    </div>
  );
};

const ReviewCard = ({ review, onRefetch, canComment, canReview, canLike, parentSetConfirmConfig }: { review: any, onRefetch: () => void, canComment: boolean, canReview: boolean, canLike: boolean, parentSetConfirmConfig: any }) => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const isReviewOwner = currentUser?.id === review.user?.id;
  // console.log('Ownership Check:', { currentUser: currentUser?.id, reviewUser: review.user?.id, match: isReviewOwner });

  // Comment Box State
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState('');

  // Editing Review State
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [editReviewForm, setEditReviewForm] = useState({
    title: review.title,
    content: review.content,
    rating: review.rating,
    isSpoiler: review.isSpoiler,
  });

  // Editing Comment State
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState('');

  // Menu state
  const [showReviewMenu, setShowReviewMenu] = useState(false);
  const [activeCommentMenuId, setActiveCommentMenuId] = useState<number | null>(null);

  // Confirmation state
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant: 'danger' | 'warning' | 'primary';
    confirmText?: string;
    showCancel?: boolean;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => { },
    variant: 'primary',
    showCancel: true,
  });

  const closeConfirm = () => setConfirmConfig(prev => ({ ...prev, isOpen: false }));

  const [toggleReviewLike] = useMutation(TOGGLE_REVIEW_LIKE);
  const [toggleReviewDislike] = useMutation(TOGGLE_REVIEW_DISLIKE);

  const [addComment, { loading: addingComment }] = useMutation(CREATE_COMMENT, {
    onCompleted: () => {
      setCommentText('');
      onRefetch();
    }
  });

  const [updateReview, { loading: updatingReview }] = useMutation(UPDATE_REVIEW, {
    onCompleted: (data) => {
      if (data?.updateReview?.success) {
        setIsEditingReview(false);
        onRefetch();
      } else {
        setConfirmConfig({
          isOpen: true,
          title: "Update Failed",
          description: data?.updateReview?.message || "Failed to update review",
          confirmText: "OK",
          variant: 'warning',
          showCancel: false,
          onConfirm: () => { }
        });
      }
    },
    onError: (error) => setConfirmConfig({
      isOpen: true,
      title: "Error",
      description: error.message,
      confirmText: "OK",
      variant: 'danger',
      showCancel: false,
      onConfirm: () => { }
    })
  });

  const [deleteReview, { loading: deletingReview }] = useMutation(DELETE_REVIEW, {
    onCompleted: (data) => {
      if (data?.deleteReview?.success) {
        onRefetch();
      } else {
        setConfirmConfig({
          isOpen: true,
          title: "Delete Failed",
          description: data?.deleteReview?.message || "Failed to delete review",
          confirmText: "OK",
          variant: 'warning',
          showCancel: false,
          onConfirm: () => { }
        });
      }
    },
    onError: (error) => setConfirmConfig({
      isOpen: true,
      title: "Error",
      description: error.message,
      confirmText: "OK",
      variant: 'danger',
      showCancel: false,
      onConfirm: () => { }
    })
  });

  const [updateComment, { loading: updatingComment }] = useMutation(UPDATE_COMMENT, {
    onCompleted: (data) => {
      if (data?.updateComment?.success) {
        setEditingCommentId(null);
        setEditCommentText('');
        onRefetch();
      } else {
        setConfirmConfig({
          isOpen: true,
          title: "Update Failed",
          description: data?.updateComment?.message || "Failed to update comment",
          confirmText: "OK",
          variant: 'warning',
          showCancel: false,
          onConfirm: () => { }
        });
      }
    },
    onError: (error) => setConfirmConfig({
      isOpen: true,
      title: "Error",
      description: error.message,
      confirmText: "OK",
      variant: 'danger',
      showCancel: false,
      onConfirm: () => { }
    })
  });

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    onCompleted: (data) => {
      if (data?.deleteComment?.success) {
        onRefetch();
      } else {
        setConfirmConfig({
          isOpen: true,
          title: "Delete Failed",
          description: data?.deleteComment?.message || "Failed to delete comment",
          confirmText: "OK",
          variant: 'warning',
          showCancel: false,
          onConfirm: () => { }
        });
      }
    },
    onError: (error) => setConfirmConfig({
      isOpen: true,
      title: "Error",
      description: error.message,
      confirmText: "OK",
      variant: 'danger',
      showCancel: false,
      onConfirm: () => { }
    })
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment({ variables: { content: commentText, reviewId: review.id } });
  };

  const handleUpdateReview = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmConfig({
      isOpen: true,
      title: "Confirm Update",
      description: "Are you sure you want to save these changes to your review?",
      confirmText: "Save Changes",
      variant: 'primary',
      onConfirm: () => updateReview({ variables: { reviewId: review.id, ...editReviewForm } })
    });
  };

  const handleDeleteReview = () => {
    setConfirmConfig({
      isOpen: true,
      title: "Delete Review",
      description: "Are you sure you want to delete this review? This action cannot be undone.",
      confirmText: "Delete",
      variant: 'danger',
      onConfirm: () => deleteReview({ variables: { reviewId: review.id } })
    });
  };

  const handleUpdateComment = (e: React.FormEvent, commentId: number) => {
    e.preventDefault();
    setConfirmConfig({
      isOpen: true,
      title: "Confirm Update",
      description: "Are you sure you want to save the changes to your comment?",
      confirmText: "Save Changes",
      variant: 'primary',
      onConfirm: () => updateComment({ variables: { commentId, content: editCommentText } })
    });
  };

  const handleDeleteComment = (commentId: number) => {
    setConfirmConfig({
      isOpen: true,
      title: "Delete Comment",
      description: "Are you sure you want to delete this comment? This action cannot be undone.",
      confirmText: "Delete",
      variant: 'danger',
      onConfirm: () => deleteComment({ variables: { commentId } })
    });
  };

  const isReviewEdited = Number(review.updatedAt) > Number(review.createdAt) + 1000;

  if (isEditingReview) {
    return (
      <>
        <form onSubmit={handleUpdateReview} className="bg-card p-6 rounded-xl border border-border/50 border-primary shadow-lg space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg text-primary flex items-center gap-2"><Edit2 size={16} /> Edit Review</h3>
            <button
              type="button"
              onClick={() => {
                const isDirty = editReviewForm.title !== review.title ||
                  editReviewForm.content !== review.content ||
                  editReviewForm.rating !== review.rating ||
                  editReviewForm.isSpoiler !== review.isSpoiler;

                if (isDirty) {
                  setConfirmConfig({
                    isOpen: true,
                    title: "Discard Changes?",
                    description: "You have unsaved changes. Are you sure you want to discard them?",
                    confirmText: "Discard",
                    variant: 'warning',
                    onConfirm: () => setIsEditingReview(false)
                  });
                } else {
                  setIsEditingReview(false);
                }
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
          </div>
          <input
            type="text"
            value={editReviewForm.title}
            onChange={e => setEditReviewForm({ ...editReviewForm, title: e.target.value })}
            className="w-full px-4 py-2 bg-secondary border border-border rounded-lg"
            placeholder="Title"
          />
          <textarea
            value={editReviewForm.content}
            onChange={e => setEditReviewForm({ ...editReviewForm, content: e.target.value })}
            className="w-full px-4 py-2 bg-secondary border border-border rounded-lg resize-none"
            rows={3}
            placeholder="Content"
          />
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={editReviewForm.rating}
              onChange={e => setEditReviewForm({ ...editReviewForm, rating: e.target.value })}
              className="w-full sm:flex-1 px-4 py-2 bg-secondary border border-border rounded-lg"
            >
              {RATINGS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
            <label className="flex items-center gap-2 cursor-pointer select-none text-sm px-2">
              <div
                onClick={() => setEditReviewForm({ ...editReviewForm, isSpoiler: !editReviewForm.isSpoiler })}
                className={`w-10 h-6 rounded-full transition-all flex items-center px-1 border-2 ${editReviewForm.isSpoiler ? 'bg-red-500 border-red-500' : 'bg-slate-200 dark:bg-zinc-700 border-slate-300 dark:border-zinc-600'}`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-md transition-transform ${editReviewForm.isSpoiler ? 'translate-x-4' : ''}`} />
              </div>
              <span className={`font-bold transition-colors ${editReviewForm.isSpoiler ? 'text-red-500' : 'text-muted-foreground'}`}>Spoiler</span>
            </label>
          </div>
          <button disabled={updatingReview} type="submit" className="w-full bg-primary text-black font-bold py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50">
            Save Changes
          </button>
        </form>

        <ConfirmDialog
          isOpen={confirmConfig.isOpen}
          onClose={closeConfirm}
          onConfirm={confirmConfig.onConfirm}
          title={confirmConfig.title}
          description={confirmConfig.description}
          confirmText={confirmConfig.confirmText}
          variant={confirmConfig.variant}
          showCancel={confirmConfig.showCancel}
        />
      </>
    );
  }

  return (
    <div className={`bg-card p-6 rounded-xl border border-border/50 hover:border-primary/30 transition-colors ${deletingReview ? 'opacity-50' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
            {review.user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h4 className="font-bold text-foreground leading-none">{review.user?.username || "Anonymous"}</h4>
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
              <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                {new Date(Number(review.createdAt)).toLocaleDateString()}
                {isReviewEdited && <span className="ml-1 italic opacity-60">(edited)</span>}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {review.isSpoiler && (
            <span className="text-[10px] uppercase tracking-wider font-bold bg-red-500/10 text-red-500 px-2 py-0.5 rounded border border-red-500/20 mr-1">Spoiler</span>
          )}
          {isReviewOwner && (
            <div className="relative">
              <button
                onClick={() => setShowReviewMenu(!showReviewMenu)}
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                title="Options"
              >
                <MoreHorizontal size={20} />
              </button>

              {showReviewMenu && canReview && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowReviewMenu(false)} />
                  <div className="absolute right-0 mt-2 w-36 bg-card border border-border/50 rounded-xl shadow-2xl z-50 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100">
                    <button
                      onClick={() => { setIsEditingReview(true); setShowReviewMenu(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-primary/10 flex items-center gap-2 transition-colors"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => { handleDeleteReview(); setShowReviewMenu(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <h3 className="font-bold text-lg mb-2 text-foreground">{review.title}</h3>
      <p className="text-muted-foreground leading-relaxed mb-4">{review.content}</p>

      {/* Action Bar */}
      <div className="flex items-center gap-6 text-sm mt-4 border-t border-border/30 pt-4 px-1">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (!currentUser) {
                parentSetConfirmConfig({
                  isOpen: true,
                  title: 'Authentication Required',
                  description: 'You need to be logged in to like a review. Would you like to login or register now?',
                  confirmText: 'Go to Login',
                  variant: 'primary',
                  onConfirm: () => router.push('/login')
                });
                return;
              }
              if (!canLike) return;
              toggleReviewLike({ variables: { reviewId: Number(review.id) } }).then(() => onRefetch());
            }}
            disabled={!canLike}
            className={`flex items-center gap-1.5 font-bold transition-all ${review.userHasLiked ? 'text-primary' : 'text-muted-foreground hover:text-primary'} ${!canLike ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <ThumbsUp size={18} className={review.userHasLiked ? 'fill-primary' : ''} />
            <span>{review.likesCount || 0}</span>
          </button>

          <button
            onClick={() => {
              if (!currentUser) {
                parentSetConfirmConfig({
                  isOpen: true,
                  title: 'Authentication Required',
                  description: 'You need to be logged in to dislike a review. Would you like to login or register now?',
                  confirmText: 'Go to Login',
                  variant: 'primary',
                  onConfirm: () => router.push('/login')
                });
                return;
              }
              if (!canLike) return;
              toggleReviewDislike({ variables: { reviewId: Number(review.id) } }).then(() => onRefetch());
            }}
            disabled={!canLike}
            className={`flex items-center gap-1.5 font-bold transition-all ${review.userHasDisliked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'} ${!canLike ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <ThumbsDown size={18} className={review.userHasDisliked ? 'fill-red-500' : ''} />
            <span>{review.disLikesCount || 0}</span>
          </button>
        </div>

        <button
          onClick={() => setShowCommentBox(!showCommentBox)}
          className={`flex items-center gap-2 font-bold transition-all ${showCommentBox ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
        >
          <MessageSquare size={18} />
          <span>{review.commentsCount || 0} <span className="hidden sm:inline">Comments</span></span>
        </button>
      </div>

      {showCommentBox && (
        <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Add Comment Input */}
          {canComment && (
            <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  onClick={() => {
                    if (!currentUser) {
                      parentSetConfirmConfig({
                        isOpen: true,
                        title: 'Authentication Required',
                        description: 'You need to be logged in to write a comment. Would you like to login or register now?',
                        confirmText: 'Go to Login',
                        variant: 'primary',
                        onConfirm: () => router.push('/login')
                      });
                    }
                  }}
                  readOnly={!currentUser}
                  placeholder={currentUser ? "Write a comment..." : "Login to comment..."}
                  className="flex-1 bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all"
                />
                <button
                  disabled={addingComment || !commentText.trim() || !currentUser}
                  type="submit"
                  className="bg-primary text-black px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 hover:bg-orange-600 transition-all shadow-md shadow-primary/20"
                >
                  {addingComment ? '...' : 'Post'}
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowCommentBox(false)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* List existing comments */}
          <div className="space-y-4">
            {review.comments?.map((comment: any) => (
              <CommentItem
                key={comment.id}
                comment={{ ...comment, reviewId: review.id }}
                onRefetch={onRefetch}
                canComment={canComment}
                canLike={canLike}
                parentSetConfirmConfig={parentSetConfirmConfig}
              />
            ))}
            {(!review.comments || review.comments.length === 0) && (
              <p className="text-center py-6 text-sm text-muted-foreground italic border border-dashed border-border/50 rounded-xl">No comments yet. Start the conversation!</p>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        description={confirmConfig.description}
        confirmText={confirmConfig.confirmText}
        variant={confirmConfig.variant}
      />
    </div>
  );
};
export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { currentUser } = useAuth();

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

  // Confirmation state for new review
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    onConfirm: () => void;
    title?: string;
    description?: string;
    confirmText?: string;
    variant?: 'danger' | 'warning' | 'primary';
  }>({
    isOpen: false,
    onConfirm: () => { },
  });

  // 1. Fetch all movies (since API doesn't support getById)
  const { data: movieData, loading: movieLoading, error: movieError } = useQuery(GET_MOVIES);

  // 2. Find the specific movie
  const movie = movieData?.getMovie?.find((m: any) => String(m.id) === String(id));

  // 3. Fetch reviews only if movie is found
  const { data: reviewData, loading: reviewLoading, refetch: refetchReviews } = useQuery(GET_REVIEWS, {
    variables: { movieName: movie?.title || '' },
    skip: !movie,
  });

  const { data: accessData } = useQuery(GET_ROUTE_ACCESS);
  const accessMap = buildAccessMap(accessData?.getRouteAccess ?? []);
  const userRole = ((currentUser?.role as Role) || 'user');

  const canReview = isRouteAllowedInMap(accessMap, 'reviews', userRole);
  const canComment = isRouteAllowedInMap(accessMap, 'comments', userRole);
  const canLike = isRouteAllowedInMap(accessMap, 'likes', userRole);

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
                    <span className="flex items-center gap-1.5 text-muted-foreground bg-secondary px-3 py-1 rounded-full border border-border">
                      <Calendar size={14} /> {new Date(movie.releaseDate).getFullYear()}
                    </span>
                  )}
                  {movie.runtime && (
                    <span className="flex items-center gap-1.5 text-muted-foreground bg-secondary px-3 py-1 rounded-full border border-border">
                      <Clock size={14} /> {movie.runtime}m
                    </span>
                  )}
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-foreground leading-tight drop-shadow-xl">{movie.title}</h1>

                <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed drop-shadow-md">
                  {movie.overview || "No overview available."}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <button className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/25 transform hover:scale-105">
                    <Play fill="currentColor" size={20} /> Watch Movie
                  </button>
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        setConfirmConfig({
                          isOpen: true,
                          title: 'Authentication Required',
                          description: 'You need to be logged in to add movies to your list. Would you like to login or register now?',
                          confirmText: 'Go to Login',
                          variant: 'primary',
                          onConfirm: () => router.push('/login')
                        });
                        return;
                      }
                      handleAddToWatchlist();
                    }}
                    disabled={addingWatchlist || watchlistAdded}
                    className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold border border-border bg-secondary/50 hover:bg-secondary transition-all disabled:opacity-60"
                  >
                    {watchlistAdded ? <Check size={18} className="text-green-400" /> : <BookmarkPlus size={18} />}
                    {watchlistAdded ? 'Added' : 'My List'}
                  </button>
                  <div className="flex items-center gap-2 ml-auto">
                    <div className={`backdrop-blur-md px-6 py-3 rounded-2xl border transition-all duration-500 ${getRatingStyle(movie.dominantRating || '')}`}>
                      <span className="text-2xl font-black uppercase tracking-tighter whitespace-nowrap">{movie.dominantRating || 'No Ratings'}</span>
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

        {/* Reviews Section */}
        <section>
          <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              User Reviews <span className="text-sm font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">{reviews.length}</span>
            </h2>
            <button
              onClick={() => {
                if (!currentUser) {
                  setConfirmConfig({
                    isOpen: true,
                    title: 'Authentication Required',
                    description: 'You need to be logged in to write a review. Would you like to login or register now?',
                    confirmText: 'Go to Login',
                    variant: 'primary',
                    onConfirm: () => router.push('/login')
                  });
                  return;
                }
                if (showReviewForm) {
                  const isDirty = reviewForm.title.trim() !== '' ||
                    reviewForm.content.trim() !== '' ||
                    reviewForm.rating !== 'Good_To_Watch' ||
                    reviewForm.isSpoiler !== false;

                  if (isDirty) {
                    setConfirmConfig({
                      isOpen: true,
                      title: 'Discard Review?',
                      description: 'You have started writing a review. Are you sure you want to discard it?',
                      confirmText: 'Discard',
                      variant: 'warning',
                      onConfirm: () => setShowReviewForm(false)
                    });
                  } else {
                    setShowReviewForm(false);
                  }
                } else {
                  setShowReviewForm(true);
                  setReviewError('');
                }
              }}
              className={`flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${!canReview ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
              disabled={!canReview}
              title={!canReview ? 'Reviews are currently disabled' : undefined}
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

              <div className="flex flex-col md:flex-row gap-4">
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
                      className={`w-10 h-6 rounded-full transition-all flex items-center px-1 border-2 ${reviewForm.isSpoiler ? 'bg-red-500 border-red-500' : 'bg-slate-200 dark:bg-zinc-700 border-slate-300 dark:border-zinc-600'
                        }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-md transition-transform ${reviewForm.isSpoiler ? 'translate-x-4' : ''}`} />
                    </div>
                    <span className={`font-bold transition-colors ${reviewForm.isSpoiler ? 'text-red-500' : 'text-muted-foreground'}`}>Contains Spoiler</span>
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
                <ReviewCard
                  key={review.id}
                  review={review}
                  onRefetch={() => refetchReviews()}
                  canComment={canComment}
                  canReview={canReview}
                  canLike={canLike}
                  parentSetConfirmConfig={setConfirmConfig}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-secondary/20 rounded-xl border border-dashed border-border">
              <p className="text-muted-foreground">No reviews yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </section>

      </div>

      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title || "Discard Review?"}
        description={confirmConfig.description || "You have started writing a review. Are you sure you want to discard it?"}
        confirmText={confirmConfig.confirmText || "Discard"}
        variant={confirmConfig.variant || "warning"}
      />
    </div>
  );
}
