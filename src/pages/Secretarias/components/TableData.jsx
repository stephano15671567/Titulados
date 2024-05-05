import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Modal, Box, Typography, IconButton, Grid, TablePagination, TableFooter } from '@mui/material';
import { Edit, Delete, Description, Visibility, NoteAdd } from '@mui/icons-material';
import Swal from 'sweetalert2';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListIcon from '@mui/icons-material/List';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import './styles.css';

function TableData() {
  const [alumnos, setAlumnos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showAlumnos, setShowAlumnos] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null); // Estado para controlar el menú desplegable
  const [selectedAlumno, setSelectedAlumno] = useState([null]); // Alumno seleccionado para las acciones
  //SELECTOR POR PAGINAS
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

  //Enumerador de paginas

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //Menu desplegable
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

      const gradesResponse = await axios.get(`https://apisst.administracionpublica-uv.cl/api/notas/`);
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
    const response = await axios.get(`https://localhost:4000/api/archivos/descargar/tesis/${rut}`, {
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
    Swal.fire('Error', 'La tesis solicitada no existe.', 'error');
    console.error('Error descargando la tesis:', error);
  }
};

const handleDescargarRubrica = () => {
  // Verificar si existe la rubrica
  if (selectedAlumno && selectedAlumno.RUT) {
    fetch(`https://apisst.administracionpublica-uv.cl/api/archivos/descargar/rubrica/guia/con-notas/${selectedAlumno.RUT}`)
      .then(response => {
        if (response.ok) {
          // Si la rubrica existe, abrir el enlace
          window.open(`https://apisst.administracionpublica-uv.cl/api/archivos/descargar/rubrica/guia/con-notas/${selectedAlumno.RUT}`, '_blank');
        } else {
          // Si la rubrica no existe, mostrar un mensaje de error
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'La rúbrica no está disponible para este alumno.',
          });
        }
      })
      .catch(error => {
        console.error('Error al verificar la existencia de la rúbrica:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al verificar la existencia de la rúbrica.',
        });
      });
  } else {
    // Si no se ha seleccionado ningún alumno, mostrar un mensaje de error
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

  const handleOpenModal = () => {
    
    // Aquí puedes mostrar la ventana emergente de carga
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
      // Aquí puedes mostrar la ventana emergente de carga
      
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
         style={{ marginBottom: '20px', background: '#52b202'}}>
        <AddCircleOutlineIcon />
        {'  '}Agregar Alumno     
      </Button>
      

      {showAlumnos && (
        <>
        <TableContainer component={Paper} >
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
                  <TableCell>{alumno.fecha_examen}</TableCell>
                  <TableCell>{alumno.mail}</TableCell>
                  <TableCell>{alumno.nota_examen_oral}</TableCell>
                  <TableCell>
                  <IconButton
                    onClick={(event) => handleMenuOpen(event, alumno)}
                    color="primary"
                  >
                    <ListIcon />
                    <Typography variant="caption">ACCIONES</Typography>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={() => editAlumno(selectedAlumno)}>
                      <Edit />
                      <Typography variant="caption">Editar</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => deleteAlumno(selectedAlumno.RUT)}>
                      <Delete />
                      <Typography variant="caption">Eliminar</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => descargarActa(selectedAlumno.RUT)}>
                      <Description />
                      <Typography variant="caption">Descargar Acta</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => handleOpenNotaDefensaModal(selectedAlumno)}>
                      <NoteAdd />
                      <Typography variant="caption">Añadir Nota de Defensa</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => descargarTesis(selectedAlumno.RUT)}>
                      <Description />
                      <Typography variant="caption">Tesis</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleDescargarRubrica}>
                      <Description />
                      <Typography variant="caption">Descargar Rúbrica Guía</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleDescargarRubrica}>
                        <Description />
                      <Typography variant="caption">Descargar Rúbrica Informante</Typography>
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
          <TableRow>
            <TableCell colSpan={11}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', backgroundColor: '#737373', width: '100%', margin: '1',padding: '0px' }}>
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
            backgroundColor: 'rgba(255, 255, 255, 0.9)', // Fondo semitransparente
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', // Sombra suave para efecto de capas
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
          {Object.keys(newAlumno).map((key) => (
            <TextField
              key={key}
              name={key}
              label={key.toUpperCase().replace('_', ' ')}
              value={newAlumno[key]}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
              InputProps={{ style: { fontSize: '0.8rem' } }} // Tamaño de fuente más pequeño
            />
          ))}
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