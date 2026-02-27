import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase.js';

/**
 * 팔로우 상태 및 팔로워/팔로잉 수 관리 훅
 *
 * @param {number} targetUserId - 대상 사용자 ID [Required]
 * @param {number|null} currentUserId - 로그인한 사용자 ID [Optional]
 *
 * Example usage:
 * const { isFollowing, followerCount, followingCount, toggleFollow } = useFollow(userId, user?.id);
 */
const useFollow = (targetUserId, currentUserId) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!targetUserId) return;

    const fetchFollowData = async () => {
      const [followerRes, followingRes] = await Promise.all([
        supabase
          .from('sns_follows')
          .select('id', { count: 'exact', head: true })
          .eq('following_id', targetUserId),
        supabase
          .from('sns_follows')
          .select('id', { count: 'exact', head: true })
          .eq('follower_id', targetUserId),
      ]);
      setFollowerCount(followerRes.count || 0);
      setFollowingCount(followingRes.count || 0);

      if (currentUserId && currentUserId !== targetUserId) {
        const { data } = await supabase
          .from('sns_follows')
          .select('id')
          .eq('follower_id', currentUserId)
          .eq('following_id', targetUserId)
          .maybeSingle();
        setIsFollowing(!!data);
      }
    };

    fetchFollowData();
  }, [targetUserId, currentUserId]);

  const toggleFollow = async () => {
    if (!currentUserId || loading) return;
    setLoading(true);

    if (isFollowing) {
      await supabase
        .from('sns_follows')
        .delete()
        .eq('follower_id', currentUserId)
        .eq('following_id', targetUserId);
      setIsFollowing(false);
      setFollowerCount((c) => c - 1);
    } else {
      await supabase
        .from('sns_follows')
        .insert([{ follower_id: currentUserId, following_id: targetUserId }]);
      setIsFollowing(true);
      setFollowerCount((c) => c + 1);
    }
    setLoading(false);
  };

  return { isFollowing, followerCount, followingCount, toggleFollow, loading };
};

export default useFollow;
