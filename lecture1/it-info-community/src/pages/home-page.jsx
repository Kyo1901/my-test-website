import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import SearchIcon from '@mui/icons-material/Search';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import LaptopIcon from '@mui/icons-material/Laptop';
import WatchIcon from '@mui/icons-material/Watch';
import KitchenIcon from '@mui/icons-material/Kitchen';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import supabase from '../utils/supabase-client.js';

const categories = [
  { label: '스마트폰', icon: <SmartphoneIcon />, value: '스마트폰' },
  { label: '노트북', icon: <LaptopIcon />, value: '노트북' },
  { label: '웨어러블', icon: <WatchIcon />, value: '웨어러블' },
  { label: '가전', icon: <KitchenIcon />, value: '가전' },
];

/**
 * HomePage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <HomePage />
 */
function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [notices, setNotices] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [latestReviews, setLatestReviews] = useState([]);

  useEffect(() => {
    fetchNotices();
    fetchPopularPosts();
    fetchTopProducts();
    fetchLatestReviews();
  }, []);

  const fetchNotices = async () => {
    const { data } = await supabase
      .from('it_info_posts')
      .select('post_id, title, created_at')
      .eq('board_type', '공지사항')
      .order('created_at', { ascending: false })
      .limit(3);
    if (data) setNotices(data);
  };

  const fetchPopularPosts = async () => {
    const { data } = await supabase
      .from('it_info_posts')
      .select('post_id, title, board_type, likes, created_at, it_info_users(name)')
      .neq('board_type', '공지사항')
      .order('likes', { ascending: false })
      .limit(5);
    if (data) setPopularPosts(data);
  };

  const fetchTopProducts = async () => {
    const { data: products } = await supabase
      .from('it_info_products')
      .select('product_id, name, brand, category, price, image_url')
      .limit(6);

    if (products) {
      const productsWithRating = await Promise.all(
        products.map(async (product) => {
          const { data: reviews } = await supabase
            .from('it_info_reviews')
            .select('rating')
            .eq('product_id', product.product_id);
          const avgRating = reviews && reviews.length > 0
            ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
            : 0;
          return { ...product, avgRating, reviewCount: reviews ? reviews.length : 0 };
        })
      );
      productsWithRating.sort((a, b) => b.avgRating - a.avgRating);
      setTopProducts(productsWithRating);
    }
  };

  const fetchLatestReviews = async () => {
    const { data } = await supabase
      .from('it_info_reviews')
      .select('review_id, rating, content, pros, created_at, it_info_users(name), it_info_products(name)')
      .order('created_at', { ascending: false })
      .limit(3);
    if (data) setLatestReviews(data);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ko-KR');
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString('ko-KR') + '원';
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* 히어로 섹션 */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 4, md: 6 },
          px: 2,
          textAlign: 'center',
          mb: { xs: 3, md: 5 },
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '1.8rem', md: '3rem' },
            }}
          >
            IT Info
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              opacity: 0.9,
              fontSize: { xs: '0.9rem', md: '1.2rem' },
            }}
          >
            전자기기 정보 교류 커뮤니티
          </Typography>
          <TextField
            fullWidth
            placeholder="제품명, 브랜드를 검색하세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{
              maxWidth: 500,
              bgcolor: 'white',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Button onClick={handleSearch} sx={{ minWidth: 'auto' }}>
                      <SearchIcon />
                    </Button>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* 카테고리 빠른 이동 */}
        <Box sx={{ mb: { xs: 3, md: 5 } }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            카테고리
          </Typography>
          <Grid container spacing={2}>
            {categories.map((cat) => (
              <Grid key={cat.value} size={{ xs: 6, sm: 3 }}>
                <Card
                  sx={{
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}
                >
                  <CardActionArea
                    onClick={() => navigate(`/products?category=${cat.value}`)}
                    sx={{ py: 3 }}
                  >
                    <Box sx={{ color: 'primary.main', mb: 1, fontSize: '2.5rem' }}>
                      {cat.icon}
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {cat.label}
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Grid container spacing={{ xs: 3, md: 4 }}>
          {/* 공지사항 */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AnnouncementIcon sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    공지사항
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {notices.map((notice) => (
                  <Box
                    key={notice.post_id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                      px: 1,
                      borderRadius: 1,
                    }}
                    onClick={() => navigate(`/notices/${notice.post_id}`)}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1,
                        mr: 2,
                      }}
                    >
                      {notice.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', flexShrink: 0 }}>
                      {formatDate(notice.created_at)}
                    </Typography>
                  </Box>
                ))}
                <Button
                  size="small"
                  onClick={() => navigate('/notices')}
                  sx={{ mt: 1 }}
                >
                  전체보기
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* 인기 게시글 */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUpIcon sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    인기 게시글
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {popularPosts.map((post) => (
                  <Box
                    key={post.post_id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                      px: 1,
                      borderRadius: 1,
                    }}
                    onClick={() => navigate(`/community/${post.post_id}`)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, overflow: 'hidden', mr: 1 }}>
                      <Chip
                        label={post.board_type}
                        size="small"
                        sx={{ mr: 1, flexShrink: 0, fontSize: '0.7rem' }}
                        color="primary"
                        variant="outlined"
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {post.title}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                      <ThumbUpIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {post.likes}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                <Button
                  size="small"
                  onClick={() => navigate('/community')}
                  sx={{ mt: 1 }}
                >
                  전체보기
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 제품 순위 */}
        <Box sx={{ mt: { xs: 3, md: 5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <StarIcon sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              제품 순위
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {topProducts.map((product, index) => (
              <Grid key={product.product_id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  sx={{
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}
                >
                  <CardActionArea
                    onClick={() => navigate(`/products/${product.product_id}`)}
                  >
                    <Box
                      sx={{
                        height: 180,
                        bgcolor: 'grey.100',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      <Box
                        component="img"
                        src={product.image_url}
                        alt={product.name}
                        sx={{
                          maxHeight: '100%',
                          maxWidth: '100%',
                          objectFit: 'contain',
                        }}
                      />
                      <Chip
                        label={`${index + 1}위`}
                        color="primary"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          fontWeight: 700,
                        }}
                      />
                    </Box>
                    <CardContent>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {product.brand} · {product.category}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {product.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <Rating
                          value={product.avgRating}
                          precision={0.1}
                          size="small"
                          readOnly
                        />
                        <Typography variant="body2" sx={{ ml: 0.5, color: 'text.secondary' }}>
                          {product.avgRating.toFixed(1)} ({product.reviewCount})
                        </Typography>
                      </Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ mt: 1, color: 'primary.dark', fontWeight: 600 }}
                      >
                        {formatPrice(product.price)}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* 최신 리뷰 */}
        <Box sx={{ mt: { xs: 3, md: 5 }, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            최신 리뷰
          </Typography>
          <Grid container spacing={2}>
            {latestReviews.map((review) => (
              <Grid key={review.review_id} size={{ xs: 12, md: 4 }}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={Number(review.rating)} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {Number(review.rating).toFixed(1)}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle2" sx={{ color: 'primary.main', mb: 1 }}>
                      {review.it_info_products?.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {review.pros || review.content}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                      {review.it_info_users?.name} · {formatDate(review.created_at)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default HomePage;
