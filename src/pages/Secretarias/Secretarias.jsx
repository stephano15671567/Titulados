import React from 'react';
import { Container, Paper, Typography, Button } from '@mui/material';
import axios from 'axios';

function SecretariaView() {
  const buttonSx = {
    mt: 2,
    mb: 2,
    bgcolor: 'rgba(0, 60, 88, 1)',
    '&:hover': {
      bgcolor: 'rgba(0, 70, 100, 1)',
    },
    color: 'white',
  };

  const reportUrl = 'https://apisst.administracionpublica-uv.cl/api/report/download-report';

  const handleDownloadReport = async () => {
    try {
      // Supongamos que el token está en localStorage con clave 'authToken'
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Debes iniciar sesión para descargar el reporte');
        return;
      }

      const response = await axios.get(reportUrl, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reporte.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al descargar el reporte:', error);
      alert('Hubo un problema al descargar el reporte.');
    }
  };

  return (
    <Container>
      <Paper>
        <Typography variant="h5" gutterBottom>
          Generar Reporte de Titulados
        </Typography>
        <Button sx={buttonSx} onClick={handleDownloadReport}>
          Descargar Reporte Excel
        </Button>
      </Paper>
    </Container>
  );
}

export default SecretariaView;
