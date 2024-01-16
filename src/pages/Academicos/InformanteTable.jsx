// InformanteTable.js
import React from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const InformanteTable = ({ rows }) => (
  <Paper sx={{ padding: '20px', marginBottom: '20px', width: '100%' }}>
    <Typography variant="h5" gutterBottom>Informante</Typography>
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell align="right">RUT</TableCell>
            <TableCell align="right">Nota</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {Array.isArray(rows) && rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">{row.nombre}</TableCell>
              <TableCell align="right">{row.RUT}</TableCell>
              <TableCell align="right">{row.nota}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

export default InformanteTable;
