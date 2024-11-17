import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import API from "../services/HTTPRequest";
import { Box, Button, IconButton, TextField } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const Users = () => {
  const [users, setUsers] = useState([]);  // Store users data
  const [totalCount, setTotalCount] = useState(0);  // Track total number of users
  const [page, setPage] = useState(0);  // Current page state
  const [rowsPerPage, setRowsPerPage] = useState(10);  // Rows per page state
  const [searchTerm, setSearchTerm] = useState("");  // Search term state

  // Fetch users based on pagination, rows per page, and search term
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await API.get(`/user?search=${searchTerm}&pagination=1&page=${page + 1}&per_page=${rowsPerPage}&status=is_active`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUsers(response?.data?.data?.data || []);
        setTotalCount(response?.data?.data?.total || 0);  // Assuming 'total' is returned in the response
      } catch (error) {
        console.error('Error fetching Users:', error);
      }
    };
    fetchUsers();
  }, [page, rowsPerPage, searchTerm]);  // Re-fetch users when page, rowsPerPage, or searchTerm changes

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);  // Reset to first page when rows per page changes
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // Trigger the search action when Enter is pressed
      console.log('Search triggered for:', searchTerm);
      // Trigger the API call manually after pressing Enter
      fetchUsers();
    }
  };

  // Columns for the DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 }, 
    { field: 'fullname', headerName: 'Fullname', flex: 3 }, 
    { field: 'gender', headerName: 'Gender', flex: 1 },  
    { field: 'mobile_number', headerName: 'Mobile Number', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 2 },
    { field: 'username', headerName: 'Username', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <Edit />
          </IconButton>
          <IconButton color="error" onClick={() => handleDeleteClick(params.row.id)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  // DataGrid pagination model
  const paginationModel = { page, pageSize: rowsPerPage };

  return (
    <>
      {/* Title and Breadcrumbs */}
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <Breadcrumbs aria-label="breadcrumb" sx={{ paddingBottom: 2 }}>
        <Link color="inherit" href="/">
          Home
        </Link>
        <Link color="inherit" href="/users">
          Users
        </Link>
      </Breadcrumbs>

      {/* Add Button and Search */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 2 }}>
        <Button variant="contained" color="primary">
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

      {/* Data Table */}
      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={users}  // Pass the fetched users as rows
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
    </>
  );
};

export default Users;
