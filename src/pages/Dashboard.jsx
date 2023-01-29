import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { AppBar } from "@mui/material";
import { Box } from "@mui/system";

const Dashboard = () => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <Box>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="inherit"
        variant="fullWidth"
      >
        <Tab label="Item One" id="tab1" />
        <Tab label="Item Two" id="tab2" />
        <Tab label="Item Three" id="tab3" />
      </Tabs>
    </Box>
  );
};

export default Dashboard;
