import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';

import BackgroundTransition from '../../BackgroundTransition/BackgroundTransition';
import background1 from '../Home/components/images/imag_valparaiso.jpg';
import background2 from '../Home/components/images/imagen_2.jpg';
import background3 from '../Home/components/images/imagen_3.jpg';
import background4 from '../Home/components/images/imagen_4.jpg';
import background5 from '../Home/components/images/imagen_5.jpg';



function AcademicosView() {
  
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
              Nota Guia
            </Typography>
            
          </Paper>
          
        </Box>
      </Container>
    </BackgroundTransition>
  );
}

export default AcademicosView;


