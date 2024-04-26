import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Modal, Box, Typography } from '@mui/material';
import Swal from 'sweetalert2';


function TableDataProfesores() {
  const [profesores, setProfesores] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [newProfesor, setNewProfesor] = useState({
    nombre: '',
    mail: '',
  });
  const [openModal, setOpenModal] = useState(false);
  const [showProfesores, setShowProfesores] = useState(false);

  useEffect(() => {
    fetchProfesores();
  }, []);

s
  const fetchProfesores = async () => {
    try {
      const response = await axios.get(`https://apisst.administracionpublica-uv.cl/api/profesores`);
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
      const response = await axios.post(`https://apisst.administracionpublica-uv.cl/api/profesores`, newProfesor);
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
      const response = await axios.put(`https://apisst.administracionpublica-uv.cl/api/${profesor.profesor_id}`, profesor);
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
          const response = await axios.delete(`https://apisst.administracionpublica-uv.cl/api/${profesor_id}`);
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

  const handleOpenModal = () => setOpenModal(true);
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

  return (
    <>
      <Button onClick={handleOpenModal} color="primary" variant="contained" style={{ marginBottom: '20px' }}>Agregar Profesor</Button>
      <Button onClick={toggleShowProfesores} color="secondary" variant="contained" style={{ marginBottom: '20px', marginLeft: '20px' }}>
        {showProfesores ? 'Ocultar Profesores' : 'Visualizar Profesores'}
      </Button>

      {showProfesores && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {profesores.map((profesor, index) =>
                editingIndex === index ? (
                  <TableRow key={`editing-${profesor.profesor_id}`}>
                    <TableCell>
                      <TextField
                        name="nombre"
                        value={profesor.nombre}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="mail"
                        value={profesor.mail}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => updateProfesor(index)}>Guardar</Button>
                      <Button onClick={() => setEditingIndex(-1)}>Cancelar</Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={profesor.profesor_id}>
                    <TableCell>{profesor.nombre}</TableCell>
                    <TableCell>{profesor.mail}</TableCell>
                    <TableCell>
                      <Button onClick={() => setEditingIndex(index)}>Editar</Button>
                      <Button onClick={() => deleteProfesor(profesor.profesor_id)}>Eliminar</Button>
                    </TableCell>
                  </TableRow>
                )
              )}
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