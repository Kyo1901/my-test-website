import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Rating from '@mui/material/Rating';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import InventoryIcon from '@mui/icons-material/Inventory';
import supabase from '../utils/supabase-client.js';

const categoryMenu = [
  { label: '전체', value: '전체' },
  { label: '스마트폰', value: '스마트폰', sub: ['전체', '안드로이드', '아이폰', '게이밍폰'] },
  { label: '노트북', value: '노트북', sub: ['전체', '게이밍', '울트라북', '비즈니스'] },
  { label: '웨어러블', value: '웨어러블', sub: ['전체', '이어폰', '스마트워치'] },
  { label: '가전', value: '가전', sub: ['전체'] },
];

const sortOptions = [
  { label: '별점순', value: 'rating' },
  { label: '가격 낮은순', value: 'price_asc' },
  { label: '가격 높은순', value: 'price_desc' },
  { label: '출시일순', value: 'release' },
];

/**
 * ProductListPage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <ProductListPage />
 */
function ProductListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const initialCategory = searchParams.get('category') || '전체';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubCategory, setSelectedSubCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedSubCategory, sortBy]);

  useEffect(() => {
    if (initialSearch) {
      fetchProducts();
    }
  }, []);

  const fetchProducts = async () => {
    let query = supabase
      .from('it_info_products')
      .select('*');

    if (selectedCategory !== '전체') {
      query = query.eq('category', selectedCategory);
    }
    if (selectedSubCategory !== '전체') {
      query = query.eq('sub_category', selectedSubCategory);
    }
    if (searchQuery.trim()) {
      query = query.or(`name.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%`);
    }

    if (sortBy === 'price_asc') {
      query = query.order('price', { ascending: true });
    } else if (sortBy === 'price_desc') {
      query = query.order('price', { ascending: false });
    } else if (sortBy === 'release') {
      query = query.order('release_date', { ascending: false });
    }

    const { data } = await query;

    if (data) {
      const productsWithRating = await Promise.all(
        data.map(async (product) => {
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

      if (sortBy === 'rating') {
        productsWithRating.sort((a, b) => b.avgRating - a.avgRating);
      }

      setProducts(productsWithRating);
    }
  };

  const handleSearch = () => {
    fetchProducts();
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubCategory('전체');
  };

  const currentCategory = categoryMenu.find((c) => c.value === selectedCategory);

  const formatPrice = (price) => {
    return Number(price).toLocaleString('ko-KR') + '원';
  };

  return (
    <Box sx={{ width: '100%', py: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <InventoryIcon sx={{ color: 'primary.main', mr: 1, fontSize: '2rem' }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            제품 정보
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* 사이드바 카테고리 */}
          {!isMobile && (
            <Grid size={{ md: 3 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  카테고리
                </Typography>
                <List dense>
                  {categoryMenu.map((cat) => (
                    <ListItem key={cat.value} disablePadding>
                      <ListItemButton
                        selected={selectedCategory === cat.value}
                        onClick={() => handleCategoryClick(cat.value)}
                      >
                        <ListItemText primary={cat.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>

                {currentCategory?.sub && (
                  <>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                      세부 카테고리
                    </Typography>
                    <List dense>
                      {currentCategory.sub.map((sub) => (
                        <ListItem key={sub} disablePadding>
                          <ListItemButton
                            selected={selectedSubCategory === sub}
                            onClick={() => setSelectedSubCategory(sub)}
                          >
                            <ListItemText primary={sub} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </Paper>
            </Grid>
          )}

          {/* 메인 콘텐츠 */}
          <Grid size={{ xs: 12, md: 9 }}>
            {/* 모바일 카테고리 칩 */}
            {isMobile && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {categoryMenu.map((cat) => (
                  <Chip
                    key={cat.value}
                    label={cat.label}
                    onClick={() => handleCategoryClick(cat.value)}
                    color={selectedCategory === cat.value ? 'primary' : 'default'}
                    variant={selectedCategory === cat.value ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            )}

            {/* 검색 및 정렬 */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                fullWidth
                size="small"
                placeholder="제품명, 브랜드 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon
                          sx={{ cursor: 'pointer' }}
                          onClick={handleSearch}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                select
                size="small"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                sx={{ minWidth: 140 }}
              >
                {sortOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </TextField>
            </Box>

            {/* 제품 목록 */}
            {products.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  해당하는 제품이 없습니다.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {products.map((product) => (
                  <Grid key={product.product_id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card
                      sx={{
                        height: '100%',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-4px)' },
                      }}
                    >
                      <CardActionArea
                        onClick={() => navigate(`/products/${product.product_id}`)}
                        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                      >
                        <Box
                          sx={{
                            height: 180,
                            bgcolor: 'grey.100',
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
                              maxHeight: '100%',
                              maxWidth: '100%',
                              objectFit: 'contain',
                            }}
                          />
                        </Box>
                        <CardContent sx={{ flex: 1 }}>
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
                          {product.release_date && (
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                              출시일: {new Date(product.release_date).toLocaleDateString('ko-KR')}
                            </Typography>
                          )}
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
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ProductListPage;
