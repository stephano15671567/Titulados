import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, Button, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField
} from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

const InformanteTable = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [nota, setNota] = useState('');
  const [file, setFile] = useState(null);
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
            nota_informante: notaItem ? notaItem.nota_informante : 'No asignada',
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
    setNota(row.nota_informante);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    if (nota < 1 || nota > 7 || isNaN(nota)) {
      Swal.fire('Error', 'La nota debe ser un número entre 1 y 7.', 'error');
      return;
    }

    const url = `http://localhost:4000/api/notas/upsert`;
    const payload = {
      alumno_RUT: selectedAlumno.alumno_RUT,
      nota: parseFloat(nota),
      profesor_id: profesorId,
      rol: 'informante',
    };

    try {
      await axios.post(url, payload);
      const updatedRows = rows.map(row => {
        if (row.alumno_RUT === selectedAlumno.alumno_RUT) {
          return { ...row, nota_informante: nota };
        }
        return row;
      });
      setRows(updatedRows);
      handleClose();
      Swal.fire('¡Guardado!', 'La nota ha sido actualizada.', 'success');
    } catch (error) {
      console.error('Error al guardar la nota:', error);
      Swal.fire('Error', 'No se pudo guardar la nota.', 'error');
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      Swal.fire('Error', 'Por favor, selecciona un archivo para subir.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('rubrica', file);
    const alumnoRut = selectedAlumno.alumno_RUT;

    try {
      await axios.post(`http://localhost:4000/api/rubrica/upload/${alumnoRut}`, formData);
      Swal.fire('¡Subido!', 'La rúbrica ha sido actualizada.', 'success');
      handleClose();
    } catch (error) {
      console.error('Error al subir la rúbrica:', error);
      Swal.fire('Error', 'No se pudo subir la rúbrica.', 'error');
    }
  };

  const handleDownload = () => {
    const alumnoRut = selectedAlumno.alumno_RUT;
    window.location.href = `http://localhost:4000/api/archivos/descargar-rubrica/${alumnoRut}`;
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
                <TableCell align="right">{row.nota_informante}</TableCell>
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
          <TextField
            autoFocus
            margin="dense"
            id="nota"
            label="Nota del Informante"
            type="text"
            fullWidth
            variant="outlined"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
          />
          <div>
            <Button onClick={handleDownload} sx={{ mt: 2, mb: 1 }}>
              Descargar Rúbrica
            </Button>
            <Button component="label" sx={{ mt: 2, mb: 1, ml: 2 }}>
              Subir Rúbrica
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar Nota</Button>
          <Button onClick={handleUpload} disabled={!file}>Subir Rúbrica</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default InformanteTable;
