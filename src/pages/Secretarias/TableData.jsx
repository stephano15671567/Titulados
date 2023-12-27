import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';

function TableData() {
  const [alumnos, setAlumnos] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
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
    mail: '',
    Gtoken: ''
  });

  useEffect(() => {
    fetchAlumnos();
  }, []);

  const apiBaseUrl = 'http://localhost:4000/api/alumnos'; // Asegúrate de que esta URL sea correcta según tu servidor

  const fetchAlumnos = async () => {
    try {
      const response = await axios.get(apiBaseUrl);
      setAlumnos(response.data || []);
    } catch (error) {
      console.error('Error al cargar alumnos:', error);
      setAlumnos([]);
    }
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...alumnos];
    list[index][name] = value;
    setAlumnos(list);
  };

  const handleNewInputChange = (e) => {
    const { name, value } = e.target;
    setNewAlumno({ ...newAlumno, [name]: value });
  };

  const addAlumno = async () => {
    try {
      const response = await axios.post(apiBaseUrl, newAlumno);
      if (response.data) {
        fetchAlumnos();
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
          mail: '',
          Gtoken: ''
        });
      }
    } catch (error) {
      console.error('Error al agregar alumno:', error);
    }
  };

  const updateAlumno = async (index) => {
    const alumno = alumnos[index];
    try {
      const response = await axios.put(`${apiBaseUrl}/${alumno.RUT}`, alumno);
      if (response.data) {
        fetchAlumnos();
        setEditingIndex(-1);
      }
    } catch (error) {
      console.error('Error al actualizar alumno:', error);
    }
  };

  const deleteAlumno = async (RUT) => {
    try {
      await axios.delete(`${apiBaseUrl}/${RUT}`);
      fetchAlumnos();
    } catch (error) {
      console.error('Error al eliminar alumno:', error);
    }
  };

  const renderEditableRow = (alumno, index) => (
    <TableRow key={index}>
      {Object.keys(newAlumno).map((key) => (
        <TableCell key={key}>
          <TextField
            name={key}
            value={alumno[key]}
            onChange={(e) => handleInputChange(e, index)}
          />
        </TableCell>
      ))}
      <TableCell>
        <Button onClick={() => updateAlumno(index)}>Guardar</Button>
        <Button onClick={() => setEditingIndex(-1)}>Cancelar</Button>
      </TableCell>
    </TableRow>
  );

  const renderAddRow = () => (
    <TableRow>
      {Object.keys(newAlumno).map((key) => (
        <TableCell key={key}>
          <TextField
            name={key}
            value={newAlumno[key]}
            onChange={handleNewInputChange}
          />
        </TableCell>
      ))}
      <TableCell>
        <Button onClick={addAlumno}>Agregar</Button>
      </TableCell>
    </TableRow>
  );

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {Object.keys(newAlumno).map((key) => (
              <TableCell key={key}>{key.replace('_', ' ').toUpperCase()}</TableCell>
            ))}
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {alumnos.map((alumno, index) =>
            editingIndex === index ? (
              renderEditableRow(alumno, index)
            ) : (
              <TableRow key={index}>
                {Object.keys(newAlumno).map((key) => (
                  <TableCell key={key}>{alumno[key]}</TableCell>
                ))}
                <TableCell>
                  <Button onClick={() => setEditingIndex(index)}>Editar</Button>
                  <Button onClick={() => deleteAlumno(alumno.RUT)}>Eliminar</Button>
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

export default TableData;







