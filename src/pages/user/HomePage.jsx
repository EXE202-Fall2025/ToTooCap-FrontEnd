import React from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import logohome from "../../assets/logohome.png"; // Adjust the path as necessary
const HomePage = () => {
  const navigate = useNavigate();
  const handleProductDetail = (id) => {
    navigate(`/product-detail/${id}`);
  };
  const handleCreateProduct = () => {
    navigate("/choose-product");
  };
  const trendingProducts = [
    {
      name: "Mũ Teddy - Phong cách trẻ trung",
      price: "250.000 VND",
      image:
        "https://nonson.vn/vnt_upload/product/10_2024/MC024A-DN1-MOI/thumbs/600_crop_nonson_2.png",
      status: "Mua ngay!",
    },
    {
      name: "Mũ Teddy - Phong cách trẻ trung",
      price: "250.000 VND",
      image:
        "https://nonson.vn/vnt_upload/product/10_2024/MC024A-DN1-MOI/thumbs/600_crop_nonson_2.png",
      status: "Mua ngay!",
    },
    {
      name: "Mũ Teddy - Phong cách trẻ trung",
      price: "250.000 VND",
      image:
        "https://nonson.vn/vnt_upload/product/10_2024/MC024A-DN1-MOI/thumbs/600_crop_nonson_2.png",
      status: "Mua ngay!",
    },
  ];

  return (
    <Box display="flex" minHeight="100vh" bgcolor="#f5f5f5">
      <Sidebar />

      <Box flex={1} p={4}>
        {/* Hero Section */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          bgcolor="#202020"
          color="white"
          borderRadius={2}
          p={4}
          mb={4}
        >
          <Box maxWidth="50%">
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Tạo sản phẩm đầu tiên của bạn
            </Typography>
            <Typography variant="body1" mb={3}>
              Chọn một sản phẩm, thêm thiết kế của bạn và xem việc tạo và xuất
              bản dễ dàng như thế nào với ToTooCap
            </Typography>
            <Button
              onClick={handleCreateProduct}
              variant="contained"
              sx={{ bgcolor: "#a4f35f", color: "#000", fontWeight: "bold" }}
            >
              Tạo sản phẩm
            </Button>
          </Box>
          <Box>
            <img
              src={logohome}
              alt="Buy Illustration"
              style={{ width: 120, height: 120, objectFit: "contain" }}
            />
          </Box>
        </Box>

        {/* Trending Products Section */}
        <Box flex={1} p={4} maxWidth="100%">
          <Typography variant="h6" fontWeight="bold" mb={3}>
            Biến ý tưởng thành hiện thực ngay hôm nay!
          </Typography>

          <Grid container spacing={3}>
            {trendingProducts.map((product, index) => (
              <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
                <Card
                  onClick={() => handleProductDetail(index + 1)}
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    maxWidth: 300,
                    margin: "0 auto",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.name}
                  />
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      fontWeight="medium"
                      gutterBottom
                    >
                      {product.name}
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" gutterBottom>
                      Giá: {product.price}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {product.status}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box textAlign="center">
            <Button variant="text" sx={{ textDecoration: "underline" }}>
              Xem thêm
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
