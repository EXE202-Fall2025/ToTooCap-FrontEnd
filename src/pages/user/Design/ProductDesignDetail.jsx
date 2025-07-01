import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import { useNavigate } from "react-router-dom";
const productMock = {
  id: 1,
  name: "TotooCap",
  tagline: "Sự lựa chọn hoàn hảo",
  description:
    "Teddy Cap mang đến cho bạn một chiếc mũ không chỉ đẹp mà còn bền, thoáng mát, phù hợp cho mọi phong cách. Dù là đi chơi, đi làm hay dạo phố, Teddy Cap luôn là người bạn đồng hành tuyệt vời!",
  image:
    "https://nonson.vn/vnt_upload/product/NON_SNAPBACK/MC210/DN9/nonson_01_1.png",
  price: "250.000 VND",
};

export default function ProductDesignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleDesignClick = () => {
    navigate("/hat-design");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />

      <Box sx={{ flex: 1, p: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            alignItems: "flex-start",
          }}
        >
          {/* Cột trái - ảnh */}
          <Box
            sx={{
              flex: 1,
              border: "1px solid #ccc",
              borderRadius: 2,
              p: 2,
              display: "flex",
              justifyContent: "center",
              maxWidth: { md: "45%" },
            }}
          >
            <img
              src={productMock.image}
              alt={productMock.name}
              style={{
                width: "100%",
                maxHeight: 350,
                objectFit: "contain",
              }}
            />
          </Box>

          {/* Cột phải - nội dung */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              {productMock.name}
              <Typography
                component="span"
                variant="caption"
                sx={{ ml: 1, fontStyle: "italic", color: "#666" }}
              >
                {productMock.tagline}
              </Typography>
            </Typography>

            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ mt: 1, mb: 2, color: "#222" }}
            >
              Chất lượng tốt nhất, phong cách trẻ trung
            </Typography>

            <Typography variant="body1" sx={{ mb: 3 }}>
              {productMock.description}
            </Typography>

            <Typography variant="h6" color="error" fontWeight="bold" mb={2}>
              Giá chỉ từ {productMock.price}
            </Typography>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#444",
                fontWeight: "bold",
                px: 3,
                py: 1,
              }}
                onClick={handleDesignClick}
            >
              Bắt đầu thiết kế ngay!
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
