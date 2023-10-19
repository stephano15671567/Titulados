import React from "react";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import BackgroundTransition from "../../BackgroundTransition/BackgroundTransition";
import background1 from "../Home/components/images/imag_valparaiso.jpg";
import background2 from "../Home/components/images/imagen_2.jpg";
import background3 from "../Home/components/images/imagen_3.jpg";
import background4 from "../Home/components/images/imagen_4.jpg";
import background5 from "../Home/components/images/imagen_5.jpg";

function TituladosHome() {
  const handleFileUpload = (e) => {
    console.log(e.target.files[0]); // Aquí puedes manejar el archivo seleccionado
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
    
    <Container maxWidth="md">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        padding="20px"
      >
        <Paper elevation={3} style={{ padding: "20px", textAlign: "center", background: "lightgray", marginBottom: "20px" }}>
          <Typography variant="h4" align="center" gutterBottom>
            Bienvenido al Sistema de Titulación
          </Typography>

          {/* Botón para subir tesis */}
          <Typography variant="h5" gutterBottom>
            Subir Tesis
          </Typography>
          <Typography variant="body1">
            En el Sistema de Titulación, puedes subir tu tesis de forma sencilla.
          </Typography>
          <input
            accept="application/pdf"
            style={{ display: "none" }}
            id="upload-tesis"
            type="file"
            onChange={handleFileUpload}
          />
          <label htmlFor="upload-tesis" style={{ width: '100%', marginTop: "20px" }}>
            <Button
              variant="contained"
              style={{ backgroundColor: 'rgba(0, 60, 88, 1)' }}
              fullWidth
              component="span"  // Esto es clave para hacer que el botón funcione con el label
            >
              Subir Tesis
            </Button>
          </label>

          {/* Botón para subir ficha de inscripción */}
          <Typography variant="h5" gutterBottom>
            Ficha de Inscripción
          </Typography>
          <Typography variant="body1">
            Completa la ficha de inscripción para tu seminario de título.
          </Typography>
          <input
            accept="application/pdf"
            style={{ display: "none" }}
            id="upload-ficha"
            type="file"
            onChange={handleFileUpload}
          />
          <label htmlFor="upload-ficha" style={{ width: '100%', marginTop: "20px" }}>
            <Button
              variant="contained"
              style={{ backgroundColor: 'rgba(0, 60, 88, 1)' }}
              fullWidth
              component="span"
            >
              Subir Ficha de Inscripción
            </Button>
          </label>
        </Paper>
      </Box>
      
    </Container>
    </BackgroundTransition>
  );
  
}


export default TituladosHome;
