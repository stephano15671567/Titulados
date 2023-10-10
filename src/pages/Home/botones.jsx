import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { Link } from "react-router-dom";

function BotonCard({ to, image, label }) {
  return (
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
      <Box display="flex" justifyContent="center" gap={5}>
        <BotonCard to="/Titulados" image="./Home/components/images/xd.png" label="Titulados" />
        <BotonCard to="/Secretarias" image="ruta-de-la-imagen-2.jpg" label="Secretarias" />
        <BotonCard to="/Academicos" image="ruta-de-la-imagen-3.jpg" label="Academicos" />
        <BotonCard to="/Jefaturas" image="ruta-de-la-imagen-4.jpg" label="Jefaturas" />
      </Box>
    </Box>
  );
}

export default BotonesInicio;
