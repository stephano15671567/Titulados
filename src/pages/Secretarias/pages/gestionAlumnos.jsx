import React from 'react';
import DashBoard from '../Dashboard/DashBoard';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import TableData from '../components/TableData';

const drawerWidth = 240;

function gestionAlumnos () {
  return (
    <>
        <Box sx={{display: "flex" }}>
        <DashBoard/>        
            <Box
            component="main"
            sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
            <TableData/>
            </Box>
        </Box>
    </>
  );
}

export default gestionAlumnos;