import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, Button, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField
} from '@mui/material';
import axios from 'axios';

const GuiaTable = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [nota, setNota] = useState('');
  const [selectedAlumno, setSelectedAlumno] = useState({ alumno_RUT: '', alumnoNombre: '', nota_informante: '' });
  const [profesorId, setProfesorId] = useState(window.sessionStorage.getItem("id"));

  useEffect(() => {
    const fetchAssignmentsAndNotes = async () => {
      try {
        if (profesorId) {
          const assignmentsResponse = await axios.get(`http://localhost:4000/api/asignaciones/informante/${profesorId}`);
          const notasResponse = await axios.get('http://localhost:4000/api/notas');
          const alumnosResponse = await axios.get('http://localhost:4000/api/alumnos');
          const alumnos = alumnosResponse.data;

          const combinedData = assignmentsResponse.data.map(asignacion => {
            const alumno = alumnos.find(a => a.RUT === asignacion.alumno_RUT);
            const notaItem = notasResponse.data.find(n => n.alumno_RUT === asignacion.alumno_RUT);
            return {
              ...asignacion,
              alumnoNombre: alumno ? alumno.nombre : 'Nombre no encontrado',
              nota_informante: notaItem ? notaItem.nota_informante : 'No asignada',
            };
          });

          setRows(combinedData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAssignmentsAndNotes();
  }, [profesorId]);

  const fetchProfesorId = async (alumnoRUT) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/asignaciones/${alumnoRUT}`);
      const assignment = response.data[0]; // Adjust according to your API's response structure
      setProfesorId(assignment.profesor_id);
    } catch (error) {
      console.error('Error al obtener el profesorId:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickOpen = (row) => {
    setSelectedAlumno(row);
    setNota(row.nota_informante);
    fetchProfesorId(row.alumno_RUT);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    if (!profesorId) {
      console.error('No profesorId provided');
      return;
    }
    const url = `http://localhost:4000/api/notas/upsert`;
    const payload = {
      alumno_RUT: selectedAlumno.alumno_RUT,
      nota: nota,
      profesor_id: profesorId,
      rol: 'informante'
    };

    axios.post(url, payload)
      .then(response => {
        const updatedRows = rows.map(row => {
          if (row.alumno_RUT === selectedAlumno.alumno_RUT) {
            return { ...row, nota_informante: nota };
          }
          return row;
        });
        setRows(updatedRows);
        handleClose();
      })
      .catch(error => {
        console.error('Error al actualizar la nota:', error);
      });
  };

  return (
    <Paper sx={{ padding: '20px', marginBottom: '20px', width: '100%' }}>
      <Typography variant="h5" gutterBottom component="div">
        Guía
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell align="right">RUT</TableCell>
              <TableCell align="right">Nota Informante</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.nota_id}>
                <TableCell component="th" scope="row">
                  {row.alumnoNombre}
                </TableCell>
                <TableCell align="right">{row.alumno_RUT}</TableCell>
                <TableCell align="right">{row.nota_informante}</TableCell>
                <TableCell align="right">
                  <Button variant="outlined" onClick={() => handleClickOpen(row)}>
                    Editar Nota
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar Nota del Informante</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="nota"
            label="Nota del Informante"
            type="number"
            fullWidth
            variant="outlined"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default GuiaTable;
