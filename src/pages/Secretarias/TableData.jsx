import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Modal, Box, Typography } from '@mui/material';

function TableData() {
  const [alumnos, setAlumnos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
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
    ficha_inscripcion: '',
    tesis: '',
    mail: ''
  });

  useEffect(() => {
    fetchAlumnos();
  }, []);

  const apiBaseUrl = 'http://localhost:4000/api/alumnos/';

  const fetchAlumnos = async () => {
    try {
      const response = await axios.get(apiBaseUrl);
      setAlumnos(response.data || []);
    } catch (error) {
      console.error('Error al cargar alumnos:', error);
      setAlumnos([]);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewAlumno({ ...newAlumno, [name]: value });
  };

  const addAlumno = async () => {
    try {
      await axios.post(apiBaseUrl, newAlumno);
      fetchAlumnos();
      handleCloseModal();
      setNewAlumno({
        nombre: '',
        RUT: '',
        CODIGO: '',
        ANO_INGRESO: '',
        ANO_EGRESO: '',
        n_resolucion: '',
        hora: '',
        fecha_examen: '',
        ficha_inscripcion: '',
        tesis: '',
        mail: ''
      });
    } catch (error) {
      console.error('Error al agregar alumno:', error);
    }
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const toggleShowAlumnos = () => setShowAlumnos(!showAlumnos);

  // Estilos para el modal
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
                {/* Asegúrate de que estas cabeceras coincidan con las propiedades de tu objeto de alumno */}
                <TableCell>Nombre</TableCell>
                <TableCell>RUT</TableCell>
                <TableCell>CODIGO</TableCell>
                <TableCell>AÑO INGRESO</TableCell>
                <TableCell>AÑO EGRESO</TableCell>
                <TableCell>N Resolución</TableCell>
                <TableCell>Hora</TableCell>
                <TableCell>Fecha Examen</TableCell>
                <TableCell>Ficha Inscripción</TableCell>
                <TableCell>Tesis</TableCell>
                <TableCell>Mail</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alumnos.map((alumno, index) => (
                <TableRow key={index}>
                  {/* Asegúrate de que estas celdas coincidan con las propiedades de tu objeto de alumno */}
                  <TableCell>{alumno.nombre}</TableCell>
                  <TableCell>{alumno.RUT}</TableCell>
                  <TableCell>{alumno.CODIGO}</TableCell>
                  <TableCell>{alumno.ANO_INGRESO}</TableCell>
                  <TableCell>{alumno.ANO_EGRESO}</TableCell>
                  <TableCell>{alumno.n_resolucion}</TableCell>
                  <TableCell>{alumno.hora}</TableCell>
                  <TableCell>{alumno.fecha_examen}</TableCell>
                  <TableCell>{alumno.ficha_inscripcion}</TableCell>
                  <TableCell>{alumno.tesis}</TableCell>
                  <TableCell>{alumno.mail}</TableCell>
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
            Agregar nuevo alumno
          </Typography>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
              mt: 2
            }}
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
              <Button onClick={addAlumno} color="primary" variant="contained">Agregar</Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default TableData;


