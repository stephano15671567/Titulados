import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField, // Importar TextField para la entrada de la nota
} from '@mui/material';

function TableData({ titulados }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [grades, setGrades] = useState({}); // Nuevo estado para las notas

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleGradeChange = (id, newGrade) => {
    setGrades({ ...grades, [id]: newGrade });
    // Aquí podrías llamar a una función para enviar la nota actualizada al backend
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="lista de titulados">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Alumno</TableCell>
              <TableCell>RUT</TableCell>
              <TableCell>Nota</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {titulados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((titulado) => (
              <TableRow key={titulado.id}>
                <TableCell>{titulado.id}</TableCell>
                <TableCell>{titulado.alumno}</TableCell>
                <TableCell>{titulado.rut}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={grades[titulado.id] || ''}
                    onChange={(e) => handleGradeChange(titulado.id, e.target.value)}
                    inputProps={{ min: "1", max: "7", step: "1" }}
                  />
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
    </div>
  );
}

export default TableData;

