import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function TableData({ titulados }) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="lista de titulados">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Alumno</TableCell>
            <TableCell>RUT</TableCell>
            {/* Añade más celdas de encabezado según sea necesario */}
          </TableRow>
        </TableHead>
        <TableBody>
          {titulados.map((titulado) => (
            <TableRow key={titulado.id}>
              <TableCell>{titulado.id}</TableCell>
              <TableCell>{titulado.alumno}</TableCell>
              <TableCell>{titulado.rut}</TableCell>
              {/* Añade más celdas con datos según sea necesario */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TableData;
