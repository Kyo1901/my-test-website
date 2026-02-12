import { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../utils/supabase-client.js';

const AuthContext = createContext(null);

/**
 * AuthProvider 컴포넌트
 *
 * Props:
 * @param {React.ReactNode} children - 하위 컴포넌트 [Required]
 *
 * Example usage:
 * <AuthProvider><App /></AuthProvider>
 */
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('it_info_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  /** 로그인 */
  const login = async (email, password) => {
    const { data, error } = await supabase
      .from('it_info_users')
      .select('user_id, name, email, phone, created_at')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (error || !data) {
      return { success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' };
    }

    setUser(data);
    localStorage.setItem('it_info_user', JSON.stringify(data));
    return { success: true };
  };

  /** 회원가입 */
  const register = async ({ name, email, password, phone }) => {
    const { data: existing } = await supabase
      .from('it_info_users')
      .select('user_id')
      .eq('email', email)
      .single();

    if (existing) {
      return { success: false, message: '이미 사용 중인 이메일입니다.' };
    }

    const { data, error } = await supabase
      .from('it_info_users')
      .insert([{ name, email, password, phone }])
      .select('user_id, name, email, phone, created_at')
      .single();

    if (error) {
      return { success: false, message: '회원가입에 실패했습니다. 다시 시도해주세요.' };
    }

    setUser(data);
    localStorage.setItem('it_info_user', JSON.stringify(data));
    return { success: true };
  };

  /** 로그아웃 */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('it_info_user');
  };

  /** 관리자 여부 (user_id === 1) */
  const isAdmin = user?.user_id === 1;

  return (
    <AuthContext.Provider value={{ user, isLoading, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider };
export default useAuth;
