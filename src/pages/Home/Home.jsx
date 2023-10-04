import React from "react";
import { Box, Typography } from "@mui/material";
import BotonesInicio from "./botones"; // Importa el componente de botones
import background1 from "./components/images/imag_valparaiso.jpg";
import background2 from "./components/images/imagen_2.jpg";
import background3 from "./components/images/imagen_3.jpg";
import background4 from "./components/images/imagen_4.jpg";
import background5 from "./components/images/imagen_5.jpg";
import BackgroundTransition from "../../BackgroundTransition/BackgroundTransition";

function Home() {
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
        gap={2}
        justifyContent={"center"}
        alignItems="center"
        sx={{
          marginTop: "20px", // Agrega un margen superior
          paddingTop: "20px", // Añade un espaciado interno en la parte superior
          borderTop: "20px solid transparent", // Añade un borde superior transparente
        }}
      >
        {/* Caja alrededor del texto "Sistema de Titulados" */}
        <Box
          backgroundColor="rgba(0, 0, 0, 0.7)" // Establece un fondo semitransparente que contrasta
          borderRadius="20px" // Agrega bordes curvos
          padding={2} // Añade espaciado interno
        >
          <Typography
            variant="h2" // Cambia el tamaño del texto a h2
            component="h1"
            sx={{
              color: "white",
              textShadow: "4px 4px 8px #000000",
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".1rem", // Reduce el espaciado entre letras
            }}
          >
            Sistema de Titulados
          </Typography>
        </Box>
        <Typography
          variant="h4" // Cambia el tamaño del texto a h4
          component="h2"
          sx={{
            color: "black",
            textShadow: "2px 2px 4px #FFFFFF",
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".1rem", // Reduce el espaciado entre letras
          }}
        >
          Información
        </Typography>
        <BotonesInicio />
      </Box>
    </BackgroundTransition>
  );
}

export default Home;
