import { Alert, Box, Breadcrumbs, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Paper, Snackbar, TextField, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../services/HTTPRequest';
import { Delete, Edit } from '@mui/icons-material';
import dayjs from 'dayjs';
import { yupResolver } from '@hookform/resolvers/yup';
import { sugarMonitoring } from '../validations/validation';
import { Controller, useForm } from 'react-hook-form';
import { DatePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; 

const DailyMonitoring = () => {
  const [dailyMonitoring, setDailyMonitoring] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedDailySugar, setSelectedDailySugar] = useState(null);

   // State for delete confirmation dialog
   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });


  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch, 
    setValue,
  } = useForm({
    defaultValues: {
      date: dayjs(), 
    },
    resolver: yupResolver(sugarMonitoring),
  });

console.log("date",watch.date)

  const fetchDailyMonitoring = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"))
      const response = await API.get(`/daily-sugar?search=${searchTerm}&pagination=1&page=${page + 1}&per_page=${rowsPerPage}&user=${user.id}&status=is_active`);
      setDailyMonitoring(response?.data?.data || []);
      setTotalCount(response?.data?.data?.total || 0);
    } catch (error) {
      console.error('Error fetching Daily Monitoring:', error);
    }
  };

  useEffect(() => {
    fetchDailyMonitoring();
  }, [page, rowsPerPage, searchTerm]);

  const handleCreateDailyMonitoring = async (data) => {
    // Format the date to 'YYYY-MM-DD HH:mm:ss' before submitting
    const formattedDate = dayjs(data.date).format('YYYY-MM-DD HH:mm:ss');
    const requestData = {
      ...data,  // Spread all the data fields
      date: formattedDate  // Set the formatted date
    };
    try {
      const response = await API.post('/daily-sugar', requestData);
      console.log('Daily sugar created:', response.data);
      fetchDailyMonitoring();
      setOpenDialog(false);
      reset();
      setSnackbar({
        open: true,
        message: response?.data?.message,
        severity: "success",
      });
    } catch (error) {
      console.error('Error creating daily sugar:', error?.response?.data?.errors);
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

  const handleUpdateDailySugar = async (data) => {
    // Format the date to 'YYYY-MM-DD HH:mm:ss' before submitting
    const formattedDate = dayjs(data.date).format('YYYY-MM-DD HH:mm:ss');
    const requestData = {
      ...data,  // Spread all the data fields
      date: formattedDate  // Set the formatted date
    };
    
    try {
      const response = await API.put(`/daily-sugar/${selectedDailySugar.id}`, requestData);
      console.log('Daily Sugar updated:', response.data);
      fetchDailyMonitoring();
      setOpenUpdateDialog(false);
      
      setSnackbar({
        open: true,
        message: response?.data?.message,
        severity: "success",
      });
    } catch (error) {
      console.error('Error updating', error?.response?.data?.errors);
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

  const handleDeleteDailySugar = async () => {
    try {
      const response = await API.put(`/daily-sugar-archived/${selectedDailySugar.id}`);  // Archiving the user
      console.log('User archived:', response.data);
      fetchDailyMonitoring();
      setOpenDeleteDialog(false);  // Close the delete confirmation dialog
      setSnackbar({
        open: true,
        message: response?.data?.message,
        severity: "success",
      });
    } catch (error) {
      console.error('Error archiving', error?.response?.data?.errors);
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

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'user', headerName: 'Name', flex: 2, valueGetter: (params) => params .name || 'No Name'},
    { field: 'mgdl', headerName: 'mgdl', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 2 },
    { field: 'status', headerName: 'Status', flex: 1, renderCell: (params) => {
      let color;
      if (params.value === 'high') color = 'red';
      else if (params.value === 'normal') color = 'green';
      else if (params.value === 'low') color = 'yellow';
      
      return (
        <Chip
          label={params.value}
          style={{ color }}
          variant="outlined" // Adding outlined variant
          color="default" // Ensures the outline color is based on the text color
          sx={{
            borderColor: color, // Dynamic outline color
            padding: '4px 8px', // Optional: Adds padding for better appearance
          }}
        />
      );
    }, 
  },
    { field: 'date', headerName: 'Date', flex: 2, valueFormatter: (params) => {
      if (!params) return '';
      return dayjs(params).format('MMMM DD, YYYY hh:mm A'); // Format: November 18, 2024
    }, },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 2,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <Edit />
          </IconButton>
          <IconButton color="error" onClick={() => handleDeleteClick (params.row)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      fetchDailyMonitoring();
    }
  };

  const handleEdit = (dailySugar) => {
    setSelectedDailySugar(dailySugar);
    reset(dailySugar);
    setOpenUpdateDialog(true);
  };

  const handleDeleteClick = (dailySugar) => {
    setSelectedDailySugar(dailySugar);  // Set the user to delete
    setOpenDeleteDialog(true);  // Open the confirmation dialog
  };

  return (
    <>
       <Typography variant="h4" gutterBottom>
        Monitoring
      </Typography>
      <Breadcrumbs aria-label="breadcrumb" sx={{ paddingBottom: 2 }}>
        <Link color="inherit" href="/">Home</Link>
        <Link color="inherit" href="/users">Monitoring</Link>
      </Breadcrumbs>

      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 2 }}>
        <Button variant="contained" color="success" onClick={() => setOpenDialog(true)}>
          Add
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
          rows={dailyMonitoring}
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

      {/* Create Sugar Monitoring Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle> Daily Sugar input</DialogTitle>
        <form onSubmit={handleSubmit(handleCreateDailyMonitoring)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField 
                {...register('mgdl')} 
                label="MG/DL" 
                margin="dense" 
                fullWidth
                error={!!errors.mgdl} 
                helperText={errors.mgdl?.message} 
              />
            </Grid>
            <Grid item xs={6}>
             <LocalizationProvider  dateAdapter={AdapterDayjs}>
             <DateTimePicker
                {...register('date')}
                label="Date"
                value={watch('date') ? dayjs(watch('date')) : null}  // Ensure value is a Dayjs object
                onAccept={(newValue) => setValue('date', newValue)}  // Update form state with the new value
                sx={{
                  marginTop: '8px',
                }}
                slotProps={{
                  textField: { helperText: errors.date?.message, error: !!errors.date },
                }}
              />
            </LocalizationProvider>
            </Grid>
          </Grid>
          <TextField 
            {...register('description')} 
            label="Description" 
            fullWidth 
            margin="dense" 
            error={!!errors.description} 
            helperText={errors.description?.message} 
          />
        </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="error" variant="contained">Cancel</Button>
            <Button type="submit" color="success" variant="contained">Create</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Update Daily Sugar Dialog */}
      <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Update Daily Sugar</DialogTitle>
        <form onSubmit={handleSubmit(handleUpdateDailySugar)}>
          <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField 
                {...register('mgdl')} 
                label="MG/DL" 
                margin="dense" 
                fullWidth
                error={!!errors.mgdl} 
                helperText={errors.mgdl?.message} 
              />
            </Grid>
            <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                {...register('date')}
                label="Date"
                value={watch('date') ? dayjs(watch('date')) : null}  // Ensure value is a Dayjs object
                onAccept={(newValue) => setValue('date', newValue)}  // Update form state with the new value
                sx={{
                  marginTop: '8px',
                }}
                slotProps={{
                  textField: { helperText: errors.date?.message, error: !!errors.date },
                }}
              />
            </LocalizationProvider>
            </Grid>
          </Grid>
          <TextField 
            {...register('description')} 
            label="Description" 
            fullWidth 
            margin="dense" 
            error={!!errors.description} 
            helperText={errors.description?.message} 
          />
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
          <Typography>Are you sure you want to archive this record?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="error" variant="contained">Cancel</Button>
          <Button onClick={handleDeleteDailySugar} color="success" variant="contained">Yes, Archive</Button>
        </DialogActions>
      </Dialog>

       {/* Snackbar for notifications */}
       <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default DailyMonitoring
