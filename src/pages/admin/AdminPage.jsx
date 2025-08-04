import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider
} from '@mui/material';
import {
  ShoppingCart,
  AttachMoney,
  People,
  Settings,
  MoreVert
} from '@mui/icons-material';

// Import custom components
import MetricCard from '../../components/admin/MetricCard';
import AdminLineChart from '../../components/admin/LineChart';
import AdminBarChart from '../../components/admin/BarChart';
import AdminDataTable from '../../components/admin/DataTable';

// Import admin styles
import '../../assets/admin.css';

const AdminPage = () => {
  // Sample data for recent activities
  const recentActivities = [
    {
      id: 1,
      title: 'New order received',
      subtitle: 'Order #12345 from John Doe',
      time: '2 minutes ago',
      icon: <ShoppingCart />,
      color: 'primary'
    },
    {
      id: 2,
      title: 'Payment processed',
      subtitle: '$125.50 received',
      time: '15 minutes ago',
      icon: <AttachMoney />,
      color: 'success'
    },
    {
      id: 3,
      title: 'New user registered',
      subtitle: 'Jane Smith joined',
      time: '1 hour ago',
      icon: <People />,
      color: 'info'
    },
    {
      id: 4,
      title: 'System notification',
      subtitle: 'Server maintenance scheduled',
      time: '2 hours ago',
      icon: <Settings />,
      color: 'warning'
    }
  ];

  return (
    <Box sx={{ p: 4, width: '100%', maxWidth: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="600" gutterBottom sx={{ color: '#333' }}>
          Dashboard
        </Typography>
      </Box>

      {/* Metrics Cards - Full width layout */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title="Total Page Views"
            value="4,42,236"
            change="59.3"
            changeType="increase"
            subtitle="vs last month"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title="Total Users"
            value="78,250"
            change="70.5"
            changeType="increase"
            subtitle="vs last month"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title="Total Order"
            value="18,800"
            change="27.4"
            changeType="decrease"
            subtitle="vs last month"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title="Total Sales"
            value="35,078"
            change="27.4"
            changeType="decrease"
            subtitle="vs last month"
          />
        </Grid>
      </Grid>

      {/* Charts Section - Full width layout */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} lg={6}>
          <AdminLineChart title="Revenue & Orders Trend" />
        </Grid>
        <Grid item xs={12} lg={6}>
          <AdminBarChart title="Monthly Performance" />
        </Grid>
      </Grid>

      {/* Data Table - Full width */}
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <AdminDataTable title="Recent Orders" />
        </Grid>
      </Grid>

      {/* Recent Activities - Moved to bottom or can be sidebar */}
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Recent Activities
                </Typography>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>
              
              <List sx={{ p: 0 }}>
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem sx={{ px: 0, py: 2 }}>
                      <ListItemAvatar>
                        <Avatar 
                          sx={{ 
                            bgcolor: `${activity.color}.light`,
                            color: `${activity.color}.main`,
                            width: 40,
                            height: 40
                          }}
                        >
                          {activity.icon}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight="medium">
                            {activity.title}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {activity.subtitle}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {activity.time}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminPage;