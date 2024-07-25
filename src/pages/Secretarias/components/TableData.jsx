import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Modal, Box, Typography, IconButton, TablePagination, TableFooter
} from '@mui/material';
import { Edit, Delete, Description, NoteAdd, List } from '@mui/icons-material';
import Swal from 'sweetalert2';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO, isValid, parse } from 'date-fns';
import './styles.css';

function TableData() {
  const [alumnos, setAlumnos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showAlumnos, setShowAlumnos] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [newAlumno, setNewAlumno] = useState({
    nombre: '',
    RUT: '',
    CODIGO: '',
    ANO_INGRESO: '',
    ANO_EGRESO: '',
    n_resolucion: '',
    hora: '',
    fecha_examen: null,
    tesis: '',
    mail: '',
    nota_examen_oral: ''
  });
  const [notaDefensa, setNotaDefensa] = useState('');
  const [notaDefensaModalOpen, setNotaDefensaModalOpen] = useState(false);

  useEffect(() => {
    fetchAlumnos();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event, alumno) => {
    setAnchorEl(event.currentTarget);
    setSelectedAlumno(alumno);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAlumno(null);
  };

  const apiBaseUrl = 'https://apisst.administracionpublica-uv.cl/api/alumnos/';

  const fetchAlumnos = async () => {
    try {
      const studentsResponse = await axios.get(`${apiBaseUrl}`);
      const studentsData = studentsResponse.data || [];

      const combinedData = await Promise.all(studentsData.map(async alumno => {
        const archivosResponse = await axios.get(`https://apisst.administracionpublica-uv.cl/api/archivos/verificar/${alumno.RUT}`);
        const archivosData = archivosResponse.data;

        return {
          ...alumno,
          hasFicha: archivosData.ficha,
          hasTesis: archivosData.tesis,
          hasActa: archivosData.acta,
          hasGuia: archivosData.guia,
          hasInformante: archivosData.informante
        };
      }));

      setAlumnos(combinedData);
    } catch (error) {
      console.error('Error fetching combined alumnos data:', error);
      Swal.fire('Error', 'Ocurrió un error al obtener los datos combinados de los alumnos', 'error');
    }
  };

  const descargarTesis = async (rut) => {
    try {
      const response = await axios.get(`https://apisst.administracionpublica-uv.cl/api/archivos/descargar/tesis/${rut}`, {
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
        Swal.fire('No encontrado', 'No se encontró la tesis solicitada.', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'La tesis solicitada no existe.', 'error');
      console.error('Error descargando la tesis:', error);
    }
  };

  const handleDescargarRubrica = (tipo) => {
    if (selectedAlumno && selectedAlumno.RUT) {
      const url = `https://apisst.administracionpublica-uv.cl/api/archivos/descargar/rubrica/${tipo}/con-notas/${selectedAlumno.RUT}`;
      fetch(url)
        .then(response => {
          if (response.ok) {
            window.open(url, '_blank');
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: `La rúbrica ${tipo} no está disponible para este alumno.`,
            });
          }
        })
        .catch(error => {
          console.error(`Error al verificar la existencia de la rúbrica ${tipo}:`, error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Hubo un problema al verificar la existencia de la rúbrica ${tipo}.`,
          });
        });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, selecciona un alumno.',
      });
    }
  };

  const handleDescargarFicha = () => {
    if (selectedAlumno && selectedAlumno.RUT) {
      fetch(`https://apisst.administracionpublica-uv.cl/api/archivos/descargar/ficha/${selectedAlumno.RUT}`)
        .then(response => {
          if (response.ok) {
            window.open(`https://apisst.administracionpublica-uv.cl/api/archivos/descargar/ficha/${selectedAlumno.RUT}`, '_blank');
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'El alumno no ha subido una ficha.',
            });
          }
        })
        .catch(error => {
          console.error('Error al verificar la existencia de la ficha:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema obteniendo la ficha del alumno.',
          });
        });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, selecciona un alumno.',
      });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewAlumno({ ...newAlumno, [name]: value });
  };

  const handleDateChange = (date) => {
    setNewAlumno({ ...newAlumno, fecha_examen: date });
  };

  const handleTimeChange = (time) => {
    setNewAlumno({ ...newAlumno, hora: time });
  };

  const handleOpenModal = () => {
    Swal.fire({
      title: 'Cargando',
      text: 'Espere un momento...',
      icon: 'info',
      allowOutsideClick: false,
      showConfirmButton: false,
    });
    setTimeout(() => {
      Swal.close();
      setOpenModal(true);
    }, 1000);
  };

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
      fecha_examen: null,
      tesis: '',
      mail: '',
      nota_examen_oral: ''
    });
  };

  const handleOpenNotaDefensaModal = () => setNotaDefensaModalOpen(true);
  const handleCloseNotaDefensaModal = () => {
    setNotaDefensaModalOpen(false);
    setNotaDefensa('');
  };

  const addOrUpdateAlumno = async () => {
    try {
      const formattedAlumno = {
        ...newAlumno,
        fecha_examen: newAlumno.fecha_examen ? newAlumno.fecha_examen.toISOString() : null,
        hora: newAlumno.hora ? format(newAlumno.hora, 'HH:mm:ss') : ''
      };

      if (editMode) {
        await axios.put(`${apiBaseUrl}${newAlumno.RUT}`, formattedAlumno);
        Swal.fire('Actualizado', 'El alumno ha sido actualizado con éxito', 'success');
      } else {
        await axios.post(apiBaseUrl, formattedAlumno);
        Swal.fire('Agregado', 'El alumno ha sido agregado con éxito', 'success');
      }
      fetchAlumnos();
      handleCloseModal();
    } catch (error) {
      console.error('Error al agregar o actualizar el alumno:', error);
      Swal.fire('Error', 'Ocurrió un error al agregar o actualizar el alumno', 'error');
    }
  };

  const addNotaDefensa = async () => {
    try {
      await axios.post('https://apisst.administracionpublica-uv.cl/api/notas/examenoral', { alumno_RUT: selectedAlumno.RUT, nota_defensa: notaDefensa });
      Swal.fire('Agregada', 'La nota de defensa ha sido añadida con éxito', 'success');
      handleCloseNotaDefensaModal();
      fetchAlumnos();
    } catch (error) {
      Swal.fire('Error', 'Ocurrió un error al añadir la nota de defensa', 'error');
      console.error('Error al añadir la nota de defensa:', error);
    }
  };

  const editAlumno = (alumno) => {
    setNewAlumno({
      ...alumno,
      fecha_examen: alumno.fecha_examen ? parseISO(alumno.fecha_examen) : null,
      hora: alumno.hora ? parse(alumno.hora, 'HH:mm:ss', new Date()) : null
    });
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
        try {
          await axios.delete(`${apiBaseUrl}${RUT}`);
          fetchAlumnos();
          Swal.fire('Eliminado!', 'El alumno ha sido eliminado.', 'success');
        } catch (error) {
          console.error('Error eliminando el alumno:', error);
          Swal.fire('Error', 'Ocurrió un error al eliminar el alumno', 'error');
        }
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
      const response = await axios.get(`https://apisst.administracionpublica-uv.cl/api/archivos/descargar/acta/${rut}`, {
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
      <Button      
        onClick={handleOpenModal} 
        variant="contained"
        style={{ marginBottom: '20px', background: '#52b202'}}
      >
        <AddCircleOutlineIcon />
        {'  '}Agregar Alumno     
      </Button>
      
      {showAlumnos && (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead style={{ backgroundColor: '#cccccc', color: 'white' }}>
                <TableRow>
                  <TableCell width="200">Nombre</TableCell>
                  <TableCell width="300">RUT</TableCell>
                  <TableCell>CODIGO</TableCell>
                  <TableCell>AÑO INGRESO</TableCell>
                  <TableCell>AÑO EGRESO</TableCell>
                  <TableCell>N Resolución</TableCell>
                  <TableCell>Hora</TableCell>
                  <TableCell>Fecha Examen</TableCell>
                  <TableCell>Mail</TableCell>
                  <TableCell>Nota Examen Oral</TableCell>
                  <TableCell width="700"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alumnos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((alumno) => (
                  <TableRow key={alumno.RUT}>
                    <TableCell>{alumno.nombre}</TableCell>
                    <TableCell>{alumno.RUT}</TableCell>
                    <TableCell>{alumno.CODIGO}</TableCell>
                    <TableCell>{alumno.ANO_INGRESO}</TableCell>
                    <TableCell>{alumno.ANO_EGRESO}</TableCell>
                    <TableCell>{alumno.n_resolucion}</TableCell>
                    <TableCell>{alumno.hora}</TableCell>
                    <TableCell>{alumno.fecha_examen ? format(parseISO(alumno.fecha_examen), 'dd/MM/yyyy') : ''}</TableCell>
                    <TableCell>{alumno.mail}</TableCell>
                    <TableCell>{alumno.nota_examen_oral}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(event) => handleMenuOpen(event, alumno)}
                        color="primary"
                      >
                        <List />
                        <Typography variant="caption">ACCIONES</Typography>
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        {selectedAlumno && (
                          <>
                            <MenuItem onClick={() => editAlumno(selectedAlumno)}>
                              <Edit />
                              <Typography variant="caption">Editar</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => deleteAlumno(selectedAlumno.RUT)}>
                              <Delete />
                              <Typography variant="caption">Eliminar</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => descargarActa(selectedAlumno.RUT)}>
                              {selectedAlumno.hasActa ? (
                                <CheckCircleIcon style={{ color: 'green' }} />
                              ) : (
                                <Description />
                              )}
                              <Typography variant="caption">Descargar Acta</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => handleOpenNotaDefensaModal(selectedAlumno)}>
                              <NoteAdd />
                              <Typography variant="caption">Añadir Nota de Defensa</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => descargarTesis(selectedAlumno.RUT)}>
                              {selectedAlumno.hasTesis ? (
                                <CheckCircleIcon style={{ color: 'green' }} />
                              ) : (
                                <Description />
                              )}
                              <Typography variant="caption">Tesis</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => handleDescargarRubrica('guia')}>
                              {selectedAlumno.hasGuia ? (
                                <CheckCircleIcon style={{ color: 'green' }} />
                              ) : (
                                <Description />
                              )}
                              <Typography variant="caption">Descargar Rúbrica Guía</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => handleDescargarRubrica('informante')}>
                              {selectedAlumno.hasInformante ? (
                                <CheckCircleIcon style={{ color: 'green' }} />
                              ) : (
                                <Description />
                              )}
                              <Typography variant="caption">Descargar Rúbrica Informante</Typography>
                            </MenuItem>
                            <MenuItem onClick={handleDescargarFicha}>
                              {selectedAlumno.hasFicha ? (
                                <CheckCircleIcon style={{ color: 'green' }} />
                              ) : (
                                <Description />
                              )}
                              <Typography variant="caption">Descargar Ficha Alumno</Typography>
                            </MenuItem>
                          </>
                        )}
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={11}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', backgroundColor: '#737373', width: '100%', margin: '1', padding: '0px' }}>
                      <TablePagination
                        className="custom-pagination"
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={alumnos.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Filas por página"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </>
      )}

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            ...modalStyle,
            width: '90%',
            maxWidth: '400px',
            margin: 'auto',
            paddingBottom: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)', 
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', 
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2" marginBottom={2} sx={{ fontSize: '1.5rem' }}>
            {editMode ? 'Editar Alumno' : 'Agregar Nuevo Alumno'}
          </Typography>
          <Box
            component="form"
            sx={{ '& .MuiTextField-root': { marginBottom: '10px', width: '100%' }, mt: 2, maxHeight: '300px', overflowY: 'auto' }}
            noValidate
            autoComplete="off"
          >
            <TextField
              name="nombre"
              label="Nombre"
              value={newAlumno.nombre}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
            />
            <TextField
              name="RUT"
              label="RUT"
              value={newAlumno.RUT}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
            />
            <TextField
              name="CODIGO"
              label="Código"
              value={newAlumno.CODIGO}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
            />
            <TextField
              name="ANO_INGRESO"
              label="Año de Ingreso"
              value={newAlumno.ANO_INGRESO}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
            />
            <TextField
              name="ANO_EGRESO"
              label="Año de Egreso"
              value={newAlumno.ANO_EGRESO}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
            />
            <TextField
              name="n_resolucion"
              label="N Resolución"
              value={newAlumno.n_resolucion}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
            />
            <DatePicker
              selected={newAlumno.fecha_examen}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              customInput={<TextField fullWidth margin="dense" label="Fecha de Examen" />}
            />
            <DatePicker
              selected={newAlumno.hora}
              onChange={handleTimeChange}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Hora"
              dateFormat="HH:mm"
              customInput={<TextField fullWidth margin="dense" label="Hora de Examen" />}
            />
            <TextField
              name="tesis"
              label="Tesis"
              value={newAlumno.tesis}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
            />
            <TextField
              name="mail"
              label="Correo"
              value={newAlumno.mail}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
            />
            <TextField
              name="nota_examen_oral"
              label="Nota Examen Oral"
              value={newAlumno.nota_examen_oral}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <Button onClick={addOrUpdateAlumno} color="primary" variant="contained">
              {editMode ? 'Actualizar' : 'Agregar'}
            </Button>
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
