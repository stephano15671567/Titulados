import React, { useState } from 'react';
import { Box, Container, Paper, Typography, Button } from '@mui/material';
import axios from 'axios';  // Importamos axios para hacer la solicitud
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

  // URL para la descarga del reporte en producción
  const reportUrl = 'https://apisst.administracionpublica-uv.cl/api/report/download-report'; 

  const handleDownloadReport = async () => {
    try {
      // Realizamos la solicitud GET para descargar el archivo Excel
      const response = await axios.get(reportUrl, { responseType: 'blob' });

      // Creamos una URL de descarga del archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reporte.xlsx'; // Nombre del archivo que se descargará
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);  // Eliminamos el enlace una vez descargado
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
        <Button
          sx={buttonSx}
          onClick={handleDownloadReport} // Llama a la función de descarga
        >
          Descargar Reporte Excel
        </Button>
      </Paper>
    </Container>
  );
}

export default SecretariaView;
