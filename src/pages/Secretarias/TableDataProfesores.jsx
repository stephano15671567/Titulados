import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';

function TableDataProfesores() {
  const [profesores, setProfesores] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [newProfesor, setNewProfesor] = useState({
    nombre: '',
    mail: '',
    
  });

  useEffect(() => {
    fetchProfesores();
  }, []);

  const apiBaseUrl = 'http://localhost:4000/api/profesores'; 

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
      }
    } catch (error) {
      console.error('Error adding profesor:', error);
    }
  };

  const updateProfesor = async (index) => {
    const profesor = profesores[index];
    try {
      const response = await axios.put(`${apiBaseUrl}/${profesor.id}`, profesor);
      if (response.data) {
        setEditingIndex(-1);
        fetchProfesores();
      }
    } catch (error) {
      console.error('Error updating profesor:', error);
    }
  };

  const deleteProfesor = async (id) => {
    try {
      const response = await axios.delete(`${apiBaseUrl}/${id}`);
      if (response.data) {
        fetchProfesores();
      }
    } catch (error) {
      console.error('Error deleting profesor:', error);
    }
  };

  const renderEditableRow = (profesor, index) => (
    <TableRow key={`editable-${index}`}>
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
  );

  const renderAddRow = () => (
    <TableRow key="new-profesor">
      <TableCell>
        <TextField
          name="nombre"
          value={newProfesor.nombre}
          onChange={handleNewInputChange}
        />
      </TableCell>
      <TableCell>
        <TextField
          name="mail"
          value={newProfesor.mail}
          onChange={handleNewInputChange}
        />
      </TableCell>
      <TableCell>
        <Button onClick={addProfesor}>Agregar</Button>
      </TableCell>
    </TableRow>
  );

  return (
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
              renderEditableRow(profesor, index)
            ) : (
              <TableRow key={profesor.id}>
                <TableCell>{profesor.nombre}</TableCell>
                <TableCell>{profesor.mail}</TableCell>
                <TableCell>
                  <Button onClick={() => setEditingIndex(index)}>Editar</Button>
                  <Button onClick={() => deleteProfesor(profesor.id)}>Eliminar</Button>
                </TableCell>
              </TableRow>
            )
          )}
          {renderAddRow()}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TableDataProfesores;
