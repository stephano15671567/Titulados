import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BackgroundTransition from '../../BackgroundTransition/BackgroundTransition';
import background1 from '../Home/components/images/imag_valparaiso.jpg';
import background2 from '../Home/components/images/imagen_2.jpg';
import background3 from '../Home/components/images/imagen_3.jpg';
import background4 from '../Home/components/images/imagen_4.jpg';
import background5 from '../Home/components/images/imagen_5.jpg';

function SecretariaView() {
  const [titulados, setTitulados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/titulados/alumnosTitulados')
      .then((response) => {
        if (response.ok && response.headers.get('Content-Type').includes('application/json')) {
          return response.json();
        }
        throw new Error('La respuesta no es JSON: ' + response.statusText);
      })
      .then((data) => {
        setTitulados(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert('Por favor selecciona un archivo para subir');
      return;
    }
  
    const formData = new FormData();
    formData.append('myFile', selectedFile);
  
    try {
      await axios.post('http://localhost:4000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Archivo subido con éxito');
      // Aquí puedes implementar lógica adicional tras una carga exitosa
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      alert('Error al subir el archivo');
    }
  };
  

  const buttonSx = {
    mt: 2,
    mb: 2,
    bgcolor: "rgba(0, 60, 88, 1)",
    '&:hover': {
      bgcolor: "rgba(0, 70, 100, 1)"
    },
    color: 'white'
  };

  const reportUrl = 'http://localhost:4000/path-to-report'; // Reemplazar con el enlace correcto al reporte

  if (loading) {
    return <Typography>Cargando...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error.message}</Typography>;
  }

  return (
    <BackgroundTransition images={[background1, background2, background3, background4, background5]} duration={5000}>
      <Container maxWidth="md">
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "20px",
          fontFamily: "Times New Roman",
        }}>
          <Paper sx={{
            padding: "20px",
            textAlign: "center",
            marginBottom: "20px",
            width: "100%",
            maxWidth: "1000px",
            bgcolor: "lightgray",
            borderRadius: "10px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          }}>
            {/* Componente para seleccionar el archivo */}
            <input type="file" onChange={handleFileChange} accept=".xlsx, .xls, .csv" style={{ margin: "20px 0" }} />
            
            {/* Botón para cargar el archivo */}
            <Button variant="contained" fullWidth sx={buttonSx} onClick={handleFileUpload}>
              Subir Archivo
            </Button>
            <Typography variant="h5" gutterBottom>
              Secretaría - Administración de Tesis y Documentos
            </Typography>
            
            <Link to="/ver-tesis" style={{ textDecoration: "none" }}>
              <Button variant="contained" fullWidth sx={buttonSx}>
                Ver Tesis
              </Button>
            </Link>

            <Link to="/generar-actas" style={{ textDecoration: "none" }}>
              <Button variant="contained" fullWidth sx={buttonSx}>
                Generar Actas
              </Button>
            </Link>

            <Link to="/generar-comision" style={{ textDecoration: "none" }}>
              <Button variant="contained" fullWidth sx={buttonSx}>
                Generar Comisión
              </Button>
            </Link>

            {/* Botón para ver el reporte */}
            <a href={reportUrl} style={{ textDecoration: "none" }} download>
              <Button variant="contained" fullWidth sx={buttonSx}>
                Ver Reporte
              </Button>
            </a>

            <TableContainer component={Paper}>
              <Table aria-label="lista de titulados">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Alumno</TableCell>
                    <TableCell>RUT</TableCell>
                    {/* Añade más celdas de encabezado según sea necesario */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {titulados.map((titulado) => (
                    <TableRow key={titulado.id}>
                      <TableCell>{titulado.id}</TableCell>
                      <TableCell>{titulado.alumno}</TableCell>
                      <TableCell>{titulado.rut}</TableCell>
                      {/* Añade más celdas con datos según sea necesario */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Container>
    </BackgroundTransition>
  );
}

export default SecretariaView;


