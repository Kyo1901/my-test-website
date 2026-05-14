import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/common/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostDetailPage from './pages/PostDetailPage';
import BoardPage from './pages/BoardPage';
import SubmitPage from './pages/SubmitPage';
import CreateBoardPage from './pages/CreateBoardPage';
import SavedPage from './pages/SavedPage';

function App() {
  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/post/:postId' element={<PostDetailPage />} />
        <Route path='/b/:boardName' element={<BoardPage />} />
        <Route path='/submit' element={<SubmitPage />} />
        <Route path='/b/create' element={<CreateBoardPage />} />
        <Route path='/saved' element={<SavedPage />} />
      </Routes>
    </Box>
  );
}

export default App;
