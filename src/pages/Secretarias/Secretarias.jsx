import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";

function Secretarias() {
  const [selectedProfesor, setSelectedProfesor] = useState({});
  const [file, setFile] = useState(null);
  const [thesisFile, setThesisFile] = useState(null);

  const estudiantes = [
    { id: 1, nombre: 'Estudiante 1', rut: '11.111.111-1', añoIngreso: 2020 },
    { id: 2, nombre: 'Estudiante 2', rut: '22.222.222-2', añoIngreso: 2021 },
    { id: 3, nombre: 'Estudiante 3', rut: '33.333.333-3', añoIngreso: 2022 },
    { id: 4, nombre: 'Estudiante 4', rut: '44.444.444-4', añoIngreso: 2021 },
    { id: 5, nombre: 'Estudiante 5', rut: '55.555.555-5', añoIngreso: 2020 }
  ];

  const profesores = ['Profesor 1', 'Profesor 2', 'Profesor 3'];

  const handleProfesorChange = (estudianteId, event) => {
    setSelectedProfesor({ ...selectedProfesor, [estudianteId]: event.target.value });
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleThesisFileChange = (event) => {
    setThesisFile(event.target.files[0]);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={3}>
      {/* Nuevo Card para subir tesis */}
      <Card style={{ marginBottom: '20px', maxWidth: '800px', width: '100%' }}>
        <CardHeader title="Subir Tesistas" />
        <CardContent>
          <input type="file" onChange={handleThesisFileChange} />
          <Button 
            variant="contained" 
            style={{ backgroundColor: 'rgba(0, 60, 88, 1)', color: '#fff' }} 
            onClick={() => alert(`Tesis ${thesisFile ? thesisFile.name : ''} subida!`)}
          >
            Subir Tesistas
          </Button>
        </CardContent>
      </Card>

      {/* Botón para descargar la tesis */}
      <Card style={{ marginBottom: '20px', maxWidth: '800px', width: '100%' }}>
        <CardHeader title="Descargar Tesis" />
        <CardContent>
          <Button 
            variant="contained" 
            style={{ backgroundColor: 'rgba(0, 60, 88, 1)', color: '#fff' }} 
            href="/path-to-thesis" 
            download
          >
            Descargar Tesis
          </Button>
        </CardContent>
      </Card>

      {/* Botón para descargar el reporte */}
      <Card style={{ marginBottom: '20px', maxWidth: '800px', width: '100%' }}>
        <CardHeader title="Descargar Reporte" />
        <CardContent>
          <Button 
            variant="contained" 
            style={{ backgroundColor: 'rgba(0, 60, 88, 1)', color: '#fff' }} 
            href="/path-to-report" 
            download
          >
            Descargar Reporte
          </Button>
        </CardContent>
      </Card>

      {/* Input para cargar el archivo del acta y la comisión */}
      <Card style={{ marginBottom: '20px', maxWidth: '800px', width: '100%' }}>
        <CardHeader title="Cargar Acta y Comisión" />
        <CardContent>
          <input type="file" onChange={handleFileChange} />
          <Button 
            variant="contained" 
            style={{ backgroundColor: 'rgba(0, 60, 88, 1)', color: '#fff' }} 
            onClick={() => alert(`Archivo ${file ? file.name : ''} cargado!`)}
          >
            Cargar Archivo
          </Button>
        </CardContent>
      </Card>

      {/* Tabla para asignar profesores a estudiantes */}
      <Card style={{ maxWidth: '800px', width: '100%' }}>
        <CardHeader title="Asignar Profesores" />
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
  );
};

export default Secretarias;
