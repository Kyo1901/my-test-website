import { Routes, Route } from 'react-router-dom';
import Layout from './components/common/layout.jsx';
import HomePage from './pages/home-page.jsx';
import NoticeListPage from './pages/notice-list-page.jsx';
import NoticeDetailPage from './pages/notice-detail-page.jsx';
import CommunityPage from './pages/community-page.jsx';
import CommunityPostPage from './pages/community-post-page.jsx';
import ProductListPage from './pages/product-list-page.jsx';
import ProductDetailPage from './pages/product-detail-page.jsx';
import AdminPage from './pages/admin-page.jsx';
import ProfilePage from './pages/profile-page.jsx';
import LoginPage from './pages/login-page.jsx';
import RegisterPage from './pages/register-page.jsx';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/notices" element={<NoticeListPage />} />
        <Route path="/notices/:postId" element={<NoticeDetailPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/:postId" element={<CommunityPostPage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
