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

  const contentContainerStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: "20px", // Espacio entre el contenido superior y el formulario
  };

  const leftBoxStyle = {
    background: "lightgray",
    padding: "20px",
    borderRadius: "20px",
    marginRight: "20px", // Espacio entre la caja izquierda y la derecha
    width: "100%", // Para que ocupe todo el ancho disponible
    maxWidth: "400px", // Ancho máximo para la caja izquierda
  };

  const leftTextStyle = {
    fontSize: "14px",
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
        {/* Contenedor del contenido */}
        <Box style={contentContainerStyle}>
          {/* Caja izquierda con texto */}
          <Box style={leftBoxStyle}>
            <Typography variant="body1" style={leftTextStyle}>
              Ingresa tu cuenta: rut (sin puntos, ni guión, ni dígito verificador, ej: 12345678) y contraseña personal.
              <br />
              
              
            </Typography>
          </Box>
          {/* Caja derecha con formulario */}
          <Paper elevation={3} style={{ ...leftBoxStyle, marginRight: "0" }}>
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
              <Link to="/TituladosHome">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                >
                  Iniciar Sesión
                </Button>
              </Link>
            </form>
          </Paper>
        </Box>
      </Box>
    </BackgroundTransition>
  );
}

export default Titulados;
