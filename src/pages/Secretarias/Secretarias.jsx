import React, { useState } from 'react';
import { Box, Container, Paper, Typography, Button, Link } from '@mui/material';
import BackgroundTransition from '../../BackgroundTransition/BackgroundTransition';
import background1 from '../Home/components/images/imag_valparaiso.jpg';
import background2 from '../Home/components/images/imagen_2.jpg';
import background3 from '../Home/components/images/imagen_3.jpg';
import background4 from '../Home/components/images/imagen_4.jpg';
import background5 from '../Home/components/images/imagen_5.jpg';
import FileUpload from './FileUpload'; // Ensure the path is correct
import TableData from './TableData'; 
import TableDataProfesores from './TableDataProfesores';
import Asignaciones from './Asignaciones';


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

  const reportUrl = `https://apisst.administracionpublica-uv.cl/api/report/download-report`; 

  return (
    
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '20px',
            fontFamily: 'Times New Roman',
          }}
        >
          <Paper
            sx={{
              padding: '20px',
              textAlign: 'center',
              marginBottom: '20px',
              width: '200%',
              maxWidth: '2000px',
              bgcolor: 'lightgray',
              borderRadius: '10px',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            <Typography variant="h5" gutterBottom>
              Secretaría - Administración de Tesis y Documentos
            </Typography>
            <FileUpload buttonSx={buttonSx} />

            

            <a href={reportUrl} style={{ textDecoration: 'none' }} download>
              <Button variant="contained" fullWidth sx={buttonSx}>
                Ver Reporte
              </Button>
            </a>

            <Button variant="contained" fullWidth sx={buttonSx} onClick={() => setShowTable(!showTable)}>
              Gestión Alumnos
            </Button>
            {showTable && <TableData />}
            

            <Button variant="contained" fullWidth sx={buttonSx} onClick={() => setShowProfesoresTable(!showProfesoresTable)}>
              Gestión Profesores
            </Button>

            {showProfesoresTable && <TableDataProfesores />}

            {/* Botón y lógica para mostrar/ocultar Asignaciones */}
            <Button variant="contained" fullWidth sx={buttonSx} onClick={() => setShowAsignacionesTable(!showAsignacionesTable)}>
              Gestión de Asignaciones
            </Button>
            {showAsignacionesTable && <Asignaciones />}
            

            
          </Paper>
        </Box>
      </Container>
    
  );
}

export default SecretariaView;
