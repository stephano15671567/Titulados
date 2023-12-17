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
  TextField,
  Button,
} from '@mui/material';

function TableData({ titulados }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [grades, setGrades] = useState({}); // Estado para las notas

  // Manejadores de eventos para la paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Manejador para cambiar notas
  const handleGradeChange = (id, newGrade) => {
    setGrades({ ...grades, [id]: newGrade });
  };

  // Función para guardar la nota en el backend
    const saveGrade = (idAlumno, nota) => {
    const token = localStorage.getItem('token'); // Asumiendo que el token está almacenado en localStorage
    const url = 'http://localhost:4000/api/login/profesores/asignar-nota-guia';
    
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Añade el token en el encabezado
      },
      body: JSON.stringify({ idAlumno, nota }),
    })
    .then(response => {
      if (!response.ok) throw new Error('Error al guardar la nota');
      return response.json();
    })
    .then(data => {
      alert('Nota guardada con éxito');
      // Actualizar el estado aquí si es necesario
    })
    .catch(error => {
      alert(error.message);
    });
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="lista de titulados">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Alumno</TableCell>
            <TableCell>RUT</TableCell>
            <TableCell>Nota</TableCell>
            <TableCell>Acción</TableCell>
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
                  inputProps={{ min: "1", max: "7", step: "0.1" }}
                />
              </TableCell>
              <TableCell>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => saveGrade(titulado.id, grades[titulado.id])}
                >
                  Guardar
                </Button>
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
