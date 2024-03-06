import React, { useState } from 'react';
import { Box, Container, Paper, Typography, Button } from '@mui/material';
import { Link, Outlet } from 'react-router-dom'; 
import FileUpload from './FileUpload'; 
import TableData from './TableData'; 
import TableDataProfesores from './TableDataProfesores';
import Asignaciones from './Asignaciones';

function SecretariaView() {
  const [showTable, setShowTable] = useState(false);
  const [showProfesoresTable, setShowProfesoresTable] = useState(false);
  const [showAsignacionesTable, setShowAsignacionesTable] = useState(false); 
  const [showReporte, setReporte] = useState(false)

  const buttonSx = {
    mt: 2,
    mb: 2,
    bgcolor: 'rgba(0, 60, 88, 1)',
    '&:hover': {
      bgcolor: 'rgba(0, 70, 100, 1)',
    },
    color: 'white',
  };

  const handleClick=()=>{
    setReporte(true)
  }
  
  const reportUrl = '/Secretarias/Reporte'; 

  return (
    <>
    {showReporte && (<Outlet/>)}
    {!showReporte &&( <Container maxWidth="md">
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
            width: '100%',
            maxWidth: '1000px',
            bgcolor: 'lightgray',
            borderRadius: '10px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Typography variant="h5" gutterBottom>
            Secretaría - Administración de Tesis y Documentos
          </Typography>

          <FileUpload buttonSx={buttonSx} />

          {/* Botón para ver el reporte */}
          <Link to={reportUrl} style={{ textDecoration: 'none' }}>
            <Button variant="contained" onClick={handleClick} fullWidth sx={buttonSx}>
              Ver Reporte
            </Button>
          </Link>

          {/* Resto de los botones y lógica de mostrar/ocultar tablas */}
          <Button variant="contained" fullWidth sx={buttonSx} onClick={() => setShowTable(!showTable)}>
            Gestión Alumnos
          </Button>
          {showTable && <TableData />}

          <Button variant="contained" fullWidth sx={buttonSx} onClick={() => setShowProfesoresTable(!showProfesoresTable)}>
            Gestión Profesores
          </Button>
          {showProfesoresTable && <TableDataProfesores />}

          <Button variant="contained" fullWidth sx={buttonSx} onClick={() => setShowAsignacionesTable(!showAsignacionesTable)}>
            Gestión de Asignaciones
          </Button>
          {showAsignacionesTable && <Asignaciones />}
        </Paper>
      </Box>
    </Container>)}
   
    </>
  );
}

export default SecretariaView;
