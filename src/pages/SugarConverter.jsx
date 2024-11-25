import { Box, Breadcrumbs, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SugarConverter = () => {
  const [mgdl, setMgdl] = useState('');
  const [mmolL, setMmolL] = useState('');
  const [status, setStatus] = useState('');

  const handleMgdlChange = (event) => {
    const value = event.target.value;
    setMgdl(value);

    if (!isNaN(value) && value !== '') {
      const mmol = (value / 18).toFixed(2);
      setMmolL(mmol);
      if (value < 70) {
        setStatus('Low');
      } else if (value > 125) {
        setStatus('High');
      } else {
        setStatus('Normal');
      }
    } else {
      setMmolL('');
      setStatus('');
    }
  };

  const handleMmolLChange = (event) => {
    const value = event.target.value;
    setMmolL(value);

    if (!isNaN(value) && value !== '') {
      const mg = (value * 18).toFixed(2);
      setMgdl(mg);
      if (mg < 70) {
        setStatus('Low');
      } else if (mg > 125) {
        setStatus('High');
      } else {
        setStatus('Normal');
      }
    } else {
      setMgdl('');
      setStatus('');
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Sugar Converter
      </Typography>
      <Breadcrumbs aria-label="breadcrumb" sx={{ paddingBottom: 2 }}>
        <Link color="inherit" to="/">Home</Link>
        <Link color="inherit" to="/dashboard/sugarConverter">Sugar Converter</Link>
      </Breadcrumbs>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <TextField
          fullWidth
          label="mg/dL"
          type="text"
          value={mgdl}
          onChange={handleMgdlChange}
        />
        <TextField
          fullWidth
          label="mmol/L"
          type="text"
          value={mmolL}
          onChange={handleMmolLChange}
        />
     <TextField
          fullWidth
          label="Status"
          type="text"
          value={status}
          InputProps={{
            readOnly: true,
          }}
          sx={{
            input: { 
              fontWeight: 'bold', 
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: status === 'High' || status === 'Low' ? 'red' : status === 'Normal' ? 'green' : 'gray',
              },
              "&:hover fieldset": {
                borderColor: status === 'High' || status === 'Low' ? 'red' : status === 'Normal' ? 'green' : 'gray',
              },
              "&.Mui-focused fieldset": {
                borderColor: status === 'High' || status === 'Low' ? 'red' : status === 'Normal' ? 'green' : 'gray',
              },
            },
          }}
        />
      </Box>
    </>
  );
};

export default SugarConverter;
