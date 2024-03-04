import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Modal, Box, Typography, IconButton, Grid } from '@mui/material';
import { Edit, Delete, Description, Group, Visibility } from '@mui/icons-material';
import Swal from 'sweetalert2';

function TableData() {
  const [alumnos, setAlumnos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showAlumnos, setShowAlumnos] = useState(false);
  const [newAlumno, setNewAlumno] = useState({
    nombre: '',
    RUT: '',
    CODIGO: '',
    ANO_INGRESO: '',
    ANO_EGRESO: '',
    n_resolucion: '',
    hora: '',
    fecha_examen: '',
    tesis: '',
    mail: ''
  });

  useEffect(() => {
    // fetchAlumnos(); No cargamos los alumnos automáticamente al inicio
  }, []);

  const apiBaseUrl = 'http://localhost:4000/api/alumnos/';

  const fetchAlumnos = async () => {
    const response = await axios.get(apiBaseUrl);
    setAlumnos(response.data || []);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewAlumno({ ...newAlumno, [name]: value });
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setEditMode(false);
    setNewAlumno({
      nombre: '',
      RUT: '',
      CODIGO: '',
      ANO_INGRESO: '',
      ANO_EGRESO: '',
      n_resolucion: '',
      hora: '',
      fecha_examen: '',
      tesis: '',
      mail: ''
    });
  };

  const addOrUpdateAlumno = async () => {
    if (editMode) {
      await axios.put(`${apiBaseUrl}${newAlumno.RUT}`, newAlumno);
      Swal.fire('Actualizado', 'El alumno ha sido actualizado con éxito', 'success');
    } else {
      await axios.post(apiBaseUrl, newAlumno);
      Swal.fire('Agregado', 'El alumno ha sido agregado con éxito', 'success');
    }
    fetchAlumnos();
    handleCloseModal();
  };

  const editAlumno = (alumno) => {
    setNewAlumno(alumno);
    setEditMode(true);
    handleOpenModal();
  };

  const deleteAlumno = async (RUT) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`${apiBaseUrl}${RUT}`);
        fetchAlumnos();
        Swal.fire('Eliminado!', 'El alumno ha sido eliminado.', 'success');
      }
    });
  };

  const verTesis = (alumno) => {
    // Lógica para ver la tesis del alumno
    console.log("Viendo tesis de:", alumno.nombre);
  };

  const verComision = (alumno) => {
    // Lógica para ver la comisión del alumno
    console.log("Viendo comisión de:", alumno.nombre);
  };

  const verActa = (alumno) => {
    // Lógica para ver el acta del alumno
    console.log("Viendo acta de:", alumno.nombre);
  };

  const toggleShowAlumnos = () => {
    setShowAlumnos(!showAlumnos);
    if (!showAlumnos) fetchAlumnos(); // Carga los alumnos solo cuando se decide mostrarlos
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Button onClick={handleOpenModal} color="primary" variant="contained" style={{ marginBottom: '20px' }}>Agregar Alumno</Button>
      <Button onClick={toggleShowAlumnos} color="secondary" variant="contained" style={{ marginBottom: '20px', marginLeft: '20px' }}>
        {showAlumnos ? 'Ocultar Alumnos' : 'Visualizar Alumnos'}
      </Button>

      {showAlumnos && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>RUT</TableCell>
                <TableCell>CODIGO</TableCell>
                <TableCell>AÑO INGRESO</TableCell>
                <TableCell>AÑO EGRESO</TableCell>
                <TableCell>N Resolución</TableCell>
                <TableCell>Hora</TableCell>
                <TableCell>Fecha Examen</TableCell>
                <TableCell>Mail</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alumnos.map((alumno) => (
                <TableRow key={alumno.RUT}>
                  <TableCell>{alumno.nombre}</TableCell>
                  <TableCell>{alumno.RUT}</TableCell>
                  <TableCell>{alumno.CODIGO}</TableCell>
                  <TableCell>{alumno.ANO_INGRESO}</TableCell>
                  <TableCell>{alumno.ANO_EGRESO}</TableCell>
                  <TableCell>{alumno.n_resolucion}</TableCell>
                  <TableCell>{alumno.hora}</TableCell>
                  <TableCell>{alumno.fecha_examen}</TableCell>
                  <TableCell>{alumno.mail}</TableCell>
                 <TableCell>
  <Grid container spacing={1}>
    {/* Botón para editar */}
    <Grid item xs={6}>
      <IconButton onClick={() => editAlumno(alumno)} color="primary">
        <Edit />
      </IconButton>
    </Grid>
    {/* Botón para eliminar */}
    <Grid item xs={6}>
      <IconButton onClick={() => deleteAlumno(alumno.RUT)} color="secondary">
        <Delete />
      </IconButton>
    </Grid>
    {/* Botón para ver acta */}
    <Grid item xs={6}>
      <IconButton onClick={() => verActa(alumno)} color="primary">
        <Description />
      </IconButton>
    </Grid>
    {/* Botón para ver comisión */}
    <Grid item xs={6}>
      <IconButton onClick={() => verComision(alumno)} color="primary">
        <Group />
      </IconButton>
    </Grid>
    {/* Botón para ver tesis */}
    <Grid item xs={6}>
      <IconButton onClick={() => verTesis(alumno)} color="primary">
        <Visibility />
      </IconButton>
    </Grid>
  </Grid>
</TableCell> 
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-title" variant="h6" component="h2" marginBottom={2}>
            {editMode ? 'Editar Alumno' : 'Agregar Nuevo Alumno'}
          </Typography>
          <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' }, mt: 2 }}
            noValidate
            autoComplete="off"
          >
            {Object.keys(newAlumno).map((key) => (
              <TextField
                key={key}
                name={key}
                label={key.toUpperCase().replace('_', ' ')}
                value={newAlumno[key]}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
              />
            ))}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button onClick={addOrUpdateAlumno} color="primary" variant="contained">
                {editMode ? 'Actualizar' : 'Agregar'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default TableData;
