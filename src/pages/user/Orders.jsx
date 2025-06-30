import React from 'react';
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
} from '@mui/material';
import Sidebar from '../../components/Sidebar';
import SearchIcon from '@mui/icons-material/Search';

const mockOrders = Array(5).fill({
  order: 'Product name',
  customer: 'Nguyen Van A',
  cost: '100,000 VND',
  note: 'Size XL',
  status: 'On Hold',
});

const statusFilters = ['All', 'On Hold', 'In Production', 'Shipping'];

export default function Orders() {
  const [selectedStatus, setSelectedStatus] = React.useState('All');

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Orders
        </Typography>

        {/* Search bar */}
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <SearchIcon />
          <TextField
            placeholder="Search by order number, customer, or product name"
            variant="standard"
            fullWidth
          />
        </Box>

        {/* Status filters */}
        <Stack direction="row" spacing={1} mb={2}>
          {statusFilters.map((status) => (
            <Chip
              key={status}
              label={status}
              clickable
              variant={selectedStatus === status ? 'filled' : 'outlined'}
              color="default"
              onClick={() => setSelectedStatus(status)}
              sx={{
                backgroundColor: selectedStatus === status ? '#3b3a28' : undefined,
                color: selectedStatus === status ? 'white' : 'black',
                borderRadius: '6px',
                  fontSize: '1rem',   
                   padding: '8px 16px',    
                   height: '40px',        
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
                <TableCell>Order</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Total Cost</TableCell>
                <TableCell>Note</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockOrders.map((order, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: index % 2 === 1 ? '#f5f5f5' : 'white',
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>
                  <TableCell>{order.order}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.cost}</TableCell>
                  <TableCell>{order.note}</TableCell>
                  <TableCell>{order.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
