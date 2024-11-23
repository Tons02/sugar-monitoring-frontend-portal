import { Box, Breadcrumbs, Divider, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const SugarConverter = () => {

  const [mgdl, setMgdl] = useState(0);
  const [mmolL, setMmolL] = useState(0);

    
  const handleMgdlChange = (event) => {
    const value = event.target.value;
    setMgdl(value);

    // Calculate mmol/L if valid number
    if (!isNaN(value) && value !== '') {
      setMmolL((value / 18).toFixed(2)); // Convert and round to 2 decimal places
    } else {
      setMmolL(''); // Clear mmol/L if input is invalid
    }
  };

  const handleMmolLChange = (event) => {
    const value = event.target.value;
    setMmolL(value);

    // Calculate mg/dL if valid number
    if (!isNaN(value) && value !== '') {
      setMgdl((value * 18).toFixed(2)); // Convert and round to 2 decimal places
    } else {
      setMgdl(''); // Clear mg/dL if input is invalid
    }
  };

  console.log(mgdl)


  return (
    <>
     <Typography variant="h4" gutterBottom>
        Sugar Converter
      </Typography>
      <Breadcrumbs aria-label="breadcrumb" sx={{ paddingBottom: 2 }}>
        <Link color="inherit" href="/">Home</Link>
        <Link color="inherit" href="/dashboard/sugarConverter">Sugar Converter</Link>
      </Breadcrumbs>
      <Box
        sx={{
            display: "flex",
            flexDirection: "column", // or "row" for horizontal layout
            gap: 2, // spacing between children
        }}
        >
        <TextField fullWidth label="mg/dL" type="text"  value={mgdl} onChange={handleMgdlChange} />
        <TextField fullWidth label="mmol/L" type="text" value={mmolL} onChange={handleMmolLChange} />
        </Box>

    </>
  )
}

export default SugarConverter