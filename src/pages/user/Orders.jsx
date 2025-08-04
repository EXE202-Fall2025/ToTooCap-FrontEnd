import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Paper,
  Chip,
  Checkbox,
  Stack,
} from "@mui/material";
import Sidebar from "../../components/Sidebar";
import SearchIcon from "@mui/icons-material/Search";

const statusFilters = ["All", "Processing", "Completed", "Cancelled"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [userId, setUserId] = useState("");
  const [productNames, setProductNames] = useState({}); // Map prouct_id -> productName
  const [productInfo, setProductInfo] = useState({}); // Map product_id -> product object

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus, userId]);

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams({
        currentPage: 1,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      if (userId.trim()) {
        params.append("userId", userId);
      }

      const response = await fetch(
        `http://54.169.159.141:3000/order/orderItem/get?${params.toString()}`
      );
      const data = await response.json();
      console.log("Fetched orders:", data);
      if (data.success) {
        const orderItems = data.data;
        setOrders(orderItems);

        for (const item of orderItems) {
          if (item.prouct_id) {
            fetchProductInfo(item.prouct_id);
          }
        }
      }
    } catch (error) {
      console.error("Fetch order items failed:", error);
    }
  };

  const fetchProductInfo = async (productId) => {
    if (!productId || productInfo[productId]) return;

    try {
      const response = await fetch(
        `http://54.169.159.141:3000/product/get/${productId}`
      );
      const data = await response.json();
      if (data.success) {
        setProductInfo((prev) => ({
          ...prev,
          [productId]: {
            name: data.data.name,
            description: data.data.description,
            price: data.data.price,
            image_url: data.data.image_url,
          },
        }));
      }
    } catch (error) {
      console.error(`Failed to fetch product ${productId}:`, error);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Orders
        </Typography>

        {/* Search & UserID Filter */}
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <SearchIcon />
          <TextField
            placeholder="Search by order number, shipping address, or total amount"
            variant="standard"
            fullWidth
          />
          <TextField
            label="User ID"
            variant="outlined"
            size="small"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </Box>

        {/* Status filters */}
        <Stack direction="row" spacing={1} mb={2}>
          {statusFilters.map((status) => (
            <Chip
              key={status}
              label={status}
              clickable
              variant={selectedStatus === status ? "filled" : "outlined"}
              color="default"
              onClick={() => setSelectedStatus(status)}
              sx={{
                backgroundColor:
                  selectedStatus === status ? "#3b3a28" : undefined,
                color: selectedStatus === status ? "white" : "black",
                borderRadius: "6px",
                fontSize: "1rem",
                padding: "8px 16px",
                height: "40px",
              }}
            />
          ))}
        </Stack>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Order ID</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Image</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order, index) => (
                <TableRow
                  key={order._id}
                  sx={{
                    backgroundColor: index % 2 === 1 ? "#f5f5f5" : "white",
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>

                  {/* Product Name */}
                  <TableCell>
                    {productInfo[order.prouct_id]?.name || "Loading..."}
                  </TableCell>

                  {/* Description */}
                  <TableCell>
                    {productInfo[order.prouct_id]?.description || "Loading..."}
                  </TableCell>

                  {/* Quantity */}
                  <TableCell>{order.quantity}</TableCell>

                  {/* Price */}
                  <TableCell>
                    {productInfo[order.prouct_id]?.price != null
                      ? `$${productInfo[order.prouct_id].price}`
                      : "Loading..."}
                  </TableCell>

                  {/* Image URL (Hiển thị hình ảnh) */}
                  <TableCell>
                    {productInfo[order.prouct_id]?.image_url ? (
                      <img
                        src={productInfo[order.prouct_id].image_url}
                        alt="product"
                        width={60}
                        height={60}
                        style={{ objectFit: "cover", borderRadius: "4px" }}
                      />
                    ) : (
                      "Loading..."
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
