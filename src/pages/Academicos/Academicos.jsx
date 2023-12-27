import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Box, TextField, Button, Paper, Typography } from '@mui/material';

import background1 from "../Home/components/images/imag_valparaiso.jpg";
import background2 from "../Home/components/images/imagen_2.jpg";
import background3 from "../Home/components/images/imagen_3.jpg";
import background4 from "../Home/components/images/imagen_4.jpg";
import background5 from "../Home/components/images/imagen_5.jpg";
import BackgroundTransition from "../../BackgroundTransition/BackgroundTransition";

function Titulados() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/login/profesores/logins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo: username, contraseña: password }),
      });

      if (response.ok) {
        const { token } = await response.json();
        sessionStorage.setItem('token', token); // Almacenar el token en sessionStorage
        navigate('/AcademicosHome'); // Navegar al dashboard
      } else {
        alert('Inicio de sesión fallido. Por favor, verifica tus credenciales.');
      }
    } catch (error) {
      alert('Error al conectarse con el servidor.');
    }
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "20px",  
  };

  const formContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "20px",
    background: "lightgray",
    padding: "20px",
    width: "100%",
    maxWidth: "600px",   
  };

  const leftTextStyle = {
    fontSize: "15px",  
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
      <Box style={containerStyle}>
        <Paper elevation={3} style={formContainerStyle}>
          <Typography variant="body1" style={leftTextStyle}>
            <br />
          </Typography>
          <Typography variant="h5" align="center" gutterBottom>
            Iniciar Sesión 
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              label="Nombre de Usuario"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              margin="normal"
              size="large"        
            />
            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              size="large"
            />
            
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              style={{
                background: "rgba(0, 60, 88, 1)", 
              }}
            >
              Iniciar Sesión
            </Button>
          </form>
        </Paper>
      </Box>
    </BackgroundTransition>
  );
}

export default Titulados;


