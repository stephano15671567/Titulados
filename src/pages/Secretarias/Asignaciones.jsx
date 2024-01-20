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
        fetchAsignaciones(); 
    }, []);

    
    useEffect(() => {
        // Ensure that both alumnos and profesores are fetched before fetching asignaciones
        if (alumnos.length > 0 && profesores.length > 0) {
            fetchAsignaciones();
        }
    }, [alumnos, profesores]); 
    
    //CHANGE TO FULL CRUD TABLEEEEEEEE

    const fetchAsignaciones = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/asignaciones');
            const enrichedAsignaciones = response.data.map(asignacion => {
                const alumno = alumnos.find(al => al.RUT === asignacion.alumno_RUT) || {};
                const profesor = profesores.find(pr => pr.profesor_id === asignacion.profesor_id) || {};
                return { ...asignacion, alumnoNombre: alumno.nombre, profesorNombre: profesor.nombre };
            });
            setAssignments(enrichedAsignaciones);
            console.log(enrichedAsignaciones)
        } catch (error) {
            console.error('Error fetching asignaciones:', error);
            // Handle error appropriately
        }
    };
         //SE QUEDA
    const fetchAlumnos = async () => {
        const response = await axios.get('http://localhost:4000/api/alumnos');
        setAlumnos(response.data);
    };
             //SE QUEDA
    const fetchProfesores = async () => {
        const response = await axios.get('http://localhost:4000/api/profesores');
        setProfesores(response.data);
    };

    //AQUÍ LUEGO IRÁ EL UPDATE
    const handleProfessorChange = (alumnoId, profesorId) => {
        setAssignments(prev => ({
            ...prev,
            [alumnoId]: { ...prev[alumnoId], profesorId }
        }));
    };

    //AQUÍ LUEGO IRÁ EL UPDATE
    const handleRoleChange = (alumnoId, rol) => {
        setAssignments(prev => ({
            ...prev,
            [alumnoId]: { ...prev[alumnoId], rol }
        }));
    };

    const handleAssign = async (alumnoId) => {
        const assignment = assignments[alumnoId];
        try {
            const response = await axios.post('http://localhost:4000/api/asignaciones', {
                alumnoId,
                profesorId: assignment.profesorId,
                rol: assignment.rol
            });
            console.log('Asignación creada:', response.data);
            // Aquí podrías actualizar el estado o la interfaz de usuario según la respuesta
        } catch (error) {
            // Handle error
            console.error('Error al crear asignación:', error.response.data);
            //Renderizar modal mwajaja
            alert('Alumno ya asignado a profesor: ')
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
                                    <MenuItem value="gyf">Guía y Informante</MenuItem>

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

/* 

TABLA DEPRECATED

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
                                    <MenuItem value="gyf">Guía y Informante</MenuItem>

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

*/