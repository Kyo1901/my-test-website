import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/login-page.jsx';
import HomePage from './pages/home-page.jsx';
import PostDetailPage from './pages/post-detail-page.jsx';
import CreatePostPage from './pages/create-post-page.jsx';
import SearchPage from './pages/search-page.jsx';
import ProfilePage from './pages/profile-page.jsx';
import { useSession } from './context/SessionContext.jsx';

/**
 * 앱 루트 컴포넌트 — React Router 설정
 */
const App = () => {
  const { user } = useSession();

  return (
    <BrowserRouter basename='/mini-sns'>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/' element={ user ? <HomePage /> : <Navigate to='/login' replace /> } />
        <Route path='/post/:id' element={<PostDetailPage />} />
        <Route path='/create' element={ user ? <CreatePostPage /> : <Navigate to='/login' replace /> } />
        <Route path='/search' element={<SearchPage />} />
        <Route path='/profile' element={ user ? <ProfilePage /> : <Navigate to='/login' replace /> } />
        <Route path='/profile/:userId' element={<ProfilePage />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
