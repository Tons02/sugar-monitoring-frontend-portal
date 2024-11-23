import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Box, Breadcrumbs, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, Grid, Paper, Skeleton, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom'
import { dailySugarMonitoring } from '../validations/validation';
import dayjs from 'dayjs';
import { useAddDailySugarMutation, useArchivedDailySugarMutation, useGetDailySugarQuery, useUpdateDailySugarMutation } from '../redux/slices/apiSlice';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; 

const DailyMonitoring = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [selectedID, setSelectedID] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
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
    setError,
    watch,
    inputError,
    setValue
  } = useForm({
    defaultValues: {
      mgdl:"",
      description:"",
      date: dayjs(), 

    },
    resolver: yupResolver(dailySugarMonitoring),
  });

  const userID = JSON.parse(localStorage.getItem("user"))?.id ?? null;

  // Fetch users with RTK Query hook
  const { data: dailyMonitoring, isLoading, isError, error, refetch } = useGetDailySugarQuery({ search, page: page + 1, per_page: rowsPerPage, status , userID });

  const [addDailySugar] = useAddDailySugarMutation();
  const [updateDailySugar] = useUpdateDailySugarMutation();
  const [archiveDailySugar] = useArchivedDailySugarMutation();

  function cleanPointer(pointer) {
    return pointer?.replace(/^\//, ""); // Removes the leading '/'
  }
  
  // Handle Create Daily Sugar
  const handleCreateDailySugar = async (data) => {
    const formattedDate = dayjs(data.date).format('YYYY-MM-DD HH:mm:ss');
    const requestData = {
      ...data,  // Spread all the data fields
      date: formattedDate  // Set the formatted date
    };
    try {
      const response = await addDailySugar(requestData).unwrap();  // Using RTK Query's unwrap method for response handling
      console.log('Daily sugar created:', response);
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

  // Handle Update Daily Sugar
  const handleUpdateDailySugar = async (data) => {
    const formattedDate = dayjs(data.date).format('YYYY-MM-DD HH:mm:ss');
    const requestData = {
      ...data,  // Spread all the data fields
      date: formattedDate  // Set the formatted date
    };

    try {
      const response = await updateDailySugar({ ...requestData, id: requestData.id }).unwrap();
      console.log('Daily Sugar updated:', response);
      refetch();
      setOpenUpdateDialog(false);
      setSnackbar({
        open: true,
        message: response?.message,
        severity: "success",
      });
    } catch (error) {
      console.error('Error updating daily sugar:', error);
      setSnackbar({
        open: true,
        message: error?.message || 'An unexpected error occurred',
        severity: "error",
      });
    }
  };

   // Handle Delete/Archive User
   const handleDeleteDailySugar = async () => {
   
    try {
      const response = await archiveDailySugar({ id: selectedID }).unwrap();
      console.log('Daily Sugar archived:', response);
      setOpenDeleteDialog(false);
      refetch();
      setSnackbar({
        open: true,
        message: response?.message,
        severity: "success",
      });
    } catch (errors) {
      console.error('Error archiving daily sugar:', errors?.data?.errors?.[0]?.detail);
      setSnackbar({
        open: true,
        message: errors?.data?.errors?.[0]?.detail || 'An unexpected error occurred',
        severity: "error",
      });
    }
  };

  const handleCreate = () => {
    reset({
      mgdl: "",
      date: dayjs(),
      description: "",
    });
    setOpenDialog(true);
  };
  


  const handleEdit = () => {
    setOpenUpdateDialog(true);
  };

  const handleDeleteClick = (row) => {
    setSelectedID(row.id);
    setOpenDeleteDialog(true);
  };

  const handleClose = () => {
    setSelectedID(null)
    setOpenDeleteDialog(false);
  };


  
  const handleSearchChange = (event) => {
    setSearch(event.target.value);  // Update the search state when typing
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };

  const handleChangeStatus = (event) => {
    // Update status based on checkbox state
    if (event.target.checked) {
      setStatus("inactive");
      refetch()
    } else {
      setStatus("active");
      refetch()
    }
  };


  return (
    <>
    <Typography variant="h4" gutterBottom>
       Daily Monitoring
     </Typography>
     <Breadcrumbs aria-label="breadcrumb" sx={{ paddingBottom: 2 }}>
        <Link color="inherit" href="/">Home</Link>
        <Link color="inherit" href="/dashboard/users">Users</Link>
      </Breadcrumbs>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 2 }}>
      <Button variant="contained" color="success" onClick={() => handleCreate()}>
          Add
      </Button>
      </Box>
      <TableContainer component={Paper}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ padding: 1.5 }}  // Adding padding here
      >
         <FormControlLabel
            control={<Checkbox color="success" onChange={handleChangeStatus} />}
            label="Archived"
          />
        <TextField
          label="Search"
          variant="outlined"
          value={search}
          onChange={handleSearchChange} 
          sx={{ width: 300 }}
        />
      </Box>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Mgdl</TableCell>
            <TableCell align="center">Description</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Date</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* If loading, show skeleton loader */}
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell  align="center" component="th" scope="row">
                  <Skeleton width="80%" />
                </TableCell>
                <TableCell align="center">
                  <Skeleton width="60%" />
                </TableCell>
                <TableCell align="center">
                  <Skeleton width="70%" />
                </TableCell>
                <TableCell align="center">
                  <Skeleton width="60%" />
                </TableCell>
                <TableCell align="center">
                  <Skeleton width="80%" />
                </TableCell>
                <TableCell align="center">
                  <Skeleton width="90%" />
                </TableCell>
                <TableCell align="center">
                  <Skeleton width="70%" />
                </TableCell>
              </TableRow>
            ))
          ) : isError ? (
            // If error, show error message
            <TableRow>
              <TableCell colSpan={6} align="center">
                Error: {error.message}
              </TableCell>
            </TableRow>
          ) : (
            // Once data is loaded, render the rows
            dailyMonitoring?.data?.data?.map((row) => (
              <TableRow key={row.id}>
                <TableCell  align="center" scope="row">{row.id}</TableCell>
                <TableCell component="th"  align="center" scope="row">{row.name}</TableCell>
                <TableCell align="center">{row.mgdl}</TableCell>
                <TableCell align="center">{row.description}</TableCell>
                <TableCell align="center">
                  <Box
                    sx={{
                      color: row.status === "high" || row.status === "low" ? "red" : "green",
                      outline: `2px solid ${
                        row.status === "high" || row.status === "low" ? "red" : "green"
                      }`,
                      borderRadius: "8px",
                      padding: "4px 8px",
                    }}
                  >
                    {row.status}
                  </Box>
                </TableCell>
                <TableCell align="center">{row.date}</TableCell>
                <TableCell align="center" sx={{ padding: '5px' }}>
                <Box display="flex" gap={1}>
                  {
                  status === "active" ? (
                    <>
                      <Button variant="contained" color="success" onClick={() => { handleEdit(row) }}>
                        EDIT
                      </Button>
                      <Button variant="contained" color="error" onClick={() => { handleDeleteClick(row) }}>
                        Delete
                      </Button>
                    </>
                  ) : (
                    <Button variant="contained" color="success" onClick={() => { handleDeleteClick(row) }}>
                      Restore
                    </Button>
                  )
                }   
                </Box>
              </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
        {/* Pagination */}
        <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={dailyMonitoring?.data?.data?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>

    {/* Create Sugar Monitoring Dialog */}
    <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle> Daily Sugar input</DialogTitle>
        <form onSubmit={handleSubmit(handleCreateDailySugar)}>
        <Divider />
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
          <Divider />
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
        <Divider />
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
          <Divider />
          <DialogActions>
            <Button onClick={() => setOpenUpdateDialog(false)} color="error" variant="contained">Cancel</Button>
            <Button type="submit" color="success" variant="contained">Update</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Confirmation Dialog for Delete */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <Divider />
        <DialogContent>
          <Typography>Are you sure you want to archive this record?</Typography>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={() => handleClose()} variant="contained" color="error">Cancel</Button>
          <Button onClick={handleDeleteDailySugar} color="success" variant="contained">Yes, Archive</Button>
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
    
      
  )
}

export default DailyMonitoring