import React, { useState } from 'react';
import { Box, Container, Paper, Typography, Button } from '@mui/material';
import FileUpload from './components/FileUpload'; // Ensure the path is correct
import DashBoard from './Dashboard/DashBoard';

function SecretariaView() {
  const [showTable, setShowTable] = useState(false);
  const [showProfesoresTable, setShowProfesoresTable] = useState(false);
  const [showAsignacionesTable, setShowAsignacionesTable] = useState(false); 
  

  const buttonSx = {
    mt: 2,
    mb: 2,
    bgcolor: 'rgba(0, 60, 88, 1)',
    '&:hover': {
      bgcolor: 'rgba(0, 70, 100, 1)',
    },
    color: 'white',
  };

  const reportUrl = 'http://localhost:4000/api/report/download-report'; 

  return (
    <DashBoard/>
  );
}

export default SecretariaView;
