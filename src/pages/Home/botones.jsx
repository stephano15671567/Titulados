import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom"; // Importa Link


function BotonesInicio() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight={500}
      sx={{
        borderRadius: "20px", // Agrega bordes curvos
        padding: "20px", // Añade espaciado interno
        bottom: "10px",
      }}
    >
      <Box display="flex" justifyContent="center" gap={5}>
        <Link to="/Titulados">
          <Button
            variant="contained"
            size="large"
            sx={{
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 10,
            }}
          >
            <img
              src="./Home/components/images/xd.png"
              alt="Imagen 1"
              width={250}
              height={250}
              style={{ marginBottom: "20px" }}
            />
            <Typography>Titulados</Typography>
          </Button>
        </Link>

        <Link to="/Secretarias">
          <Button
            variant="contained"
            size="large"
            sx={{
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 10,
            }}
          >
            <img
              src="ruta-de-la-imagen-2.jpg"
              alt="Imagen 2"
              width={250}
              height={250}
              style={{ marginBottom: "20px" }}
            />
            <Typography>Secretarias</Typography>
          </Button>
        </Link>

        <Link to="/Academicos">
          <Button
            variant="contained"
            size="large"
            sx={{
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 10,
            }}
          >
            <img
              src="ruta-de-la-imagen-3.jpg"
              alt="Imagen 3"
              width={250}
              height={250}
              style={{ marginBottom: "20px" }}
            />
            <Typography>Academicos</Typography>
          </Button>
        </Link>

        <Link to="/Jefaturas">
          <Button
            variant="contained"
            size="large"
            sx={{
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 10,
            }}
          >
            <img
              src="ruta-de-la-imagen-4.jpg"
              alt="Imagen 4"
              width={250}
              height={250}
              style={{ marginBottom: "20px" }}
            />
            <Typography>Jefaturas</Typography>
          </Button>
        </Link>
      </Box>
    </Box>
  );
}

export default BotonesInicio;
