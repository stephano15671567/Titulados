import React from "react";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import { Link } from "react-router-dom";

function SecretariaView() {
  const containerStyle = {
    display: "flex",
    flexDirection: "column", // Apilar contenido verticalmente
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "Times New Roman", // Cambio de fuente a Times New Roman
  };

  const paperStyle = {
    padding: "20px",
    textAlign: "center",
    marginBottom: "20px",
    width: "100%", // Ocupa todo el ancho disponible
    maxWidth: "1000px", // Ancho máximo para mantener la uniformidad
    background: "lightgray", // Fondo gris claro
    borderRadius: "10px", // Bordes redondeados
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Sombra ligera
  };

  return (
    <Container maxWidth="md">
      <Box style={containerStyle}>
        
        <Paper elevation={3} style={paperStyle}>
          <Typography variant="h5" gutterBottom>
            Ver Tesis
          </Typography>
          <Typography variant="body1">
            Ver la lista de tesis y su estado.
          </Typography>
          <Link to="/ver-tesis" style={{ textDecoration: "none", marginTop: "20px", display: "block" }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              style={{
                background: "rgba(0, 60, 88, 1)", // Cambia el color de fondo del botón
                
              }}
            >
              Ver Tesis
            </Button>
          </Link>

          <Typography variant="h5" gutterBottom>
            Asignar Profesores
          </Typography>
          <Typography variant="body1">
            Asignar profesores a las tesis.
          </Typography>
          <Link to="/asignar-profesores" style={{ textDecoration: "none", marginTop: "20px", display: "block" }}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              style={{
                background: "rgba(0, 60, 88, 1)", // Cambia el color de fondo del botón
                
              }}
            >
              Asignar Profesores
            </Button>
          </Link>

          <Typography variant="h5" gutterBottom>
            Ver Reporte
          </Typography>
          <Typography variant="body1">
            Generar y ver reportes de las tesis.
          </Typography>
          <Link to="/ver-reporte" style={{ textDecoration: "none", marginTop: "20px", display: "block" }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              style={{
                background: "rgba(0, 60, 88, 1)", // Cambia el color de fondo del botón
                
              }}
              
            >
              Ver Reporte
            </Button>
          </Link>

          <Typography variant="h5" gutterBottom>
            Generar Acta
          </Typography>
          <Typography variant="body1">
            Generar actas de defensa de tesis.
          </Typography>
          <Link to="/generar-acta" style={{ textDecoration: "none", marginTop: "20px", display: "block" }}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              style={{
                background: "rgba(0, 60, 88, 1)", // Cambia el color de fondo del botón
                
              }}
            >
              Generar Acta
            </Button>
          </Link>

          <Typography variant="h5" gutterBottom>
            Generar Comisión
          </Typography>
          <Typography variant="body1">
            Generar comisiones para las defensas de tesis.
          </Typography>
          <Link to="/generar-comision" style={{ textDecoration: "none", marginTop: "20px", display: "block" }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              style={{
                background: "rgba(0, 60, 88, 1)", // Cambia el color de fondo del botón
                
              }}
            >
              Generar Comisión
            </Button>
          </Link>
        </Paper>
      </Box>
    </Container>
  );
}

export default SecretariaView;
