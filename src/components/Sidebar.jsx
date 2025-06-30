import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Box,
} from "@mui/material";

import {
  Home,
  Notifications,
  Inventory,
  LocalOffer,
  LocalShipping,
  Favorite,
  EmojiEvents,
  HelpOutline,
  AccountCircle,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";

import NotificationModal from "../pages/user/NotificationModal";

const drawerWidth = 240;

const Sidebar = () => {
  const [openNotification, setOpenNotification] = useState(false);
  const [openCatalog, setOpenCatalog] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);

  const navigate = useNavigate();

  const handleDashboardClick = () => {
    navigate("/");
  };
  const handleAccountClick = () => {
    navigate("/login");
  };
  const handleMyProductsClick = () => {
    navigate("/my-products");
  };
  const handleBrandingClick = () => {
    navigate("/branding-gift");
  };
  const handleOrdersClick = () => {
    navigate("/orders");
  };
  const handlePremiumClick = () => {
    navigate("/premium");
  };
  const handleNotificationsClick = () => {
    setOpenNotification(true);
  };

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#d9d6c9",
            paddingTop: 2,
          },
        }}
      >
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", fontFamily: "serif", fontSize: "35px" }}
          >
            ToTooCap
          </Typography>
          <Typography variant="body2">My new store ▾</Typography>
        </Box>

        <List>
          <ListItem button onClick={handleDashboardClick}>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>

          <ListItem button onClick={handleNotificationsClick}>
            <ListItemIcon>
              <Notifications />
            </ListItemIcon>
            <ListItemText primary="Notifications" />
          </ListItem>

          <ListItem button onClick={() => setOpenCatalog(!openCatalog)}>
            <ListItemIcon>
              <Inventory />
            </ListItemIcon>
            <ListItemText primary="Catalog" />
            {openCatalog ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openCatalog} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {/* Add catalog sub-items here if needed */}
            </List>
          </Collapse>

          <ListItem button onClick={handleMyProductsClick}>
            <ListItemIcon>
              <LocalOffer />
            </ListItemIcon>
            <ListItemText primary="My products" />
          </ListItem>

          <ListItem button onClick={handleOrdersClick}>
            <ListItemIcon>
              <LocalShipping />
            </ListItemIcon>
            <ListItemText primary="Orders" />
          </ListItem>

          <ListItem button onClick={handleBrandingClick}>
            <ListItemIcon>
              <Favorite />
            </ListItemIcon>
            <ListItemText primary="Branding" />
          </ListItem>

          <ListItem button onClick={handlePremiumClick}>
            <ListItemIcon>
              <EmojiEvents />
            </ListItemIcon>
            <ListItemText primary="Printify Premium" />
          </ListItem>

          <ListItem button onClick={() => setOpenHelp(!openHelp)}>
            <ListItemIcon>
              <HelpOutline />
            </ListItemIcon>
            <ListItemText primary="Need help?" />
            {openHelp ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={openHelp} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {/* Nested help items */}
            </List>
          </Collapse>
        </List>

        <Box sx={{ mt: "auto", p: 2 }}>
          <ListItem button onClick={handleAccountClick}>
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText primary="Account" secondary="Login/Register" />
          </ListItem>
        </Box>
      </Drawer>

      {/* ✅ Modal placed here */}
      <NotificationModal
        open={openNotification}
        onClose={() => setOpenNotification(false)}
      />
    </>
  );
};

export default Sidebar;
