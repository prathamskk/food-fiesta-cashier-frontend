import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import { useTheme } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import { Box } from "@mui/system";
import {
  Card,
  Typography,
  CardActions,
  CardContent,
  Button,
  Grid,
  Container,
  CardHeader,
  IconButton,
  Stack,
  Popover,
} from "@mui/material";
import SearchBar from "../components/SearchBar";
import { streamOrders, getFirebase } from "../utils/firebaseConfig";
import { query, orderBy, startAt } from "firebase/firestore";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import { useMenu } from "../context/MenuContext";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CollapsibleTable from "../components/OrderTable";
import OrderCard from "../components/OrderCard";
import {
  Avatar,
  AppBar,
  Toolbar,
} from "@mui/material";

import EMobiledataIcon from "@mui/icons-material/EMobiledata";
import { useAuth } from "../context/AuthContext";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: { md: 3 }, py: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Dashboard = () => {
  const { user, handleSignOut } = useAuth();
  const [details, setDetails] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);
  const handleClick = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };
  const [searchValue, setSearchValue] = useState();
  const { menuList } = useMenu();
  const [orders, setOrders] = useState([]);
  const [paidorders, setPaidOrders] = useState([]);
  const [cancelorders, setCancelOrders] = useState([]);
  const [searchOrders, setSearchOrders] = useState([]);

  useEffect(() => {
    if (searchValue?.length !== 6) {
      return;
    }
    const { streamSearch } = streamOrders();

    const unsub = streamSearch(searchValue, (orders) => {
      setSearchOrders(orders);
    });

    return () => unsub();
  }, [searchValue]);

  useEffect(() => {
    const { stream } = streamOrders();
    const unsub = stream((orders) => {
      setOrders(orders);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const { streamPaid } = streamOrders();
    const unsub = streamPaid((orders) => {
      setPaidOrders(orders);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const { streamCancelled } = streamOrders();
    const unsub = streamCancelled((orders) => {
      setCancelOrders(orders);
    });

    return () => unsub();
  }, []);

  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };
  return (
    <Box>
      <AppBar position="sticky">
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
          <SearchBar
            handleChangeIndex={handleChangeIndex}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
          <Stack direction="row" spacing={2}>
            <Button id="profile-button" onClick={handleClick}>
              <Avatar src={user?.photoURL}>{user?.displayName[0]}</Avatar>
            </Button>
          </Stack>
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
            <Card sx={{ maxWidth: 345 }}>
              <CardHeader
                avatar={
                  <Avatar src={user?.photoURL}>{user?.displayName[0]}</Avatar>
                }
                title={user?.displayName}
                subheader={user?.email}
              />
              <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="flex-end"
              >
                <Button onClick={handleSignOut}>Logout</Button>
              </Box>
            </Card>
          </Popover>
        </Toolbar>
      </AppBar>

      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="secondary"
        textColor="inherit"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="full width tabs example"
      >
        <Tab label="Search" {...a11yProps(0)} />
        <Tab label="Payment Pending" {...a11yProps(1)} />
        <Tab label="Paid" {...a11yProps(2)} />
        <Tab label="Cancelled" {...a11yProps(3)} />
      </Tabs>
      <TabPanel value={value} index={0} dir={theme.direction}>
        {searchOrders.map((order, index) => {
          return (
            <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
              <OrderCard order={order} />
            </Grid>
          );
        })}
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <Grid
          container
          spacing={{ xs: 2 }}
          columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
        >
          {orders.map((order, index) => {
            return (
              <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
                <OrderCard order={order} />
              </Grid>
            );
          })}
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        <Grid
          container
          spacing={{ xs: 2 }}
          columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
        >
          {paidorders.map((order, index) => {
            return (
              <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
                <OrderCard order={order} />
              </Grid>
            );
          })}
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={3} dir={theme.direction}>
        <Grid
          container
          spacing={{ xs: 2 }}
          columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
        >
          {cancelorders.map((order, index) => {
            return (
              <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
                <OrderCard order={order} />
              </Grid>
            );
          })}
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default Dashboard;
