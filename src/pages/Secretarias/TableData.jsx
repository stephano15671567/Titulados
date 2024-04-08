import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Modal, Box, Typography, IconButton, Grid } from '@mui/material';
import { Edit, Delete, Description, Visibility, NoteAdd } from '@mui/icons-material';
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
    mail: '',
    nota_examen_oral: ''
  });
  const [notaDefensa, setNotaDefensa] = useState('');
  const [notaDefensaModalOpen, setNotaDefensaModalOpen] = useState(false);

  useEffect(() => {
    fetchAlumnos();
  }, []);

  const apiBaseUrl = 'http://localhost:4000/api/alumnos/';

  const fetchAlumnos = async () => {
    try {
      const studentsResponse = await axios.get(`${apiBaseUrl}`);
      const studentsData = studentsResponse.data || [];

      const gradesResponse = await axios.get(`http://localhost:4000/api/notas/`);
      const gradesData = gradesResponse.data || [];

      const notasIndex = gradesData.reduce((acc, nota) => {
        acc[nota.alumno_RUT] = nota.nota_examen_oral;
        return acc;
      }, {});

      const combinedData = studentsData.map(alumno => ({
        ...alumno,
        nota_examen_oral: notasIndex[alumno.RUT] || null
      }));

      setAlumnos(combinedData);
    } catch (error) {
      console.error('Error fetching combined alumnos data:', error);
      Swal.fire('Error', 'Ocurrió un error al obtener los datos combinados de los alumnos', 'error');
    }
  };
  const descargarTesis = async (rut) => {
  try {
    const response = await axios.get(`http://localhost:4000/api/archivos/descargar/tesis/${rut}`, {
      responseType: 'blob',
    });

    if (response.data.size > 0) { 
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Tesis_${rut}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Si no hay archivo, muestra un mensaje de error.
      Swal.fire('No encontrado', 'No se encontró la tesis solicitada.', 'error');
    }
  } catch (error) {
    Swal.fire('Error', 'No se pudo descargar la tesis.', 'error');
    console.error('Error descargando la tesis:', error);
  }
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
      mail: '',
      
      nota_defensa: ''
    });
  };

  const handleOpenNotaDefensaModal = () => setNotaDefensaModalOpen(true);
  const handleCloseNotaDefensaModal = () => {
    setNotaDefensaModalOpen(false);
    setNotaDefensa('');
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

  const addNotaDefensa = async () => {
    try {
      await axios.post('http://localhost:4000/api/notas/examenoral', { alumno_RUT: newAlumno.RUT, nota_defensa: notaDefensa });
      Swal.fire('Agregada', 'La nota de defensa ha sido añadida con éxito', 'success');
      handleCloseNotaDefensaModal();
      fetchAlumnos();
    } catch (error) {
      Swal.fire('Error', 'Ocurrió un error al añadir la nota de defensa', 'error');
      console.error('Error al añadir la nota de defensa:', error);
    }
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

  

 

  const toggleShowAlumnos = () => {
    setShowAlumnos(!showAlumnos);
    if (!showAlumnos) fetchAlumnos();
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
const descargarActa = async (rut) => {
  try {
    const response = await axios.get(`http://localhost:4000/api/archivos/descargar/acta/${rut}`, {
      responseType: 'blob',
    });

    if (response.data.size > 0) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Acta_${rut}.docx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      Swal.fire('No encontrado', 'No se encontró el acta solicitada.', 'error');
    }
  } catch (error) {
    Swal.fire('Error', 'No se pudo descargar el acta.', 'error');
    console.error('Error descargando el acta:', error);
  }
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
                <TableCell width="100">Nombre</TableCell>
                <TableCell width="90">RUT</TableCell>
                <TableCell>CODIGO</TableCell>
                <TableCell>AÑO INGRESO</TableCell>
                <TableCell>AÑO EGRESO</TableCell>
                <TableCell>N Resolución</TableCell>
                <TableCell>Hora</TableCell>
                <TableCell>Fecha Examen</TableCell>
                <TableCell>Mail</TableCell>
                <TableCell>Nota Examen Oral</TableCell>
                <TableCell width="400">Acciones</TableCell>
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
                  <TableCell>{alumno.nota_examen_oral}</TableCell>
                  <TableCell>
                    <Grid container spacing={1}>
                      <Grid item>
                        <IconButton onClick={() => editAlumno(alumno)} color="primary">
                          <Edit />
                          <Typography variant="caption">Editar</Typography>
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton onClick={() => deleteAlumno(alumno.RUT)} color="secondary">
                          <Delete />
                          <Typography variant="caption">Eliminar</Typography>
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton onClick={() => descargarActa(alumno.RUT)} color="primary">
                          <Description />
                          <Typography variant="caption">Descargar Acta</Typography>
                        </IconButton>
                      </Grid>
                      
                      <Grid item>
                        <IconButton onClick={() => {
                          setNewAlumno(alumno);
                          handleOpenNotaDefensaModal();
                        }} color="primary">
                          <NoteAdd />
                          <Typography variant="caption">Añadir Nota de Defensa</Typography>
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton
                          onClick={() => window.open(`http://localhost:4000/api/archivos/descargar/rubrica/guia/con-notas/${alumno.RUT}`, '_blank')}
                          color="primary"
                        >
                          <Description />
                          <Typography variant="caption">Descargar Rúbrica Guía</Typography>
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton
                          onClick={() => window.open(`http://localhost:4000/api/archivos/descargar/rubrica/informante/con-notas/${alumno.RUT}`, '_blank')}
                          color="primary"
                        >
                          <Description />
                          <Typography variant="caption">Descargar Rúbrica Informante</Typography>
                        </IconButton>
                      </Grid>
                      <Grid item>
                      <IconButton color="primary" onClick={() => descargarTesis(alumno.RUT)}>
                        <Description />
                        <Typography variant="caption">Tesis</Typography>
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

      <Modal
        open={notaDefensaModalOpen}
        onClose={handleCloseNotaDefensaModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-title" variant="h6" component="h2" marginBottom={2}>
            Añadir Nota de Defensa
          </Typography>
          <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' }, mt: 2 }}
            noValidate
            autoComplete="off"
          >
            <TextField
              name="nota_defensa"
              label="Nota de Defensa"
              value={notaDefensa}
              onChange={(event) => setNotaDefensa(event.target.value)}
              fullWidth
              margin="dense"
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button onClick={addNotaDefensa} color="primary" variant="contained">
                Añadir Nota
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default TableData;