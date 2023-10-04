import React from "react";
import { Box, Typography, Button, Container, Grid, Paper } from "@mui/material";
import { Link } from "react-router-dom";

function SecretariaView() {
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
        <Typography variant="h4" align="center" gutterBottom>
          Vista de Secretaría
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: "20px", textAlign: "center", marginBottom: "20px" }}>
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
                >
                  Ver Tesis
                </Button>
              </Link>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: "20px", textAlign: "center", marginBottom: "20px" }}>
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
                >
                  Asignar Profesores
                </Button>
              </Link>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: "20px", textAlign: "center", marginBottom: "20px" }}>
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
                >
                  Ver Reporte
                </Button>
              </Link>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: "20px", textAlign: "center", marginBottom: "20px" }}>
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
                >
                  Generar Acta
                </Button>
              </Link>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
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
                >
                  Generar Comisión
                </Button>
              </Link>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default SecretariaView;
