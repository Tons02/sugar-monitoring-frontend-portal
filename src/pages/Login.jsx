import React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Snackbar,
  Alert, // MUI Alert component for Snackbar messages
} from "@mui/material";
import { useForm } from "react-hook-form";
import API from "../services/HTTPRequest";
import { Navigate, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const { register, handleSubmit } = useForm();
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "info",
  });
  
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await API.post("/login", data);

      setSnackbar({
        open: true,
        message: "Login successful!",
        severity: "success",
      });
      
      localStorage.setItem("userID", response?.data?.data?.id);
      localStorage.setItem("token", response?.data?.token);
      
      navigate('/dashboard');
      
    } catch (error) {
      console.log(error?.response?.data?.errors?.[0]?.title);

      setSnackbar({
        open: true,
        message:
          error?.response?.data?.errors?.[0]?.title ||
          "Login failed. Please try again.",
        severity: "error",
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full viewport height
        bgcolor: "#f5f5f5", // Optional background color
      }}
    >
      <Container maxWidth="sm">
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)} 
          sx={{
            p: 4,
            borderRadius: 2,
            boxShadow: 3,
            bgcolor: "white",
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Login
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                type="text"
                {...register("username", { required: true })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                {...register("password", { required: true })}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Position Snackbar at the bottom-right
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginForm;
