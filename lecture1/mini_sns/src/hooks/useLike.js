import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase.js';

/**
 * 좋아요 상태 관리 훅 (sns_likes 테이블 기반, 중복 방지)
 *
 * @param {number} postId - 게시물 ID [Required]
 * @param {number} initialCount - 초기 좋아요 수 [Required]
 * @param {number|null} currentUserId - 로그인한 사용자 ID [Optional]
 *
 * Example usage:
 * const { liked, likesCount, toggleLike } = useLike(post.id, post.likes_count, user?.id);
 */
const useLike = (postId, initialCount, currentUserId) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialCount || 0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUserId || !postId) return;
    const checkLiked = async () => {
      const { data } = await supabase
        .from('sns_likes')
        .select('id')
        .eq('user_id', currentUserId)
        .eq('post_id', postId)
        .maybeSingle();
      setLiked(!!data);
    };
    checkLiked();
  }, [postId, currentUserId]);

  const toggleLike = async (e) => {
    if (e) e.stopPropagation();
    if (!currentUserId || loading) return;
    setLoading(true);

    if (liked) {
      await supabase
        .from('sns_likes')
        .delete()
        .eq('user_id', currentUserId)
        .eq('post_id', postId);
      await supabase
        .from('sns_posts')
        .update({ likes_count: Math.max(0, likesCount - 1) })
        .eq('id', postId);
      setLiked(false);
      setLikesCount((c) => Math.max(0, c - 1));
    } else {
      await supabase
        .from('sns_likes')
        .insert([{ user_id: currentUserId, post_id: postId }]);
      await supabase
        .from('sns_posts')
        .update({ likes_count: likesCount + 1 })
        .eq('id', postId);
      setLiked(true);
      setLikesCount((c) => c + 1);
    }
    setLoading(false);
  };

  return { liked, likesCount, toggleLike, loading };
};

export default useLike;
