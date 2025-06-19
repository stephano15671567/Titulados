import React from 'react';
import { Box, Typography } from '@mui/material';
import TableDataProfesores from '../components/TableDataProfesores'; // Importa el subcomponente
import DashBoard from '../Dashboard/DashBoard'; // Mantener esta importación

const drawerWidth = 240; // Definir aquí
const appBarHeight = 64; // Altura típica

function gestionProfesores () { // Cambiado a gestionProfesores
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
          Gestión de Profesores
        </Typography>
        <TableDataProfesores /> {/* Renderiza el subcomponente */}
      </Box>
    </>
  );
}

export default gestionProfesores;