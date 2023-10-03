import React, { useState, useEffect } from "react";
import PageContainer from "../../components/container/PageContainer";
import { Box, Typography } from "@mui/material";
import BotonesInicio from "./botones"; // Importa el componente de botones
import background1 from "./components/images/imag_valparaiso.jpg";
import background2 from "./components/images/imagen_2.jpg";
import background3 from "./components/images/imagen_3.jpg";
import background4 from "./components/images/imagen_4.jpg";
import background5 from "./components/images/imagen_5.jpg";

function Home() {
  const backgrounds = [background1, background2, background3, background4, background5];
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);

  // Función para cambiar la imagen de fondo cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackgroundIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [backgrounds.length]);

  return (
    <PageContainer title="Pagina inicio" description="aaaaaaaaaaaaaaaaa">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          backgroundImage: `url(${backgrounds[currentBackgroundIndex]})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPositionY: "70%",
          transition: "background-image 1.5s ease-in-out", // Transición suave
        }}
        minHeight={700}
        className="fade-background" // Añade la clase CSS para la transición
      >
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          justifyContent={"center"}
          alignItems="center"
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              color: "black",
              textShadow: "4px 4px 8px #FFFFFF",
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
            }}
          >
            Sistemas Titulados
          </Typography>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              color: "black",
              textShadow: "2px 2px 4px #FFFFFF",
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
            }}
          >
            Información
          </Typography>
          <BotonesInicio />
        </Box>
      </Box>
      <Box
        padding={10}
        display="flex"
        flexDirection="column"
        gap={5}
        alignItems="center"
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "white",
            textShadow: "2px 2px 4px #000000",
          }}
        >
          TEXTO
        </Typography>
      </Box>
    </PageContainer>
  );
}

export default Home;
