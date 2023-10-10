import React, { useState } from "react";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import background1 from "../Home/components/images/imag_valparaiso.jpg";
import background2 from "../Home/components/images/imagen_2.jpg";
import background3 from "../Home/components/images/imagen_3.jpg";
import background4 from "../Home/components/images/imagen_4.jpg";
import background5 from "../Home/components/images/imagen_5.jpg";
import BackgroundTransition from "../../BackgroundTransition/BackgroundTransition";

function Titulados() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Realiza la lógica de inicio de sesión aquí
    if (username && password) {
      // Envía una solicitud al servidor para iniciar sesión
      // Maneja la respuesta del servidor y redirige si es necesario
    }
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column", // Apilar contenido verticalmente
    alignItems: "center", // Centrar horizontalmente
    justifyContent: "center", // Centrar verticalmente
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

  // ... (código previo)

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
          Iniciar Sesión Jefaturas
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
          <Link to="/JefaturasHome">
            <Button
              type="submit"
              variant="contained"
              
              fullWidth
              size="large"
              style={{
                background: "rgba(0, 60, 88, 1)", // Cambia el color de fondo del botón
                
              }}
            >
              Iniciar Sesión
            </Button>
          </Link>
        </form>
      </Paper>
    </Box>
  </BackgroundTransition>
);

}

export default Titulados;
