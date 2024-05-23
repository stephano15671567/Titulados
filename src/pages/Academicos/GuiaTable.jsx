import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, Button, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, Box
} from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

const GuiaTable = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [nota, setNota] = useState('');
  const [file, setFile] = useState(null);
  const [fileTesis, setFileTesis] = useState(null);
  const [rubricaSubida, setRubricaSubida] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState({ alumno_RUT: '', alumnoNombre: '', nota_guia: '' });
  const [profesorId, setProfesorId] = useState(window.sessionStorage.getItem("id"));

  useEffect(() => {
    const fetchAssignmentsAndNotes = async () => {
      if (profesorId) {
        const assignmentsResponse = await axios.get(`https://apisst.administracionpublica-uv.cl/api/asignaciones/guia/${profesorId}`);
        const notasResponse = await axios.get('https://apisst.administracionpublica-uv.cl/api/notas');
        const alumnosResponse = await axios.get('https://apisst.administracionpublica-uv.cl/api/alumnos');
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
    setRubricaSubida(false); // Reset rubrica subida status
    setFile(null); // Reset file
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    if (!nota || nota < 1 || nota > 7 || isNaN(nota)) {
      Swal.fire('Error', 'Debe ingresar una nota válida entre 1 y 7.', 'error');
      return;
    }

    if (!file) {
      Swal.fire('Error', 'Debe subir un archivo de rúbrica.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file); // Este nombre debe coincidir con el esperado en el controlador de subida de rúbrica
    const alumnoRut = selectedAlumno.alumno_RUT;

    try {
      // Subir rúbrica
      await axios.post(`https://apisst.administracionpublica-uv.cl/api/archivos/subir/rubrica/guia/${alumnoRut}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Guardar nota
      const url = `https://apisst.administracionpublica-uv.cl/api/notas/upsert`;
      const payload = {
        alumno_RUT: selectedAlumno.alumno_RUT,
        nota: parseFloat(nota),
        profesor_id: profesorId,
        rol: 'guia',
      };

      await axios.post(url, payload);
      const updatedRows = rows.map(row => {
        if (row.alumno_RUT === selectedAlumno.alumno_RUT) {
          return { ...row, nota_guia: nota };
        }
        return row;
      });
      setRows(updatedRows);
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
    window.location.href = `https://apisst.administracionpublica-uv.cl/api/archivos/descargar/rubrica/guia`;
  };

  const handleFileChangeTesis = (event) => {
    setFileTesis(event.target.files[0]);
  };

  const handleUploadTesis = async () => {
    if (!fileTesis) {
      Swal.fire('Error', 'Por favor, selecciona un archivo de tesis para subir.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('tesis', fileTesis);
    const alumnoRut = selectedAlumno.alumno_RUT;

    try {
      await axios.post(`https://apisst.administracionpublica-uv.cl/api/archivos/subir/tesis/${alumnoRut}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Swal.fire('¡Subido!', 'La tesis ha sido subida con éxito.', 'success');
      handleClose(); // Cierra el diálogo si es necesario
    } catch (error) {
      console.error('Error al subir la tesis:', error);
      Swal.fire('Error', 'No se pudo subir la tesis.', 'error');
    }
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
          <Box sx={{ marginBottom: '20px' }}>
            <TextField
              autoFocus
              margin="dense"
              id="nota"
              label="Nota del Guía"
              type="text"
              fullWidth
              variant="outlined"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
            />
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
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <Button onClick={handleUploadTesis} component="label">
              Subir Tesis
              <input type="file" hidden onChange={handleFileChangeTesis} />
            </Button>
          </Box>
          {file && (
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

export default GuiaTable;
