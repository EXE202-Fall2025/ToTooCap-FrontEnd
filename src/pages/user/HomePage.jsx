import React, { useEffect, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import logohome from "../../assets/logohome.png";

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleProductDetail = (id) => {
    navigate(`/product-detail/${id}`);
  };

  const handleCreateProduct = () => {
    navigate("/choose-product");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const queryParams = new URLSearchParams({
          currentPage: 1,
          limit: 6,
          sortBy: "createdAt",
          sortOrder: "desc",
        });

        const res = await fetch(
          `http://54.169.159.141:3000/product/get?${queryParams}`
        );

        const result = await res.json();

        if (res.ok && result.success) {
          setProducts(result.data || []);
        } else {
          alert("Failed to fetch products");
        }
      } catch (err) {
        console.error("Fetch product error:", err);
        alert("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

        {/* Product List Section */}
        <Box flex={1} p={4} maxWidth="100%">
          <Typography variant="h6" fontWeight="bold" mb={3}>
            Biến ý tưởng thành hiện thực ngay hôm nay!
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={4} key={product._id}>
                  <Card
                    onClick={() => handleProductDetail(product._id)}
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: 2,
                      maxWidth: 300,
                      margin: "0 auto",
                      cursor: "pointer",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image="https://zerdio.com.vn/wp-content/uploads/2021/03/M22.jpg"
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
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        gutterBottom
                      >
                        Giá: {product.price} VND
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Kho: {product.stock_quantity}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          <Box textAlign="center" mt={4}>
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
