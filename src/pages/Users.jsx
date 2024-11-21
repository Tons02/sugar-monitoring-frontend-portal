import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import API from "../services/HTTPRequest";
import { Box, Button, IconButton, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert, InputLabel, Select, MenuItem, FormHelperText, FormControl } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { userSchema } from "../validations/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // State for delete confirmation dialog
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
    reset,
  } = useForm({
    resolver: yupResolver(userSchema),
  });

  const fetchUsers = async () => {
    try {
      const response = await API.get(`/user?search=${searchTerm}&pagination=1&page=${page + 1}&per_page=${rowsPerPage}&status=is_active`);
      setUsers(response?.data?.data?.data || []);
      setTotalCount(response?.data?.data?.total || 0);
    } catch (error) {
      console.error('Error fetching Users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, searchTerm]);

  const handleCreateUser = async (data) => {
    try {
      const response = await API.post('/user', data);
      console.log('User created:', response.data);
      fetchUsers();
      setOpenDialog(false);
      reset();
      setSnackbar({
        open: true,
        message: response?.data?.message,
        severity: "success",
      });
    } catch (error) {
      console.error('Error creating user:', error?.response?.data?.errors);
      const errorMessages = error?.response?.data?.errors
        ? error.response.data.errors.map((err) => err.detail).join(', ')
        : error?.message || 'An unexpected error occurred';

      setSnackbar({
        open: true,
        message: errorMessages,
        severity: "error",
      });
    }
  };

  const handleUpdateUser = async (data) => {
    try {
      const response = await API.put(`/user/${selectedUser.id}`, data);
      console.log('User updated:', response.data);
      fetchUsers();
      setOpenUpdateDialog(false);
      setSnackbar({
        open: true,
        message: response?.data?.message,
        severity: "success",
      });
    } catch (error) {
      console.error('Error updating user:', error?.response?.data?.errors);
      const errorMessages = error?.response?.data?.errors
        ? error.response.data.errors.map((err) => err.detail).join(', ')
        : error?.message || 'An unexpected error occurred';

      setSnackbar({
        open: true,
        message: errorMessages,
        severity: "error",
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      const response = await API.put(`/user-archived/${selectedUser.id}`);  // Archiving the user
      console.log('User archived:', response.data);
      fetchUsers();
      setOpenDeleteDialog(false);  // Close the delete confirmation dialog
      setSnackbar({
        open: true,
        message: response?.data?.message,
        severity: "success",
      });
    } catch (error) {
      console.error('Error archiving user:', error?.response?.data?.errors);
      const errorMessages = error?.response?.data?.errors
        ? error.response.data.errors.map((err) => err.detail).join(', ')
        : error?.message || 'An unexpected error occurred';

      setSnackbar({
        open: true,
        message: errorMessages,
        severity: "error",
      });
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      fetchUsers();
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    reset(user);
    setOpenUpdateDialog(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);  // Set the user to delete
    setOpenDeleteDialog(true);  // Open the confirmation dialog
  };

  const columns = [
    { field: 'id', headerName: 'ID', flex: .5 },
    { field: 'first_name', headerName: 'First Name', flex: 1 },
    { field: 'middle_name', headerName: 'Middle Name', flex: 1 },
    { field: 'last_name', headerName: 'Last Name', flex: 1 },
    { field: 'gender', headerName: 'Gender', flex: 1 },
    { field: 'mobile_number', headerName: 'Mobile Number', flex: 2 },
    { field: 'email', headerName: 'Email', flex: 2 },
    { field: 'username', headerName: 'Username', flex: 1 },
    { field: 'userType', headerName: 'User Type', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 2,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <Edit />
          </IconButton>
          <IconButton color="error" onClick={() => handleDeleteClick(params.row)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

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
        <Button variant="contained" color="success" onClick={() => setOpenDialog(true)}>
          Add User
        </Button>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          sx={{ width: 300 }}
        />
      </Box>

      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={users}
          columns={columns}
          pagination
          page={page}
          pageSize={rowsPerPage}
          rowCount={totalCount}
          paginationMode="server"
          onPageChange={handleChangePage}
          onPageSizeChange={handleChangeRowsPerPage}
          sx={{ border: 0 }}
        />
      </Paper>

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
                labelId="gender-label" // Link the label to the Select
                {...register('gender')}
                defaultValue="male" // Set the default value to male
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
            <TextField {...register('mobile_number')} label="Mobile Number" fullWidth margin="dense" error={!!errors.mobile_number} helperText={errors.mobile_number?.message} inputProps={{ maxLength: 13 }}/>
            <TextField {...register('email')} label="Email" fullWidth margin="dense" error={!!errors.email} helperText={errors.email?.message} />
            <TextField {...register('username')} label="Username" fullWidth margin="dense" error={!!errors.username} helperText={errors.username?.message} />
            <FormControl margin="dense" fullWidth>
            <InputLabel id="userType-label">User Type</InputLabel>
            <Select
              margin='dense'
              label='User Type'
              labelId="userType-label" // Link the label to the Select
              {...register('userType')}
              defaultValue="admin" // Set the default value to male
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="error" variant="contained">Cancel</Button>
            <Button type="submit" color="success" variant="contained">Create</Button>
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
              labelId="gender-label" // Link the label to the Select
              {...register('gender')}
              defaultValue="male" // Set the default value to male
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </FormControl>
            <TextField {...register('mobile_number')} label="Mobile Number" fullWidth margin="dense" error={!!errors.mobile_number} helperText={errors.mobile_number?.message} />
            <TextField {...register('email')} label="Email" fullWidth margin="dense" error={!!errors.email} helperText={errors.email?.message} />
            <TextField {...register('username')} label="Username" fullWidth margin="dense" error={!!errors.username} helperText={errors.username?.message} />
            <FormControl margin="dense" fullWidth>
              <InputLabel id="userType-label">User Type</InputLabel>
              <Select
                margin='dense'
                label='User Type'
                labelId="userType-label" // Link the label to the Select
                {...register('userType')}
                defaultValue="admin" // Set the default value to male
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenUpdateDialog(false)} color="error" variant="contained">Cancel</Button>
            <Button type="submit" color="success" variant="contained">Update</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Confirmation Dialog for Delete */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to archive this user?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="error" variant="contained">Cancel</Button>
          <Button onClick={handleDeleteUser} color="success" variant="contained">Yes, Archive</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Users;
