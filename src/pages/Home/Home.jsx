import React from "react";
import { Box, Typography, Paper, Container } from "@mui/material";
import BotonesInicio from "./botones";
import background1 from "./components/images/imag_valparaiso.jpg";
import background2 from "./components/images/imagen_2.jpg";
import background3 from "./components/images/imagen_3.jpg";
import background4 from "./components/images/imagen_4.jpg";
import background5 from "./components/images/imagen_5.jpg";
import BackgroundTransition from "../../BackgroundTransition/BackgroundTransition";
import imagen1 from "./components/images/LOGO-UV-APU-AZUL_1.png";
import imagen2 from "./components/images/logo1.png";


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
      <Container>
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          justifyContent="center"
          alignItems="center"
          sx={{
            marginTop: "0px",
            paddingTop: "30px",
            borderTop: "20px solid transparent",
            position: "relative",
          }}
        >
          {/* Caja que contrasta con el fondo */}
          <Paper
            elevation={3}
            sx={{
              backgroundColor: "rgba(0, 60, 88, 1)", // Fondo azul transparente
              borderRadius: "20px",
              padding: "10px",
              position: "absolute",
              top: 0,
              left: "-20px", // Alineamos la caja a la izquierda
              right: "-20px", // Alineamos la caja a la derecha
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0px 0px 15px rgba(0, 0, 0, 1)", // Aumenta la opacidad de la sombra
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{
                
                color: "#fff",
                fontFamily: "Times New Roman",
                fontWeight: 700,
                letterSpacing: ".1rem",
              }}
            >
              Sistema de Titulados
            </Typography>
          </Paper>

          {/* Contenido debajo de la caja */}
          <BotonesInicio />

          {/* Caja con las imágenes */}
          <Paper
            elevation={3}
            sx={{
              backgroundColor: "rgba(0, 60, 88, 1)", // Fondo azul transparente
              borderRadius: "20px",
              padding: "10px",
              position: "absolute",
              bottom: "-50px", // Mueve la caja hacia abajo
              left: "-20px", // Alineamos la caja a la izquierda
              right: "-20px", // Alineamos la caja a la derecha
              display: "flex",
              justifyContent: "flex-end", // Alineamos las imágenes al lado derecho
              alignItems: "center",
              boxShadow: "0px 0px 15px rgba(0, 0, 0, 1)", // Aumenta la opacidad de la sombra
            }}
          >
            {/* Agrega tus imágenes dentro de etiquetas <img> */}
            <img
              src={imagen1}
              alt="Descripción de la imagen"
              width="200px" // Ajusta el ancho de la imagen según tus necesidades
              height="auto" // La altura se ajustará automáticamente
              style={{ marginRight: "20px" }} // Espacio entre las imágenes
            />

            <img
              src={imagen2}
              alt="Descripción de la imagen"
              width="200px" // Ajusta el ancho de la imagen según tus necesidades
              height="auto" // La altura se ajustará automáticamente
            />
          </Paper>
        </Box>
      </Container>
    </BackgroundTransition>
  );
}

export default Home;
