import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import Sidebar from '../../components/Sidebar';
const mockProducts = Array(6).fill({
  name: 'Product Name',
  description: 'Description',
  size: 'Size',
  status: 'Status',
  inventory: 'In Stock',
});

export default function MyProducts() {
  return (
   <Box sx={{ display: 'flex' }}>
  <Sidebar />
  <Box sx={{ flexGrow: 1, p: 3 }}>
    <Typography variant="h5" fontWeight="bold" mb={2}>
      My Products
    </Typography>

    {/* Search Row */}
    <Box mb={2} maxWidth={300}>
      <TextField label="Search" variant="outlined" size="small"    sx={{ width: 960 }} />
    </Box>

    {/* Filter Select Row */}
    <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Print Provider</InputLabel>
        <Select label="Print Provider">
          <MenuItem value="">All</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Brand</InputLabel>
        <Select label="Brand">
          <MenuItem value="">All</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Status</InputLabel>
        <Select label="Status">
          <MenuItem value="">All</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Delivery Options</InputLabel>
        <Select label="Delivery Options">
          <MenuItem value="">All</MenuItem>
        </Select>
      </FormControl>
       <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Recently Updated</InputLabel>
        <Select label="Delivery Options">
          <MenuItem value="">All</MenuItem>
        </Select>
      </FormControl>
    </Box>

    {/* Product Table */}
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox />
            </TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Inventory</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mockProducts.map((product, index) => (
            <TableRow key={index}>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: '#ccc',
                      borderRadius: 1,
                    }}
                  />
                  <Box>
                    <Typography fontWeight="bold">{product.name}</Typography>
                    <Typography variant="body2">{product.description}</Typography>
                    <Typography variant="body2">{product.size}</Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>{product.inventory}</TableCell>
              <TableCell>{product.status}</TableCell>
              <TableCell align="right">
                <IconButton>
                  <EditIcon />
                </IconButton>
                <IconButton>
                  <ShareIcon />
                </IconButton>
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
