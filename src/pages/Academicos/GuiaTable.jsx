import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, Button, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField
} from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../App.css'; 

const GuiaTable = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [nota, setNota] = useState('');
  const [selectedAlumno, setSelectedAlumno] = useState({ alumno_RUT: '', alumnoNombre: '', nota_guia: '' });
  const [profesorId, setProfesorId] = useState(window.sessionStorage.getItem("id"));

  useEffect(() => {
    const fetchAssignmentsAndNotes = async () => {
      try {
        if (profesorId) {
          const assignmentsResponse = await axios.get(`http://localhost:4000/api/asignaciones/guia/${profesorId}`);
          const notasResponse = await axios.get('http://localhost:4000/api/notas');
          const alumnosResponse = await axios.get('http://localhost:4000/api/alumnos');
          const alumnos = alumnosResponse.data;

          const combinedData = assignmentsResponse.data.map(asignacion => {
            const alumno = alumnos.find(a => a.RUT === asignacion.alumno_RUT);
            const notaItem = notasResponse.data.find(n => n.alumno_RUT === asignacion.alumno_RUT);
            return {
              ...asignacion,
              alumnoNombre: alumno ? alumno.nombre : 'Nombre no encontrado',
              nota_guia: notaItem ? notaItem.nota_guia : 'No asignada',
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickOpen = (row) => {
    setSelectedAlumno(row);
    setNota(row.nota_guia);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    const notaNum = parseFloat(nota);
    if (!profesorId) {
      console.error('No profesorId provided');
      return;
    }
    if (isNaN(notaNum) || notaNum < 1 || notaNum > 7) {
      Swal.fire('Error', 'La nota debe estar en el rango de 1 a 7 con un máximo de un decimal.', 'error');
      return;
    }

    // Cierra el diálogo de MUI antes de mostrar el SweetAlert
    setOpen(false);

    // Espera a que la animación de cierre del diálogo termine antes de mostrar SweetAlert
    setTimeout(() => {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "Vas a guardar esta nota",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, guardar!'
      }).then((result) => {
        if (result.isConfirmed) {
          const url = `http://localhost:4000/api/notas/upsert`;
          const payload = {
            alumno_RUT: selectedAlumno.alumno_RUT,
            nota: notaNum,
            profesor_id: profesorId,
            rol: 'guia'
          };

          axios.post(url, payload)
            .then(response => {
              // Actualiza las filas aquí
              Swal.fire('¡Guardado!', 'La nota ha sido actualizada.', 'success');
            })
            .catch(error => {
              console.error('Error al actualizar la nota:', error);
              Swal.fire('Error', 'No se pudo guardar la nota.', 'error');
            });
        }
      });
    }, 300); // El tiempo de espera debe ser mayor que la duración de la animación del diálogo de MUI
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
              <TableCell align="right">Nota Guía</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.alumno_RUT}>
                <TableCell component="th" scope="row">
                  {row.alumnoNombre}
                </TableCell>
                <TableCell align="right">{row.alumno_RUT}</TableCell>
                <TableCell align="right">{row.nota_guia}</TableCell>
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
        <DialogTitle>Editar Nota del Guía</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="nota"
            label="Nota del Guía"
            type="text" // Se usa text para manejar la entrada manualmente
            fullWidth
            variant="outlined"
            value={nota}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '' || /^(\d{1,2}(\.\d{0,1})?)?$/.test(val)) {
                setNota(val);
              }
            }}
            inputProps={{
              step: "0.1",
              min: "1",
              max: "7",
              pattern: "^\\d{1,2}(\\.\\d{1})?$"
            }}
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