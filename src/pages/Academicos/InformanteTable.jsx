import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, Button, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, Box, IconButton
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';

const InformanteTable = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [nota, setNota] = useState(1);
  const [file, setFile] = useState(null);
  const [rubricaSubida, setRubricaSubida] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState({ alumno_RUT: '', alumnoNombre: '', nota_informante: '' });
  const [profesorId, setProfesorId] = useState(window.sessionStorage.getItem("id"));

  useEffect(() => {
    const fetchAssignmentsAndNotes = async () => {
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
            nota_informante: notaItem ? notaItem.nota_informante : null,
          };
        });

        setRows(combinedData);
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
    setNota(row.nota_informante || 1);
    setRubricaSubida(false);
    setFile(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    if (!file) {
      Swal.fire('Error', 'Debe subir un archivo de rúbrica.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    const alumnoRut = selectedAlumno.alumno_RUT;

    try {
      await axios.post(`http://localhost:4000/api/archivos/subir/rubrica/informante/${alumnoRut}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const url = `http://localhost:4000/api/notas/upsert`;
      const payload = {
        alumno_RUT: selectedAlumno.alumno_RUT,
        nota: parseFloat(nota).toFixed(1),
        profesor_id: profesorId,
        rol: 'informante',
      };

      await axios.post(url, payload);
      const updatedRows = rows.map(row => {
        if (row.alumno_RUT === selectedAlumno.alumno_RUT) {
          return { ...row, nota_informante: payload.nota };
        }
        return row;
      });
      setRows(updatedRows);
      setRubricaSubida(true);
      Swal.fire('¡Éxito!', 'La rúbrica y la nota han sido subidas y guardadas.', 'success');
      handleClose();
    } catch (error) {
      console.error('Error al subir la rúbrica o guardar la nota:', error);
      Swal.fire('Error', 'No se pudo completar la acción.', 'error');
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleDownload = () => {
    const alumnoRut = selectedAlumno.alumno_RUT;
    window.location.href = `http://localhost:4000/api/archivos/descargar/rubrica/informante`;
  };

  const handleNotaChange = (value) => {
    const newValue = Math.min(7, Math.max(1, parseFloat(value).toFixed(1)));
    if (isNaN(newValue) || newValue < 1 || newValue > 7) {
      Swal.fire('Error', 'Debe ingresar una nota válida entre 1 y 7 con un solo decimal.', 'error');
      return;
    }
    setNota(newValue);
  };

  const handleIncrement = () => {
    handleNotaChange((parseFloat(nota) + 0.1).toFixed(1));
  };

  const handleDecrement = () => {
    handleNotaChange((parseFloat(nota) - 0.1).toFixed(1));
  };

  return (
    <Paper sx={{ padding: '20px', marginBottom: '20px', width: '100%' }}>
      <Typography variant="h5" gutterBottom component="div">
        Informante
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
              <TableRow key={row.alumno_RUT}>
                <TableCell component="th" scope="row">
                  {row.alumnoNombre}
                </TableCell>
                <TableCell align="right">{row.alumno_RUT}</TableCell>
                <TableCell align="right">{row.nota_informante || 'No asignada'}</TableCell>
                <TableCell align="right">
                  <Button variant="outlined" onClick={() => handleClickOpen(row)}>
                    Gestionar Rúbrica y Nota
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
        <DialogTitle>Gestionar Rúbrica y Nota del Alumno</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            Nota del Informante (Ingrese un valor entre 1 y 7, con un solo decimal):
          </Typography>
          <Box sx={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={handleDecrement} disabled={nota <= 1}>
              <Remove />
            </IconButton>
            <TextField
              margin="dense"
              id="nota"
              label="Nota del Informante"
              type="number"
              inputProps={{ min: 1, max: 7, step: 0.1 }}
              value={nota}
              onChange={(e) => handleNotaChange(e.target.value)}
              fullWidth
              variant="outlined"
            />
            <IconButton onClick={handleIncrement} disabled={nota >= 7}>
              <Add />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <Button onClick={handleDownload}>
              Descargar Rúbrica
            </Button>
            <Button component="label">
              Subir Rúbrica
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          </Box>
          {file && !rubricaSubida && (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <Button onClick={handleConfirm} variant="contained" color="primary">
                Confirmar Subida y Guardar Nota
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default InformanteTable;
