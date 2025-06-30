import React from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Divider,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BalanceIcon from '@mui/icons-material/Balance';
import CircleIcon from '@mui/icons-material/Circle';
import Rating from '@mui/material/Rating';
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from '../../components/Sidebar';

export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleAddToCart = () => {
    console.log("Product added to cart");
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Card sx={{ p: 4, borderRadius: 3 }}>
          <Grid container spacing={4} alignItems="center">
            {/* Product Image */}
            <Grid item xs={12} md={5}>
              <CardMedia
                component="img"
                image="https://nonson.vn/vnt_upload/product/NON_KET/MC001/DN1/thumbs/600_crop_nonson_06.png"
                alt="Baseball cap"
                sx={{ width: '100%', objectFit: 'contain' }}
              />
            </Grid>

            {/* Product Info */}
            <Grid item xs={12} md={7}>
              <Chip
                label="Free shipping"
                color="primary"
                size="small"
                sx={{ mb: 2, fontWeight: 'bold', backgroundColor: '#1e1e54' }}
              />

              <Typography variant="h5" fontWeight="bold" mb={1}>
                Baseball cap with minimalist style
              </Typography>

              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <Typography variant="body1" sx={{ textDecoration: 'line-through', color: 'gray' }}>
                  200,000
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  170,000
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" mb={3}>
                The offer is valid until April 3 or as long as stock lasts!
              </Typography>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleAddToCart}
                sx={{
                  backgroundColor: '#3b82f6',
                  color: '#fff',
                  fontWeight: 'bold',
                  py: 1.5,
                  borderRadius: '8px',
                  boxShadow: '0 4px 0 #1d4ed8',
                  mb: 2,
                }}
              >
                Add to cart
              </Button>

              <Box display="flex" alignItems="center" gap={1} mb={3}>
                <CircleIcon fontSize="small" sx={{ color: 'green' }} />
                <Typography variant="body2" fontWeight="medium">
                  50+ pcs. in stock.
                </Typography>
              </Box>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<BalanceIcon />}
                  sx={{
                    textTransform: 'none',
                    px: 3,
                    py: 1,
                    borderRadius: '10px',
                    fontWeight: '500',
                  }}
                >
                  Add to cart
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FavoriteBorderIcon />}
                  sx={{
                    textTransform: 'none',
                    px: 3,
                    py: 1,
                    borderRadius: '10px',
                    fontWeight: '500',
                  }}
                >
                  Add to wishlist
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Card>

        {/* Description & Reviews */}
        <Box mt={4}>
          {/* Product Description */}
          <Box mb={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Product Description
            </Typography>
            <Typography variant="body1">
              This minimalist-style baseball cap is crafted from high-quality materials, offering comfort and durability.
              Perfect for everyday wear, outdoor activities, or adding a casual touch to your outfit.
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Customer Reviews */}
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Customer Reviews
            </Typography>

            {[1, 2].map((i) => (
              <Box key={i} display="flex" gap={2} mb={3}>
                <Avatar alt={`Customer ${i}`} />
                <Box>
                  <Typography fontWeight="bold">Customer {i}</Typography>
                  <Rating value={4} readOnly size="small" />
                  <Typography variant="body2" mt={0.5}>
                    Really liked the quality and delivery was fast. Would recommend!
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    April 2025
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
