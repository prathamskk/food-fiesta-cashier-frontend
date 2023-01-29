import React, { useState } from "react";
import { Suspense, useLayoutEffect } from "react";
import { Outlet } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import {
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
  Popover
} from "@mui/material";
import EMobiledataIcon from "@mui/icons-material/EMobiledata";

import { Stack } from "@mui/system";
const SharedLayout = () => {
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);
  const handleClick = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="logo"
          >
            <EMobiledataIcon />
          </IconButton> */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Cashier App
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button id="profile-button" onClick={handleClick}>
              <Avatar>H</Avatar>
            </Button>
          </Stack>
          <Menu
            id="profile-menu"
            anchorEl={anchor}
            open={open}
            onClose={handleClose}
          >
            <MenuItem>Logout</MenuItem>
          </Menu>
          <Popover
          anchorEl={anchor}
          open={open}
          onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            The content of the Popover.
          </Popover>
        </Toolbar>
      </AppBar>
      <Suspense fallback={<LoadingScreen />}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default SharedLayout;
