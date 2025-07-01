import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import Sidebar from "../../../components/Sidebar";

const productList = [
  {
    id: 1,
    name: "Mũ Teddy - Phong cách trẻ trung",
    price: "250.000 VND",
    image:
      "https://www.chapi.vn/img/product/2022/5/15/mu-luoi-trai-theu-classic-27-500x500.jpg",
    large: true,
  },
  {
    id: 2,
    name: "Mũ Teddy - Phong cách trẻ trung",
    price: "250.000 VND",
    image:
      "https://img.vuahanghieu.com/unsafe/0x0/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/news/content/2022/05/mu-luoi-trai-cho-be-1-jpg-1653899522-30052022153202.jpg",
  },
  {
    id: 3,
    name: "Mũ Teddy - Phong cách trẻ trung",
    price: "250.000 VND",
    image:
      "https://product.hstatic.net/200000025394/product/tech_rain.rdy_djen_ib2666_01_standard_98ad23e5cc9e4baeb5d5efa1616a28dd_57e73bb0b8584ce88157b2492ab61bdb_master.jpg",
  },
];

const ChooseProductPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={2}>
          Chọn một sản phẩm
        </Typography>

        {/* Filter chips */}
        <Box display="flex" gap={1} mb={4} flexWrap="wrap">
          <Chip label="Mũ lưỡi trai cổ điển" variant="outlined" />
          <Chip label="Mũ bố" variant="outlined" />
          <Chip label="Mũ lưỡi trai lưới" variant="outlined" />
          <Chip label="Mũ ôm đầu" variant="outlined" />
        </Box>

        {/* Product Layout */}
        <Grid container spacing={3} justifyContent="center">
          {/* Left large image */}
          <Grid item xs={12} md={6} sx={{ mt: 3 }}>
            <Card
              sx={{
                p: 2,
                transform: "scale(1.15)",
                transition: "transform 0.2s",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/product-design/${productList[0].id}`)}
            >
              <CardMedia
                component="img"
                image={productList[0].image}
                alt={productList[0].name}
                sx={{ width: "100%", objectFit: "contain", p: 2, height: 300 }}
              />
              <CardContent sx={{ backgroundColor: "#f5f5f5" }}>
                <Typography>{productList[0].name}</Typography>
                <Typography fontWeight="bold">
                  Giá: {productList[0].price}
                </Typography>
                <Typography>Thiết kế ngay!</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Right 2 smaller images */}
          <Grid item xs={12} md={6} sx={{ mt: 10 }}>
            <Grid container spacing={3}>
              {productList.slice(1).map((product) => (
                <Grid item xs={12} sm={6} key={product.id}>
                  <Card
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate(`/design-detail/${product.id}`)}
                  >
                    <CardMedia
                      component="img"
                      image={product.image}
                      alt={product.name}
                      sx={{
                        width: "100%",
                        objectFit: "contain",
                        p: 2,
                        height: 160,
                      }}
                    />
                    <CardContent sx={{ backgroundColor: "#f5f5f5" }}>
                      <Typography>{product.name}</Typography>
                      <Typography fontWeight="bold">
                        Giá: {product.price}
                      </Typography>
                      <Typography>Thiết kế ngay!</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ChooseProductPage;
