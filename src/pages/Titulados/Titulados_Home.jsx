import React from "react";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import { Link } from "react-router-dom";

function TituladosHome() {
  return (
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

          <Typography variant="h5" gutterBottom>
            Subir Tesis
          </Typography>
          <Typography variant="body1">
            En el Sistema de Titulación, puedes subir tu tesis de forma sencilla. Esto te permitirá completar tu proceso de titulación de manera eficiente.
          </Typography>
          <Link to="/subir-tesis" style={{ textDecoration: "none", marginTop: "20px", display: "block" }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
            >
              Subir Tesis
            </Button>
          </Link>

          <Typography variant="h5" gutterBottom>
            Ficha de Inscripción
          </Typography>
          <Typography variant="body1">
            Completa la ficha de inscripción para tu seminario de título. Asegúrate de proporcionar información precisa y completa.
          </Typography>
          <Link to="/subir-ficha-inscripcion" style={{ textDecoration: "none", marginTop: "20px", display: "block" }}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
            >
              Subir Ficha de Inscripción
            </Button>
          </Link>
        </Paper>
      </Box>
    </Container>
  );
}

export default TituladosHome;
