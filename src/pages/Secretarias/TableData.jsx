import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Select,
  MenuItem,
} from '@mui/material';

function TableData({ titulados }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selections, setSelections] = useState({});

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectionChange = (event, tituladoId, tipo) => {
    setSelections({
      ...selections,
      [tituladoId]: {
        ...selections[tituladoId],
        [tipo]: event.target.value,
      },
    });
  };

  // Asume que tienes una lista de profesores para seleccionar
  const profesores = ['Profesor 1', 'Profesor 2', 'Profesor 3'];

  return (
    <TableContainer component={Paper}>
      <Table aria-label="lista de titulados">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Alumno</TableCell>
            <TableCell>RUT</TableCell>
            <TableCell>Profesor Guía</TableCell>
            <TableCell>Profesor Informante</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {titulados
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((titulado) => (
              <TableRow key={titulado.id}>
                <TableCell>{titulado.id}</TableCell>
                <TableCell>{titulado.alumno}</TableCell>
                <TableCell>{titulado.rut}</TableCell>
                <TableCell>
                  <Select
                    value={selections[titulado.id]?.guia || ''}
                    onChange={(event) => handleSelectionChange(event, titulado.id, 'guia')}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Profesor Guía' }}
                  >
                    <MenuItem value="">
                      <em>Ninguno</em>
                    </MenuItem>
                    {profesores.map((profesor, index) => (
                      <MenuItem key={`guia-${index}`} value={profesor}>{profesor}</MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={selections[titulado.id]?.informante || ''}
                    onChange={(event) => handleSelectionChange(event, titulado.id, 'informante')}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Profesor Informante' }}
                  >
                    <MenuItem value="">
                      <em>Ninguno</em>
                    </MenuItem>
                    {profesores.map((profesor, index) => (
                      <MenuItem key={`informante-${index}`} value={profesor}>{profesor}</MenuItem>
                    ))}
                  </Select>
                </TableCell>
              </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={titulados.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}

export default TableData;

