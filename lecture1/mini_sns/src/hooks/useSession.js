import { useState, useEffect } from 'react';
import { getSession, setSession as saveSession, clearSession } from '../utils/auth.js';

/**
 * 로그인 세션 훅
 * @returns {{ user, login, logout }}
 */
const useSession = () => {
  const [user, setUser] = useState(() => getSession());

  const login = (userData) => {
    saveSession(userData);
    setUser(userData);
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  useEffect(() => {
    setUser(getSession());
  }, []);

  return { user, login, logout };
};

export default useSession;
