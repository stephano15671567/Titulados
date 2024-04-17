import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import imagen1 from "../Home/components/images/Titulado.png"
import imagen2 from "../Home/components/images/Secretaria.png"
import imagen3 from "../Home/components/images/Profesor.png"

function BotonCard({ to, image, label }) {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Link to={to} style={{ textDecoration: "none" }}>
        <Paper
          elevation={3}
          sx={{
            backgroundColor: "rgba(0, 60, 88, 1)",
            borderRadius: "20px",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.7)",
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.1)",
            },
          }}
        >
          <img
            src={image}
            alt={`Imagen para ${label}`}
            width={250}
            height={250}
            style={{ marginBottom: "20px" }}
          />
          <Typography
            variant="h5"
            component="div"
            sx={{
              color: "#fff",
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
            }}
          >
            {label}
          </Typography>
        </Paper>
      </Link>
    </Grid>
  );
} 

function BotonesInicio() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight={500}
      sx={{ borderRadius: "20px", padding: "20px", bottom: "10px" }}
    >
      <Grid container spacing={3}>
        <BotonCard to="/Titulados" image={imagen1} label="Estudiantes" />
        <BotonCard to="/Secretarias" image={imagen2} label="Secretarias" />
        <BotonCard to="/Academicos" image={imagen3} label="Académicos" />
        <BotonCard to="/Jefaturas" image={imagen3} label="Jefaturas" />
      </Grid>
    </Box>
  );
}

export default BotonesInicio;
