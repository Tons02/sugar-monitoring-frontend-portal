import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Breadcrumbs, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Snackbar, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { changePasswordSchema } from '../validations/validation';
import { useForm } from 'react-hook-form';
import { useChangePasswordMutation } from '../redux/slices/apiSlice';

const SettingPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    defaultValues: {
      old_password:"",
      new_password:"",
      confirm_password:"",

    },
    resolver: yupResolver(changePasswordSchema),
  });

  const [changePassword] = useChangePasswordMutation();

  function cleanPointer(pointer) {
    return pointer?.replace(/^\//, ""); // Removes the leading '/'
  }

  const handleChangePassword = async (data) => {
    try {
      const response = await changePassword(data).unwrap();
      console.log(response)
      setOpenDialog(false);
      reset()
      setSnackbar({
        open: true,
        message: response?.message,
        severity: "success",
      });
    } catch (error) {
      console.log(error?.data?.errors)
      error?.data?.errors.map((inputError, index) => setError(cleanPointer(inputError?.source?.pointer), { type: 'message', message: inputError?.detail }))
      setSnackbar({
        open: true,
        message: 'Please Double Check your input',
        severity: "error",
      });
    }
  };

  return (
    <>
    <Typography variant="h4" gutterBottom>
    Settings Page
    </Typography>
    <Breadcrumbs aria-label="breadcrumb" sx={{ paddingBottom: 2 }}>
      <Link color="inherit" href="/dashboard">Home</Link>
      <Link color="inherit" href="/dashboard/settings">Settings</Link>
    </Breadcrumbs>
    <Button variant="contained" color="success" onClick={() => setOpenDialog(true)}>
          Change Password
    </Button>
    <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle> Change Password</DialogTitle>
        <form onSubmit={handleSubmit(handleChangePassword)}>
        <Divider />
        <DialogContent>
          <TextField 
            {...register('old_password')} 
            label="Current Password" 
            margin="dense" 
            fullWidth
            error={!!errors.old_password} 
            helperText={errors.old_password?.message} 
          />
          <TextField 
            {...register('new_password')} 
            label="New Password" 
            fullWidth 
            margin="dense" 
            error={!!errors.new_password} 
            helperText={errors.new_password?.message} 
          />
          <TextField 
            {...register('confirm_password')} 
            label="Confirm Password" 
            fullWidth 
            margin="dense" 
            error={!!errors.confirm_password} 
            helperText={errors.confirm_password?.message} 
          />
        </DialogContent>
          <Divider />
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="error" variant="contained">Cancel</Button>
            <Button type="submit" color="success" variant="contained">Create</Button>
          </DialogActions>
        </form>
      </Dialog>
         {/* Snackbar */}
         <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  
  )
}

export default SettingPage