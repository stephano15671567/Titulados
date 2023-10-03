import React, { useState } from "react";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function Secretarias() {
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

  const boxStyle = {
    padding: "30px", // Aumenta el espacio interno
    borderRadius: "20px", // Esquinas curvas
  };

  const titleStyle = {
    fontSize: "24px", // Aumenta el tamaño de fuente
  };

  const formStyle = {
    marginTop: "20px", // Aumenta el margen superior del formulario
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Box mb={4} p={3} bgcolor="primary.main" color="white" style={boxStyle}>
        <Typography variant="h4" align="center" style={titleStyle}>
          Ingreso Titulados
        </Typography>
      </Box>
      <Paper elevation={3} style={{ ...boxStyle, width: "400px" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Iniciar Sesión
        </Typography>
        <form onSubmit={handleLogin} style={formStyle}>
          <TextField
            label="Nombre de Usuario"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            size="large" // Aumenta el tamaño del campo de texto
          />
          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            size="large" // Aumenta el tamaño del campo de texto
          />
          <Link to="/SecretariasHome">
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large" // Aumenta el tamaño del botón
              >
                Iniciar Sesión
            </Button>
          </Link>
        </form>
        
      </Paper>
    </Box>
  );
}

export default Secretarias;