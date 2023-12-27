import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import BackgroundTransition from '../../BackgroundTransition/BackgroundTransition';
import background1 from '../Home/components/images/imag_valparaiso.jpg';
import background2 from '../Home/components/images/imagen_2.jpg';
import background3 from '../Home/components/images/imagen_3.jpg';
import background4 from '../Home/components/images/imagen_4.jpg';
import background5 from '../Home/components/images/imagen_5.jpg';

import TableData from './TableDatas'; // Importa el componente TableData

function AcademicosView() {
  const [titulados, setTitulados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          }}
        >
          <Paper sx={{ padding: '20px', marginBottom: '20px', width: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Academicos
            </Typography>
            <TableData titulados={titulados} />
          </Paper>
        </Box>
      </Container>
    </BackgroundTransition>
  );
}

export default AcademicosView;


