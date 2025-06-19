import React from 'react';
import { Box, Typography } from '@mui/material';
import TableData from '../components/TableData';
import DashBoard from '../Dashboard/DashBoard'; // Mantener esta importación

const drawerWidth = 240; // Definir aquí si es necesario para los estilos de Box
const appBarHeight = 64; // Altura típica de un AppBar en Material-UI

function gestionAlumnos () {
  return (
    <>
      <DashBoard/> {/* Se mantiene aquí */}
      <Box
        component="main"
        sx={{
          ml: { sm: `${drawerWidth}px` }, // Margen izquierdo para compensar el Drawer
          mt: `${appBarHeight}px`, // Margen superior para compensar el AppBar
          p: 3, // Padding general para el contenido
          width: { sm: `calc(100% - ${drawerWidth}px)` }, // Ajustar el ancho para no desbordar
          boxSizing: 'border-box', // Asegurar que el padding no añada ancho extra
        }}
      >
        <Typography variant="h4" gutterBottom>
          Gestión de Alumnos
        </Typography>
        <TableData/>
      </Box>
    </>
  );
}

export default gestionAlumnos;