import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import supabase from '../utils/supabase-client.js';

/**
 * AdminPage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <AdminPage />
 */
function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [posts, setPosts] = useState([]);
  const [products, setProducts] = useState([]);

  /** 공지사항 작성 */
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: '', content: '' });

  /** 제품 등록 */
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: '',
    category: '스마트폰',
    sub_category: '',
    release_date: '',
    price: '',
    image_url: '',
  });

  useEffect(() => {
    fetchPosts();
    fetchProducts();
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('it_info_posts')
      .select('post_id, title, board_type, created_at, it_info_users(name)')
      .order('created_at', { ascending: false });
    if (data) setPosts(data);
  };

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('it_info_products')
      .select('product_id, name, brand, category, price')
      .order('created_at', { ascending: false });
    if (data) setProducts(data);
  };

  const handleCreateNotice = async () => {
    if (!newNotice.title.trim()) return;
    await supabase
      .from('it_info_posts')
      .insert([{
        title: newNotice.title,
        content: newNotice.content,
        board_type: '공지사항',
        user_id: 1,
      }]);
    setIsNoticeOpen(false);
    setNewNotice({ title: '', content: '' });
    fetchPosts();
  };

  const handleDeletePost = async (postId) => {
    await supabase.from('it_info_comments').delete().eq('post_id', postId);
    await supabase.from('it_info_posts').delete().eq('post_id', postId);
    fetchPosts();
  };

  const handleCreateProduct = async () => {
    if (!newProduct.name.trim()) return;
    await supabase
      .from('it_info_products')
      .insert([{
        name: newProduct.name,
        brand: newProduct.brand,
        category: newProduct.category,
        sub_category: newProduct.sub_category,
        release_date: newProduct.release_date || null,
        price: newProduct.price || null,
        image_url: newProduct.image_url || null,
      }]);
    setIsProductOpen(false);
    setNewProduct({
      name: '', brand: '', category: '스마트폰',
      sub_category: '', release_date: '', price: '', image_url: '',
    });
    fetchProducts();
  };

  const handleDeleteProduct = async (productId) => {
    await supabase.from('it_info_reviews').delete().eq('product_id', productId);
    await supabase.from('it_info_products').delete().eq('product_id', productId);
    fetchProducts();
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ko-KR');
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString('ko-KR') + '원';
  };

  return (
    <Box sx={{ width: '100%', py: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <AdminPanelSettingsIcon sx={{ color: 'primary.main', mr: 1, fontSize: '2rem' }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            관리자
          </Typography>
        </Box>

        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
          <Tab label="공지사항 관리" />
          <Tab label="게시글 관리" />
          <Tab label="제품 관리" />
        </Tabs>

        {/* 공지사항 관리 */}
        {activeTab === 0 && (
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>공지사항</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsNoticeOpen(true)}
              >
                공지 작성
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>제목</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: 120 }}>등록일</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: 80 }}>관리</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {posts.filter((p) => p.board_type === '공지사항').map((post) => (
                    <TableRow key={post.post_id} hover>
                      <TableCell
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/notices/${post.post_id}`)}
                      >
                        {post.title}
                      </TableCell>
                      <TableCell>{formatDate(post.created_at)}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeletePost(post.post_id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* 게시글 관리 */}
        {activeTab === 1 && (
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              게시글 관리
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>제목</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: 100 }}>게시판</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: 100 }}>작성자</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: 120 }}>등록일</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: 80 }}>관리</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {posts.filter((p) => p.board_type !== '공지사항').map((post) => (
                    <TableRow key={post.post_id} hover>
                      <TableCell
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/community/${post.post_id}`)}
                      >
                        {post.title}
                      </TableCell>
                      <TableCell>{post.board_type}</TableCell>
                      <TableCell>{post.it_info_users?.name}</TableCell>
                      <TableCell>{formatDate(post.created_at)}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeletePost(post.post_id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* 제품 관리 */}
        {activeTab === 2 && (
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>제품 관리</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsProductOpen(true)}
              >
                제품 등록
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>제품명</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: 100 }}>브랜드</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: 100 }}>카테고리</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: 120 }}>가격</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: 80 }}>관리</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.product_id} hover>
                      <TableCell
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/products/${product.product_id}`)}
                      >
                        {product.name}
                      </TableCell>
                      <TableCell>{product.brand}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.price ? formatPrice(product.price) : '-'}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteProduct(product.product_id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* 공지사항 작성 다이얼로그 */}
        <Dialog open={isNoticeOpen} onClose={() => setIsNoticeOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>공지사항 작성</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="제목"
              value={newNotice.title}
              onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
              sx={{ mt: 1, mb: 2 }}
            />
            <TextField
              fullWidth
              label="내용"
              multiline
              rows={6}
              value={newNotice.content}
              onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsNoticeOpen(false)}>취소</Button>
            <Button variant="contained" onClick={handleCreateNotice}>등록</Button>
          </DialogActions>
        </Dialog>

        {/* 제품 등록 다이얼로그 */}
        <Dialog open={isProductOpen} onClose={() => setIsProductOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>제품 등록</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="제품명"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label="브랜드"
                  value={newProduct.brand}
                  onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="카테고리"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                >
                  <MenuItem value="스마트폰">스마트폰</MenuItem>
                  <MenuItem value="노트북">노트북</MenuItem>
                  <MenuItem value="웨어러블">웨어러블</MenuItem>
                  <MenuItem value="가전">가전</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label="세부 카테고리"
                  value={newProduct.sub_category}
                  onChange={(e) => setNewProduct({ ...newProduct, sub_category: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="출시일"
                  value={newProduct.release_date}
                  onChange={(e) => setNewProduct({ ...newProduct, release_date: e.target.value })}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="가격 (원)"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label="이미지 URL"
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsProductOpen(false)}>취소</Button>
            <Button variant="contained" onClick={handleCreateProduct}>등록</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default AdminPage;
