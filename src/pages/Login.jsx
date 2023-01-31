import React from "react";
import { Box } from "@mui/system";
import GoogleButton from "react-google-button";
import { useAuth } from "../context/AuthContext";
const Login = () => {

  const { handleGoogleLogin, user } = useAuth();
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >

      <GoogleButton
        onClick={() => handleGoogleLogin()}
      />
    </Box>
  )
};

export default Login;
