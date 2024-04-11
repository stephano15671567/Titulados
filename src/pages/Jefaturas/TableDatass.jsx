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
  Button,
} from '@mui/material';
import axios from 'axios';

function TableData({ titulados }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selections, setSelections] = useState({});
  const [profesoresGuias, setProfesoresGuias] = useState([]);
  const [profesoresInformantes, setProfesoresInformantes] = useState([]);

  useEffect(() => {
    // Fetch the data for 'profesores guías'
    axios.get('http://10.100.32.192:4000/api/profesores/guias/')
      .then(response => {
        setProfesoresGuias(response.data);
      })
      .catch(error => console.error('Error al cargar los profesores guías', error));

    // Fetch the data for 'profesores informantes'
    axios.get('http://10.100.32.192:4000/api/profesores/informantes/')
      .then(response => {
        setProfesoresInformantes(response.data);
      })
      .catch(error => console.error('Error al cargar los profesores informantes', error));
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
  };

  const saveAssignments = async () => {
    const updatePromises = Object.entries(selections).map(([tituladoId, selection]) =>
      axios.post('http://10.100.32.192:4000/api/profesores/asignacion', {
        tituladoId,
        profesorGuiaId: selection.guia, 
        profesorInformanteId: selection.informante,
      })
    );

    try {
      await Promise.all(updatePromises);
      alert('Asignaciones guardadas con éxito');
    } catch (error) {
      console.error('Error al guardar las asignaciones', error);
      alert('Error al guardar las asignaciones');
    }
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
      <Button variant="contained" color="primary" onClick={saveAssignments}>
        Guardar Asignaciones
      </Button>
    </div>
  );
}

export default TableData;
