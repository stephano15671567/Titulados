import React from "react";
import { Button, Paper, Typography, Box } from "@mui/material";
import BackgroundTransition from "../../BackgroundTransition/BackgroundTransition";
import background1 from "../Home/components/images/imag_valparaiso.jpg";
import background2 from "../Home/components/images/imagen_2.jpg";
import background3 from "../Home/components/images/imagen_3.jpg";
import background4 from "../Home/components/images/imagen_4.jpg";
import background5 from "../Home/components/images/imagen_5.jpg";

function Titulados() {
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
            Bienvenido al Portal de Titulados
          </Typography>
          <Typography variant="body1" gutterBottom textAlign="center" sx={{ marginTop: 2 }}>
            Utiliza tu cuenta de Google para continuar.
          </Typography>
          <Button
            variant="contained"
            fullWidth
            sx={{
              marginTop: 4,
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
