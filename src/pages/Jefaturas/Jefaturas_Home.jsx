
import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import BackgroundTransition from '../../BackgroundTransition/BackgroundTransition';
import background1 from '../Home/components/images/imag_valparaiso.jpg';
import background2 from '../Home/components/images/imagen_2.jpg';
import background3 from '../Home/components/images/imagen_3.jpg';
import background4 from '../Home/components/images/imagen_4.jpg';
import background5 from '../Home/components/images/imagen_5.jpg';
import FileUploads from './FileUploads'; // Asegúrate de que la ruta sea correcta
import TableData from './TableDatass'; // Importa el componente TableData


const Jefatura = () => {
  const [titulados, setTitulados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://apisst.administracionpublica-uv.cl/api/titulados/alumnosTitulados')
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

  const buttonSx = {
    mt: 2,
    mb: 2,
    bgcolor: 'rgba(0, 60, 88, 1)',
    '&:hover': {
      bgcolor: 'rgba(0, 70, 100, 1)',
    },
    color: 'white',
  };

  const reportUrl = 'https://apisst.administracionpublica-uv.cl/path-to-report'; // Reemplazar con el enlace correcto al reporte

  if (loading) {
    return <Typography>Cargando...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error.message}</Typography>;
  }

  return (
    <BackgroundTransition images={[background1, background2, background3, background4, background5]} duration={5000}>
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '20px',
            fontFamily: 'Times New Roman',
          }}
        >
          <Paper
            sx={{
              padding: '20px',
              textAlign: 'center',
              marginBottom: '20px',
              width: '100%',
              maxWidth: '1000px',
              bgcolor: 'lightgray',
              borderRadius: '10px',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            <Typography variant="h5" gutterBottom>
              Secretaría - Administración de Tesis y Documentos
            </Typography>
            <FileUploads buttonSx={buttonSx} />

            <Link to="/ver-tesis" style={{ textDecoration: 'none' }}>
              <Button variant="contained" fullWidth sx={buttonSx}>
                Ver Tesis
              </Button>
            </Link>

            <Link to="/generar-actas" style={{ textDecoration: 'none' }}>
              <Button variant="contained" fullWidth sx={buttonSx}>
                Generar Actas
              </Button>
            </Link>

            <Link to="/generar-comision" style={{ textDecoration: 'none' }}>
              <Button variant="contained" fullWidth sx={buttonSx}>
                Generar Comisión
              </Button>
            </Link>

            <a href={reportUrl} style={{ textDecoration: 'none' }} download>
              <Button variant="contained" fullWidth sx={buttonSx}>
                Ver Reporte
              </Button>
            </a>

            {/* Utiliza el componente TableData */}
            <TableData titulados={titulados} />
          </Paper>
        </Box>
      </Container>
    </BackgroundTransition>
  );
}
export default Jefatura;




