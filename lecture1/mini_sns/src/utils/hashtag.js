import { supabase } from './supabase.js';

/**
 * caption에서 해시태그 파싱 (#강아지 → ['강아지'])
 * @param {string} caption
 * @returns {string[]}
 */
export const parseHashtags = (caption) => {
  if (!caption) return [];
  const matches = caption.match(/#([^\s#]+)/g) || [];
  return [...new Set(matches.map((t) => t.slice(1).toLowerCase()))];
};

/**
 * 해시태그를 DB에 저장하고 게시물과 연결
 * @param {number} postId
 * @param {string[]} tags
 */
export const saveHashtags = async (postId, tags) => {
  if (!tags.length) return;

  for (const tag of tags) {
    // upsert 해시태그
    const { data: existing } = await supabase
      .from('sns_hashtags')
      .select('id, use_count')
      .eq('tag_name', tag)
      .maybeSingle();

    let hashtagId;
    if (existing) {
      await supabase
        .from('sns_hashtags')
        .update({ use_count: existing.use_count + 1 })
        .eq('id', existing.id);
      hashtagId = existing.id;
    } else {
      const { data: created } = await supabase
        .from('sns_hashtags')
        .insert([{ tag_name: tag, use_count: 1 }])
        .select('id')
        .single();
      hashtagId = created?.id;
    }

    if (hashtagId) {
      await supabase
        .from('sns_post_hashtags')
        .upsert([{ post_id: postId, hashtag_id: hashtagId }], { onConflict: 'post_id,hashtag_id' });
    }
  }
};

/**
 * 게시물 삭제 시 해시태그 use_count 감소
 * @param {number} postId
 */
export const removePostHashtags = async (postId) => {
  const { data: links } = await supabase
    .from('sns_post_hashtags')
    .select('hashtag_id')
    .eq('post_id', postId);

  if (!links) return;

  for (const link of links) {
    const { data: ht } = await supabase
      .from('sns_hashtags')
      .select('use_count')
      .eq('id', link.hashtag_id)
      .maybeSingle();
    if (ht) {
      await supabase
        .from('sns_hashtags')
        .update({ use_count: Math.max(0, ht.use_count - 1) })
        .eq('id', link.hashtag_id);
    }
  }
};
