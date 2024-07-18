import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, Button, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, Box
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
    setRubricaSubida(false); // Reset rubrica subida status
    setFile(null); // Reset file
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async (withFileUpload = false) => {
    if (nota < 1 || nota > 7 || isNaN(nota)) {
      Swal.fire('Error', 'La nota debe ser un número entre 1 y 7.', 'error');
      return;
    }

    const saveNota = async () => {
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
        Swal.fire('¡Guardado!', 'La nota ha sido actualizada.', 'success');
      } catch (error) {
        console.error('Error al guardar la nota:', error);
        Swal.fire('Error', 'No se pudo guardar la nota.', 'error');
      }
    };

    if (withFileUpload) {
      if (!file) {
        Swal.fire('Error', 'Por favor, selecciona un archivo para subir.', 'error');
        return;
      }

      const formData = new FormData();
      formData.append('file', file); // Este nombre debe coincidir con el esperado en el controlador de subida de rúbrica
      const alumnoRut = selectedAlumno.alumno_RUT;

      try {
        await axios.post(`http://localhost:4000/api/archivos/subir/rubrica/informante/${alumnoRut}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setRubricaSubida(true); // Mark rubrica as uploaded
        await saveNota();
        Swal.fire('¡Subido y guardado!', 'La rúbrica y la nota han sido actualizadas.', 'success');
      } catch (error) {
        console.error('Error al subir la rúbrica de informante:', error);
        Swal.fire('Error', 'No se pudo subir la rúbrica de informante.', 'error');
      }
    } else {
      if (!rubricaSubida) {
        Swal.fire('Error', 'Debes subir la rúbrica antes de asignar una nota.', 'error');
        return;
      }
      await saveNota();
    }

    handleClose();
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleDownload = () => {
    const alumnoRut = selectedAlumno.alumno_RUT;
    window.location.href = `http://localhost:4000/api/archivos/descargar/rubrica/informante`;
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <TextField
              autoFocus
              margin="dense"
              id="nota"
              label="Nota del Informante"
              type="text"
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
          {file && (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <Button onClick={() => handleSave(true)} variant="contained" color="primary">
                Confirmar Subida y Guardar Nota
              </Button>
            </Box>
          )}
          {!file && rubricaSubida && (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <Button onClick={() => handleSave()} variant="contained" color="primary">
                Guardar Nota
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
