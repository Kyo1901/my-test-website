import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import supabase from '../utils/supabase-client.js';

/**
 * ProductDetailPage 컴포넌트
 *
 * Props: 없음 (URL 파라미터로 productId 사용)
 *
 * Example usage:
 * <ProductDetailPage />
 */
function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [likedReviews, setLikedReviews] = useState(new Set());
  const [newReview, setNewReview] = useState({
    rating: 5,
    pros: '',
    cons: '',
    content: '',
  });

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [productId]);

  const fetchProduct = async () => {
    const { data } = await supabase
      .from('it_info_products')
      .select('*')
      .eq('product_id', productId)
      .single();
    if (data) setProduct(data);
  };

  const fetchReviews = async () => {
    const { data } = await supabase
      .from('it_info_reviews')
      .select('*, it_info_users(name)')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    if (data) {
      setReviews(data);
      if (data.length > 0) {
        const avg = data.reduce((sum, r) => sum + Number(r.rating), 0) / data.length;
        setAvgRating(avg);
      }
    }
  };

  const handleSubmitReview = async () => {
    if (!newReview.content.trim()) return;
    await supabase
      .from('it_info_reviews')
      .insert([{
        product_id: Number(productId),
        user_id: 2,
        rating: newReview.rating,
        pros: newReview.pros,
        cons: newReview.cons,
        content: newReview.content,
      }]);
    setNewReview({ rating: 5, pros: '', cons: '', content: '' });
    fetchReviews();
  };

  const handleLikeReview = async (reviewId, currentLikes) => {
    const alreadyLiked = likedReviews.has(reviewId);
    const newLikes = alreadyLiked ? currentLikes - 1 : currentLikes + 1;
    await supabase
      .from('it_info_reviews')
      .update({ likes: newLikes })
      .eq('review_id', reviewId);
    setLikedReviews((prev) => {
      const next = new Set(prev);
      if (alreadyLiked) {
        next.delete(reviewId);
      } else {
        next.add(reviewId);
      }
      return next;
    });
    fetchReviews();
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ko-KR');
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString('ko-KR') + '원';
  };

  if (!product) {
    return (
      <Box sx={{ width: '100%', py: 4 }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            로딩 중...
          </Typography>
        </Container>
      </Box>
    );
  }

  const specs = product.specs || {};

  return (
    <Box sx={{ width: '100%', py: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/products')}
          sx={{ mb: 2 }}
        >
          목록으로
        </Button>

        {/* 제품 정보 */}
        <Paper sx={{ p: { xs: 2, md: 4 }, mb: 3 }}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  height: { xs: 250, md: 350 },
                  bgcolor: 'grey.100',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  component="img"
                  src={product.image_url}
                  alt={product.name}
                  sx={{
                    maxHeight: '90%',
                    maxWidth: '90%',
                    objectFit: 'contain',
                  }}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Chip label={product.category} size="small" color="primary" />
                {product.sub_category && (
                  <Chip label={product.sub_category} size="small" variant="outlined" />
                )}
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                {product.name}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 2 }}>
                {product.brand}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={avgRating} precision={0.1} readOnly />
                <Typography variant="body1" sx={{ ml: 1, fontWeight: 600 }}>
                  {avgRating.toFixed(1)}
                </Typography>
                <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                  ({reviews.length}개 리뷰)
                </Typography>
              </Box>

              <Typography variant="h5" sx={{ color: 'primary.dark', fontWeight: 700, mb: 2 }}>
                {formatPrice(product.price)}
              </Typography>

              {product.release_date && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  출시일: {formatDate(product.release_date)}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Paper>

        {/* 상세 스펙 테이블 */}
        <Paper sx={{ p: { xs: 2, md: 4 }, mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            상세 스펙
          </Typography>
          <TableContainer>
            <Table>
              <TableBody>
                {Object.entries(specs).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        bgcolor: 'grey.50',
                        width: { xs: 100, md: 150 },
                      }}
                    >
                      {key}
                    </TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* 리뷰 요약 */}
        <Paper sx={{ p: { xs: 2, md: 4 }, mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            리뷰 요약
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {avgRating.toFixed(1)}
              </Typography>
              <Rating value={avgRating} precision={0.1} readOnly size="large" />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {reviews.length}개 리뷰
              </Typography>
            </Box>
          </Box>

          {/* 최신 리뷰 2~3개 */}
          {reviews.slice(0, 3).map((review) => (
            <Card key={review.review_id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating value={Number(review.rating)} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {Number(review.rating).toFixed(1)}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {review.it_info_users?.name} · {formatDate(review.created_at)}
                  </Typography>
                </Box>
                {review.pros && (
                  <Typography variant="body2" sx={{ color: 'success.main', mb: 0.5 }}>
                    장점: {review.pros}
                  </Typography>
                )}
                {review.cons && (
                  <Typography variant="body2" sx={{ color: 'error.main', mb: 0.5 }}>
                    단점: {review.cons}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {review.content}
                </Typography>
                <Button
                  size="small"
                  variant={likedReviews.has(review.review_id) ? 'contained' : 'outlined'}
                  startIcon={likedReviews.has(review.review_id) ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                  onClick={() => handleLikeReview(review.review_id, review.likes || 0)}
                >
                  추천 ({review.likes || 0})
                </Button>
              </CardContent>
            </Card>
          ))}
        </Paper>

        {/* 리뷰 작성 */}
        <Paper sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            리뷰 작성
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>별점</Typography>
            <Rating
              value={newReview.rating}
              onChange={(e, v) => setNewReview({ ...newReview, rating: v })}
              size="large"
            />
          </Box>
          <TextField
            fullWidth
            label="장점"
            size="small"
            value={newReview.pros}
            onChange={(e) => setNewReview({ ...newReview, pros: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="단점"
            size="small"
            value={newReview.cons}
            onChange={(e) => setNewReview({ ...newReview, cons: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="리뷰 내용"
            multiline
            rows={4}
            value={newReview.content}
            onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleSubmitReview}>
            리뷰 등록
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

export default ProductDetailPage;
