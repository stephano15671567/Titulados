import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Select, MenuItem } from '@mui/material';

function Asignaciones() {
    const [alumnos, setAlumnos] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [assignments, setAssignments] = useState({}); // { [alumnoId]: { profesorId, rol } }

    useEffect(() => {
        fetchAlumnos();
        fetchProfesores();
    }, []);

    const fetchAlumnos = async () => {
        const response = await axios.get('/api/alumnos');
        setAlumnos(response.data);
    };

    const fetchProfesores = async () => {
        const response = await axios.get('/api/profesores');
        setProfesores(response.data);
    };

    const handleProfessorChange = (alumnoId, profesorId) => {
        setAssignments(prev => ({
            ...prev,
            [alumnoId]: { ...prev[alumnoId], profesorId }
        }));
    };

    const handleRoleChange = (alumnoId, rol) => {
        setAssignments(prev => ({
            ...prev,
            [alumnoId]: { ...prev[alumnoId], rol }
        }));
    };

    const handleAssign = async (alumnoId) => {
        const assignment = assignments[alumnoId];
        try {
            const response = await axios.post('/api/asignaciones', {
                alumnoId,
                profesorId: assignment.profesorId,
                rol: assignment.rol
            });
            // Handle success
            console.log('Asignación creada:', response.data);
            // Aquí podrías actualizar el estado o la interfaz de usuario según la respuesta
        } catch (error) {
            // Handle error
            console.error('Error al crear asignación:', error.response.data);
            // Aquí podrías mostrar un mensaje de error en la interfaz de usuario
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Alumno</TableCell>
                        <TableCell>Profesor</TableCell>
                        <TableCell>Rol</TableCell>
                        <TableCell>Asignar</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {alumnos.map(alumno => (
                        <TableRow key={alumno.RUT}>
                            <TableCell>{alumno.nombre}</TableCell>
                            <TableCell>
                                <Select
                                    value={assignments[alumno.RUT]?.profesorId || ''}
                                    onChange={(e) => handleProfessorChange(alumno.RUT, e.target.value)}
                                >
                                    {profesores.map(profesor => (
                                        <MenuItem key={profesor.profesor_id} value={profesor.profesor_id}>
                                            {profesor.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </TableCell>
                            <TableCell>
                                <Select
                                    value={assignments[alumno.RUT]?.rol || ''}
                                    onChange={(e) => handleRoleChange(alumno.RUT, e.target.value)}
                                >
                                    <MenuItem value="guia">Guía</MenuItem>
                                    <MenuItem value="informante">Informante</MenuItem>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <Button
                                    onClick={() => handleAssign(alumno.RUT)}
                                    variant="contained"
                                >
                                    Asignar
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default Asignaciones;
