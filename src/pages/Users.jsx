import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, IconButton, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert, InputLabel, Select, MenuItem, FormHelperText, FormControl, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Skeleton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { userSchema } from "../validations/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';
import { useGetUserQuery, useAddUserMutation, useUpdateUserMutation, useArchivedUserMutation } from '../redux/slices/apiSlice';

const Users = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setError,
  } = useForm({
    defaultValues: {
      first_name:"",
      middle_name:"",
      gender:"",
      mobile_number:"",
      email:"",
      username:"",
      userType:"",

    },
    resolver: yupResolver(userSchema),
  });

  // Fetch users with RTK Query hook
  const { data: users, isLoading, isError, error, refetch } = useGetUserQuery({ searchTerm, page, rowsPerPage });

  const [addUser] = useAddUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [archiveUser] = useArchivedUserMutation();

  function cleanPointer(pointer) {
    return pointer?.replace(/^\//, ""); // Removes the leading '/'
  }
  
  // Handle Create User
  const handleCreateUser = async (data) => {
    try {
      const response = await addUser(data).unwrap();  // Using RTK Query's unwrap method for response handling
      console.log('User created:', response);
      setOpenDialog(false);
      refetch();
      reset();
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

  // Handle Update User
  const handleUpdateUser = async (data) => {
    try {
      const response = await updateUser({ ...data, id: selectedUser.id }).unwrap();
      console.log('User updated:', response);
      refetch();
      setOpenUpdateDialog(false);
      setSnackbar({
        open: true,
        message: response?.message,
        severity: "success",
      });
    } catch (error) {
      console.error('Error updating user:', error);
      setSnackbar({
        open: true,
        message: error?.message || 'An unexpected error occurred',
        severity: "error",
      });
    }
  };

  // Handle Delete/Archive User
  const handleDeleteUser = async () => {
    try {
      const response = await archiveUser({ id: selectedUser.id }).unwrap();
      console.log('User archived:', response);
      setOpenDeleteDialog(false);
      setSnackbar({
        open: true,
        message: response?.message,
        severity: "success",
      });
    } catch (error) {
      console.error('Error archiving user:', error);
      setSnackbar({
        open: true,
        message: error?.message || 'An unexpected error occurred',
        severity: "error",
      });
    }
  };

  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
    
    }
  };

  const handleCreate = () => {
    console.log("handleCreate")
    
    setSelectedUser(null);
    reset();
    setOpenDialog(true);
    
  console.log(selectedUser)
  };


  const handleEdit = (user) => {
    setSelectedUser(user);
    reset(user);
    setOpenUpdateDialog(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleClose = () => {
    setSelectedUser(null);
    reset();
    setOpenUpdateDialog(false);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <Breadcrumbs aria-label="breadcrumb" sx={{ paddingBottom: 2 }}>
        <Link color="inherit" href="/">Home</Link>
        <Link color="inherit" href="/users">Users</Link>
      </Breadcrumbs>

      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 2 }}>
      <Button variant="contained" color="success" onClick={() => handleCreate()}>
          Add User
        </Button>
        <TextField
          label="Search"
          variant="outlined"
          // value={searchTerm}
          // onChange={handleSearchChange}
          // onKeyDown={handleKeyDown}
          sx={{ width: 300 }}
        />
      </Box>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell align="right">Middle Name</TableCell>
            <TableCell align="right">Last Name</TableCell>
            <TableCell align="right">Username</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Mobile Number</TableCell>
            <TableCell align="right">User Type</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* If loading, show skeleton loader */}
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  <Skeleton width="80%" />
                </TableCell>
                <TableCell align="right">
                  <Skeleton width="60%" />
                </TableCell>
                <TableCell align="right">
                  <Skeleton width="70%" />
                </TableCell>
                <TableCell align="right">
                  <Skeleton width="60%" />
                </TableCell>
                <TableCell align="right">
                  <Skeleton width="80%" />
                </TableCell>
                <TableCell align="right">
                  <Skeleton width="90%" />
                </TableCell>
                <TableCell align="right">
                  <Skeleton width="70%" />
                </TableCell>
                <TableCell align="right">
                  <Skeleton width="70%" />
                </TableCell>
              </TableRow>
            ))
          ) : isError ? (
            // If error, show error message
            <TableRow>
              <TableCell colSpan={7} align="center">
                Error: {error.message}
              </TableCell>
            </TableRow>
          ) : (
            // Once data is loaded, render the rows
            users?.data?.data?.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">{row.first_name}</TableCell>
                <TableCell align="right">{row.middle_name}</TableCell>
                <TableCell align="right">{row.last_name}</TableCell>
                <TableCell align="right">{row.username}</TableCell>
                <TableCell align="right">{row.email}</TableCell>
                <TableCell align="right">{row.mobileNumber}</TableCell>
                <TableCell align="right">{row.userType}</TableCell>
                <TableCell align="right"><Button variant="contained" color="success" onClick={()=> {handleEdit(row)}}>EDIT</Button> <Button variant="contained" color="error">Delete</Button></TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>

      {/* Create User Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create User</DialogTitle>
        <form onSubmit={handleSubmit(handleCreateUser)}>
          <DialogContent>
            <TextField {...register('first_name')} label="First Name" fullWidth margin="dense" error={!!errors.first_name} helperText={errors.first_name?.message} />
            <TextField {...register('middle_name')} label="Middle Name" fullWidth margin="dense" error={!!errors.middle_name} helperText={errors.middle_name?.message} />
            <TextField {...register('last_name')} label="Last Name" fullWidth margin="dense" error={!!errors.last_name} helperText={errors.last_name?.message} />
            <FormControl margin="dense" fullWidth>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                margin='dense'
                label='Gender'
                labelId="gender-label"
                {...register('gender')}
                error={!!errors.gender}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
            {errors.userType && <FormHelperText error>{errors.userType?.message}</FormHelperText>}
            <TextField {...register('mobile_number')} label="Mobile Number" fullWidth margin="dense" error={!!errors.mobile_number} helperText={errors.mobile_number?.message} inputProps={{ maxLength: 13 }} />
            <TextField {...register('email')} label="Email" fullWidth margin="dense" error={!!errors.email} helperText={errors.email?.message} />
            <TextField {...register('username')} label="Username" fullWidth margin="dense" error={!!errors.username} helperText={errors.username?.message} />
            <FormControl margin="dense" fullWidth>
            <InputLabel id="userType-label">User Type</InputLabel>
            <Select
              margin="dense"
              label="User Type"
              labelId="userType-label"
              {...register('userType')}
              error={!!errors.userType}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
            {errors.userType && <FormHelperText error>{errors.userType?.message}</FormHelperText>}
          </FormControl>

          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="error">Cancel</Button>
            <Button type="submit" variant="contained" color="success">Create</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Update User Dialog */}
      <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Update User</DialogTitle>
        <form onSubmit={handleSubmit(handleUpdateUser)}>
          <DialogContent>
            <TextField {...register('first_name')} label="First Name" fullWidth margin="dense" error={!!errors.first_name} helperText={errors.first_name?.message} />
            <TextField {...register('middle_name')} label="Middle Name" fullWidth margin="dense" error={!!errors.middle_name} helperText={errors.middle_name?.message} />
            <TextField {...register('last_name')} label="Last Name" fullWidth margin="dense" error={!!errors.last_name} helperText={errors.last_name?.message} />
            <FormControl margin="dense" fullWidth>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                margin='dense'
                label='Gender'
                labelId="gender-label"
                {...register('gender')}
                error={!!errors.gender}
                defaultValue={selectedUser?.gender} 
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
              {errors.gender && <FormHelperText error>{errors.gender?.message}</FormHelperText>}
            </FormControl>
            <TextField {...register('mobile_number')} label="Mobile Number" fullWidth margin="dense" error={!!errors.mobile_number} helperText={errors.mobile_number?.message} />
            <TextField {...register('email')} label="Email" fullWidth margin="dense" error={!!errors.email} helperText={errors.email?.message} />
            <TextField {...register('username')} label="Username" fullWidth margin="dense" error={!!errors.username} helperText={errors.username?.message} />
            <FormControl margin="dense" fullWidth>
              <InputLabel id="userType-label">User Type</InputLabel>
              <Select
                margin="dense"
                label="User Type"
                labelId="userType-label"
                {...register('userType')}
                error={!!errors.userType}
                defaultValue={selectedUser?.userType} 
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
              {errors.userType && <FormHelperText error>{errors.userType?.message}</FormHelperText>}
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleClose()} variant="contained" color="error">Cancel</Button>
            <Button type="submit" variant="contained" color="success">Update</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete/Archive User Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Archive</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="error">Cancel</Button>
          <Button onClick={handleDeleteUser} variant="contained" color="error">Archive</Button>
        </DialogActions>
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
  );
};

export default Users;
