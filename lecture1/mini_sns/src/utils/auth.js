/**
 * 로컬 세션 관리 유틸리티 (Supabase Auth 미사용 — 자체 sns_users 테이블 기반)
 */

const SESSION_KEY = 'pawlog_user';

/** 현재 로그인된 사용자 반환 */
export const getSession = () => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/** 사용자 세션 저장 */
export const setSession = (user) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

/** 세션 삭제 (로그아웃) */
export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};
