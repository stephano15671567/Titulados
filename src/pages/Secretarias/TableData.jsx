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
  Select,
  MenuItem,
} from '@mui/material';

function TableData({ titulados }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // Guarda las selecciones de guía e informante por cada titulado
  const [selections, setSelections] = useState({});
  const [profesoresGuias, setProfesoresGuias] = useState([]);
  const [profesoresInformantes, setProfesoresInformantes] = useState([]);

  // Carga inicial de datos de profesores
  useEffect(() => {
    // Reemplaza con tu API real para obtener profesores guías e informantes
    fetch('/api/profesores-guias').then(response => response.json()).then(data => setProfesoresGuias(data));
    fetch('/api/profesores-informantes').then(response => response.json()).then(data => setProfesoresInformantes(data));
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectionChange = (tituladoId, value, type) => {
    setSelections(prevSelections => ({
      ...prevSelections,
      [tituladoId]: {
        ...prevSelections[tituladoId],
        [type]: value,
      },
    }));
    
    // Opcional: Actualizar en la base de datos aquí o mediante un botón de "Guardar"
  };

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
          {titulados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((titulado) => (
            <TableRow key={titulado.id}>
              <TableCell>{titulado.id}</TableCell>
              <TableCell>{titulado.alumno}</TableCell>
              <TableCell>{titulado.rut}</TableCell>
              <TableCell>
                <Select
                  value={selections[titulado.id]?.guia || ''}
                  onChange={(event) => handleSelectionChange(titulado.id, event.target.value, 'guia')}
                  displayEmpty
                >
                  <MenuItem value=""><em>Ninguno</em></MenuItem>
                  {profesoresGuias.map((profesor) => (
                    <MenuItem key={profesor.id} value={profesor.id}>{profesor.nombre}</MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <Select
                  value={selections[titulado.id]?.informante || ''}
                  onChange={(event) => handleSelectionChange(titulado.id, event.target.value, 'informante')}
                  displayEmpty
                >
                  <MenuItem value=""><em>Ninguno</em></MenuItem>
                  {profesoresInformantes.map((profesor) => (
                    <MenuItem key={profesor.id} value={profesor.id}>{profesor.nombre}</MenuItem>
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
