import React, { useState } from "react";
import { Button, Paper, Typography, TextField, Box } from "@mui/material";
import BackgroundTransition from "../../BackgroundTransition/BackgroundTransition";
import background1 from "../Home/components/images/imag_valparaiso.jpg";
import background2 from "../Home/components/images/imagen_2.jpg";
import background3 from "../Home/components/images/imagen_3.jpg";
import background4 from "../Home/components/images/imagen_4.jpg";
import background5 from "../Home/components/images/imagen_5.jpg";

function Titulados() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar el inicio de sesión con nombre de usuario y contraseña si lo necesitas
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:4000/auth/google";
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
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Paper elevation={10} sx={{ padding: 3, width: 300 }}>
          <Typography variant="h5" gutterBottom textAlign="center">
            Inicio de Sesión para Titulados
          </Typography>
          <form onSubmit={handleLoginSubmit}>
            <TextField
              label="Nombre de Usuario"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              Iniciar Sesión
            </Button>
          </form>
          <Button
            variant="contained"
            fullWidth
            sx={{
              marginTop: 2,
              backgroundColor: "#4285F4",
              "&:hover": {
                backgroundColor: "#357ae8",
              },
            }}
            onClick={handleGoogleLogin}
          >
            Iniciar Sesión con Google
          </Button>
        </Paper>
      </Box>
    </BackgroundTransition>
  );
}

export default Titulados;
