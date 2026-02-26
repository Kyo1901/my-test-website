import { createContext, useContext, useState } from 'react';
import { getSession, setSession as saveSession, clearSession } from '../utils/auth.js';

const SessionContext = createContext(null);

/**
 * 전역 세션 컨텍스트 프로바이더
 * — App 전체에서 user 상태를 단일 인스턴스로 공유
 */
export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(() => getSession());

  const login = (userData) => {
    saveSession(userData);
    setUser(userData);
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  return (
    <SessionContext.Provider value={{ user, login, logout }}>
      { children }
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
