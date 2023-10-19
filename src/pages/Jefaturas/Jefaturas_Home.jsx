import React, { useState } from 'react';
import BackgroundTransition from "../../BackgroundTransition/BackgroundTransition";
import background1 from "../Home/components/images/imag_valparaiso.jpg";
import background2 from "../Home/components/images/imagen_2.jpg";
import background3 from "../Home/components/images/imagen_3.jpg";
import background4 from "../Home/components/images/imagen_4.jpg";
import background5 from "../Home/components/images/imagen_5.jpg";
import { 
  Box, 
  Card, 
  CardContent, 
  CardHeader, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from '@mui/material';

const Jefatura = () => {
  const [selectedProfesor, setSelectedProfesor] = useState({});

  const estudiantes = [
    { id: 1, nombre: 'Estudiante 1', rut: '11.111.111-1', añoIngreso: 2020 },
    { id: 2, nombre: 'Estudiante 2', rut: '22.222.222-2', añoIngreso: 2021 },
    { id: 3, nombre: 'Estudiante 3', rut: '33.333.333-3', añoIngreso: 2022 },
    { id: 4, nombre: 'Estudiante 4', rut: '44.444.444-4', añoIngreso: 2021 },
    { id: 5, nombre: 'Estudiante 5', rut: '55.555.555-5', añoIngreso: 2020 }
    // Puedes agregar más estudiantes según sea necesario
  ];

  const profesores = ['Profesor 1', 'Profesor 2', 'Profesor 3'];

  const handleProfesorChange = (estudianteId, event) => {
    setSelectedProfesor({ ...selectedProfesor, [estudianteId]: event.target.value });
  };

  return (
    <BackgroundTransition
        images={[
          background1,
          background2,
          background3,
          background4,
          background5,
        ]}
        duration={5000}
    >
      
    
    <Box display="flex" flexDirection="column" alignItems="center" p={3}>
      {/* Sección para Ver y Descargar Tesis */}
      <Card style={{ marginBottom: '20px', maxWidth: '800px', width: '100%' }}>
        <CardHeader title="Ver y Descargar Tesis" />
        <CardContent>
          <Button variant="contained" color="primary" href="/path-to-thesis" download>
            Descargar Tesis Ejemplo
          </Button>
        </CardContent>
      </Card>

      {/* Sección para Descargar Reportes */}
      <Card style={{ marginBottom: '20px', maxWidth: '800px', width: '100%' }}>
        <CardHeader title="Descargar Reportes" />
        <CardContent>
          <Button variant="contained" color="primary" href="/path-to-report" download>
            Descargar Reporte Ejemplo
          </Button>
        </CardContent>
      </Card>

      {/* Sección para Asignar Profesores */}
      <Card style={{ marginBottom: '20px', maxWidth: '800px', width: '100%' }}>
        <CardHeader title="Asignar Profesores a Estudiantes" />
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Alumno</TableCell>
                <TableCell>RUT</TableCell>
                <TableCell>Año Ingreso</TableCell>
                <TableCell>Asignar Profesor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {estudiantes.map((estudiante) => (
                <TableRow key={estudiante.id}>
                  <TableCell>{estudiante.nombre}</TableCell>
                  <TableCell>{estudiante.rut}</TableCell>
                  <TableCell>{estudiante.añoIngreso}</TableCell>
                  <TableCell>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id={`profesor-label-${estudiante.id}`}>Profesor</InputLabel>
                      <Select
                        labelId={`profesor-label-${estudiante.id}`}
                        id={`profesor-select-${estudiante.id}`}
                        value={selectedProfesor[estudiante.id] || ''}
                        onChange={(e) => handleProfesorChange(estudiante.id, e)}
                        label="Profesor"
                      >
                        {profesores.map((profesor) => (
                          <MenuItem key={profesor} value={profesor}>
                            {profesor}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
    </BackgroundTransition>
  );
};

export default Jefatura;
