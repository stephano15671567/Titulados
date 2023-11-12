import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Link } from 'react-router-dom';
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

  useEffect(() => {
    fetch('http://localhost:4000/api/alumnosTitulados')
      .then((response) => {
        // Verifica si la respuesta es exitosa y si el contenido es tipo JSON
        if (response.ok && response.headers.get('Content-Type').includes('application/json')) {
          return response.json();
        }
        // Si la respuesta no es exitosa, lanza un error
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

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "Times New Roman",
  };

  const paperStyle = {
    padding: "20px",
    textAlign: "center",
    marginBottom: "20px",
    width: "100%",
    maxWidth: "1000px",
    background: "lightgray",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  };

  const buttonStyle = {
    background: "rgba(0, 60, 88, 1)",
    marginTop: "20px",
    display: "block"
  };

  if (loading) {
    return <Typography>Cargando...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error.message}</Typography>;
  }

  return (
    <BackgroundTransition images={[background1, background2, background3, background4, background5]} duration={5000}>
      <Container maxWidth="md">
        <Box style={containerStyle}>
          <Paper elevation={3} style={paperStyle}>
            <Typography variant="h5" gutterBottom>
              Ver Tesis
            </Typography>
            <Typography variant="body1">
              Ver la lista de tesis y su estado.
            </Typography>
            <Link to="/ver-tesis" style={{ textDecoration: "none" }}>
              <Button variant="contained" color="primary" fullWidth style={buttonStyle}>
                Ver Tesis
              </Button>
            </Link>
            {/* ... otros botones y funcionalidades ... */}
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Alumno</TableCell>
                    <TableCell>RUT</TableCell>
                    {/* ... más celdas de encabezado ... */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {titulados.map((titulado) => (
                    <TableRow key={titulado.id}>
                      <TableCell>{titulado.id}</TableCell>
                      <TableCell>{titulado.alumno}</TableCell>
                      <TableCell>{titulado.rut}</TableCell>
                      {/* ... más celdas con datos ... */}
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
