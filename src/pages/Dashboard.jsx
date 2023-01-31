import React, { useEffect, useState } from "react";
import SwipeableViews from "react-swipeable-views-react-18-fix";
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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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
  const { menuList } = useMenu();
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const { stream } = streamOrders();
    const unsub = stream((orders) => {
      setOrders(orders);
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
      <SearchBar />
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="secondary"
        textColor="inherit"
        variant="fullWidth"
        aria-label="full width tabs example"
      >
        <Tab label="Payment Pending" {...a11yProps(0)} />
        <Tab label="Paid" {...a11yProps(1)} />
        <Tab label="Cancelled" {...a11yProps(2)} />
      </Tabs>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 2, sm: 8, md: 12 }}
          >
            {orders.map((order, index) => {
              console.log(order);
              return (
                <Grid item xs={2} sm={4} md={4} key={index}>
                  <Card sx={{ minWidth: 275 }} variant="outlined">
                    <CardHeader
                      sx={{
                        bgcolor: "primary.main",
                        color: "common.white",
                        textOverflow: "ellipsis",
                      }}
                      title={
                        <Stack
                          justifyContent="flex-start"
                          alignItems="flex-start"
                        >
                          <Container maxWidth={false} disableGutters>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="flex-start"
                            >
                              <Button color="inherit">#{order.order_id}</Button>
                              <Button
                                color="inherit"
                                startIcon={<MoneyOffIcon />}
                              >
                                UNPAID
                              </Button>
                            </Stack>
                          </Container>

                          <Typography variant="body2">
                            {order.user_info.name}
                          </Typography>
                          <Typography variant="caption">
                            {order.user_info.email}
                          </Typography>
                        </Stack>
                      }
                    />
                    <CardContent>
                      <CollapsibleTable />
                      {Object.keys(order.stall_order).map((stallid, index) => {
                        const order_list = order.stall_order[stallid];
                        console.log(order_list);
                        return (
                          <Accordion>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel1a-header"
                            >
                              <Typography>{stallid}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              {Object.keys(order_list.items_ordered).map(
                                (itemid, index) => {
                                  const items_list = order_list.items_ordered;
                                  console.log(items_list);
                                  return (
                                    <Stack>
                                      <Typography>
                                        {items_list[itemid].name}
                                      </Typography>
                                      <Typography>
                                        {items_list[itemid].qty}
                                      </Typography>
                                      <Typography>
                                        {items_list[itemid].price}
                                      </Typography>
                                    </Stack>
                                  );
                                }
                              )}
                            </AccordionDetails>
                          </Accordion>
                        );
                      })}
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                      ></Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small">Learn More</Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          Item Three
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
};

export default Dashboard;
