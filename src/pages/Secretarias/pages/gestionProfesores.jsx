import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Modal, Box, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import DashBoard from '../Dashboard/DashBoard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import { Edit } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { Select, MenuItem } from '@mui/material';
import { TableFooter } from '@mui/material';

function TableDataProfesores() {
  const [profesores, setProfesores] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [newProfesor, setNewProfesor] = useState({
    nombre: '',
    mail: '',
  });
  const [openModal, setOpenModal] = useState(false);
  const [showProfesores, setShowProfesores] = useState(true);

  useEffect(() => {
    fetchProfesores();
  }, []);

  const apiBaseUrl = 'https://localhost:4000/api/profesores';

  const fetchProfesores = async () => {
    try {
      const response = await axios.get(apiBaseUrl);
      setProfesores(response.data || []);
    } catch (error) {
      console.error('Error fetching profesores:', error);
      setProfesores([]);
    }
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...profesores];
    list[index][name] = value;
    setProfesores(list);
  };

  const handleNewInputChange = (e) => {
    const { name, value } = e.target;
    setNewProfesor({ ...newProfesor, [name]: value });
  };

  const addProfesor = async () => {
    try {
      const response = await axios.post(apiBaseUrl, newProfesor);
      if (response.data) {
        fetchProfesores();
        setNewProfesor({
          nombre: '',
          mail: '',
        });
        setOpenModal(false);
        Swal.fire('Agregado', 'El profesor ha sido agregado con éxito', 'success');
      }
    } catch (error) {
      console.error('Error adding profesor:', error);
    }
  };

  const updateProfesor = async (index) => {
    const profesor = profesores[index];
    try {
      const response = await axios.put(`${apiBaseUrl}/${profesor.profesor_id}`, profesor);
      if (response.data) {
        setEditingIndex(-1);
        fetchProfesores();
        Swal.fire('Actualizado', 'El profesor ha sido actualizado con éxito', 'success');
      }
    } catch (error) {
      console.error('Error updating profesor:', error);
    }
  };

  const deleteProfesor = async (profesor_id) => {
    if (profesor_id) {
      try {
        const result = await Swal.fire({
          title: '¿Estás seguro?',
          text: 'No podrás revertir esto.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, eliminarlo'
        });

        if (result.isConfirmed) {
          const response = await axios.delete(`${apiBaseUrl}/${profesor_id}`);
          if (response.status === 200) {
            fetchProfesores();
            Swal.fire('Eliminado', 'El profesor ha sido eliminado con éxito', 'success');
          }
        }
      } catch (error) {
        console.error('Error deleting profesor:', error);
      }
    } else {
      console.error('Attempted to delete a profesor with undefined profesor_id');
    }
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
    setNewProfesor({
      nombre: '',
      mail: '',
    });
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

  const toggleShowProfesores = () => {
    setShowProfesores(!showProfesores);
    if (!showProfesores) fetchProfesores();
  };

  const [rowsPerPage, setRowsPerPage] = useState(5); // Estado para la cantidad de filas por página

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
  };

  return (
    <>
    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px' }}>
      <Button      
        onClick={handleOpenModal} 
        variant="contained"
         style={{ marginBottom: '20px', background: '#52b202'}}>
        <AddCircleOutlineIcon />
        {'  '}Agregar Alumno     
      </Button>
      </div>
      <DashBoard/>
      <>
      {showProfesores && (
        <TableContainer component={Paper} style={{ width: '50%', float: 'right', marginRight: '10px' }}>
          <Table size="small">
            <TableHead style={{ backgroundColor: '#cccccc', color: 'white', paddingTop: '20px', paddingBottom: '20px' }}>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {profesores.slice(0, rowsPerPage).map((profesor, index) =>
                editingIndex === index ? (
                  <TableRow key={`editing-${profesor.profesor_id}`}>
                    <TableCell>
                      <TextField
                        name="nombre"
                        value={profesor.nombre}
                        onChange={(e) => handleInputChange(e, index)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="mail"
                        value={profesor.mail}
                        onChange={(e) => handleInputChange(e, index)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => updateProfesor(index)}><SaveIcon/></Button>
                      <Button onClick={() => setEditingIndex(-1)}><CancelIcon/></Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={profesor.profesor_id}>
                    <TableCell>{profesor.nombre}</TableCell>
                    <TableCell>{profesor.mail}</TableCell>
                    <TableCell>
                      <Button onClick={() => setEditingIndex(index)}>
                        <EditIcon style={{ color: 'inherit' }}/>
                      </Button>
                      <Button onClick={() => deleteProfesor(profesor.profesor_id)}>
                        <DeleteIcon style={{ color: 'red' }}/>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
          {/* Selección de cantidad de filas */}
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <Select
                    value={rowsPerPage}
                    onChange={handleChangeRowsPerPage}
                    style={{ width: '100%', marginBottom: '10px' }}
                  >
                    <MenuItem value={5}>5 filas</MenuItem>
                    <MenuItem value={10}>10 filas</MenuItem>
                    <MenuItem value={20}>20 filas</MenuItem>
                  </Select>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </TableContainer>
      )}
    </>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-title" variant="h6" component="h2" marginBottom={2}>
            Agregar Nuevo Profesor
          </Typography>
          <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' }, mt: 2 }}
            noValidate
            autoComplete="off"
          >
            <TextField
              name="nombre"
              label="Nombre"
              value={newProfesor.nombre}
              onChange={handleNewInputChange}
              fullWidth
              margin="dense"
            />
            <TextField
              name="mail"
              label="Email"
              value={newProfesor.mail}
              onChange={handleNewInputChange}
              fullWidth
              margin="dense"
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button onClick={addProfesor} color="primary" variant="contained">
                Agregar
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default TableDataProfesores;