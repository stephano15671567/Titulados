import React, { useState } from "react";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import background1 from "../Home/components/images/imag_valparaiso.jpg";
import background2 from "../Home/components/images/imagen_2.jpg";
import background3 from "../Home/components/images/imagen_3.jpg";
import background4 from "../Home/components/images/imagen_4.jpg";
import background5 from "../Home/components/images/imagen_5.jpg";
import BackgroundTransition from "../../BackgroundTransition/BackgroundTransition";

function Jefaturas() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para verificar si el usuario ha iniciado sesión

  const handleLogin = (e) => {
    e.preventDefault();

    // Realiza la lógica de inicio de sesión aquí
    if (username && password) {
      // Supongamos que la lógica de inicio de sesión es exitosa
      setIsLoggedIn(true);
    }
  };

  const boxStyle = {
    padding: "30px",
  };

  const titleStyle = {
    fontSize: "24px",
  };

  const formStyle = {
    marginTop: "20px",
  };

  const paperStyle = {
    ...boxStyle,
    width: "400px",
    backgroundColor: "#f0f0f0", // Fondo gris claro
  };

  const buttonStyle = {
    backgroundColor: "#333", // Botón gris oscuro
    color: "white",
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
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        {isLoggedIn ? (
          <Paper elevation={3} style={paperStyle}>
            <Typography variant="h5" align="center" gutterBottom>
              ¡Bienvenido de nuevo, {username}!
            </Typography>
            <Typography variant="body1" align="center" gutterBottom>
              Has iniciado sesión correctamente. Si necesitas recuperar o
              actualizar tus datos proporcionados por la universidad, por favor
              contáctanos a través de [correo electrónico de contacto] y
              estaremos encantados de ayudarte.
            </Typography>
          </Paper>
        ) : (
          <Paper elevation={3} style={paperStyle}>
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
                  style={buttonStyle}
                  fullWidth
                  size="large"
                >
                  Iniciar Sesión
                </Button>
              </Link>
            </form>
          </Paper>
        )}
      </Box>
    </BackgroundTransition>
  );
}

export default Jefaturas;
