import React from "react";
import { Box, Typography, Paper, Container, Grid, IconButton } from "@mui/material";
import BotonesInicio from "./botones";
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import background1 from "./components/images/imag_valparaiso.jpg";
import background2 from "./components/images/imagen_2.jpg";
import background3 from "./components/images/imagen_3.jpg";
import background4 from "./components/images/imagen_4.jpg";
import background5 from "./components/images/imagen_5.jpg";
import BackgroundTransition from "../../BackgroundTransition/BackgroundTransition";
import imagen1 from "./components/images/LOGO-UV-APU-AZUL_1.png";
import imagen2 from "./components/images/logo1.png";
import "./fonts.css";
import { useEffect, useState } from "react";



function Home() {
  const [isMinimized, setIsMinimized] = useState(false);

  // Función para verificar si la pantalla está minimizada al cambiar el tamaño de la ventana
  const handleResize = () => {
    setIsMinimized(window.innerWidth < 600); // Cambia a true si el ancho de la ventana es menor que 600px
  };

  // Efecto para ejecutar la función handleResize cuando cambia el tamaño de la ventana
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
              backgroundColor: "rgba(0, 60, 88, 1)",
              borderRadius: "20px",
              padding: "10px",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0px 0px 15px rgba(0, 0, 0, 1)",
              width: "100%", // Ajuste para hacer que la caja sea responsiva
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{
                color: "#fff",
                fontFamily: "Swis721BT",
                fontWeight: 700,
                letterSpacing: ".1rem",
                textAlign: "center", // Alinea el texto al centro
                marginBottom: isMinimized ? "20px" : "0", // Ajusta el margen inferior si la pantalla está minimizada
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
              backgroundColor: "rgba(0, 60, 88, 1)",
              borderRadius: "20px",
              padding: "10px",
              position: "absolute",
              bottom: "-50px",
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0px 0px 15px rgba(0, 0, 0, 1)",
              width: "100%", // Ajuste para hacer que la caja sea responsiva
            }}
          >
            {/* Contenido del texto y los iconos */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" }, // Columna en dispositivos pequeños, fila en dispositivos medianos y superiores
                alignItems: "flex-start",
                justifyContent: "center",
                flexWrap: "wrap", // Permitir que los elementos se envuelvan en dispositivos pequeños
                marginRight: "auto",
                marginBottom: isMinimized ? "20px" : "0", // Ajusta el margen inferior si la pantalla está minimizada
                width: { xs: "100%", md: "auto" }, // Ancho completo en dispositivos pequeños
              }}
            >
              {/* Contenido de texto */}
              <Typography
                variant="body1"
                sx={{
                  color: "#fff",
                  textAlign: "left",
                  marginBottom: isMinimized ? "20px" : "0", // Ajusta el margen inferior si la pantalla está minimizada
                }}
              >
                Escuela de Administración Pública, Casa Central - Las Heras 6, Valparaíso | +56 (32) 250 7961
                Campus Santiago - Gran Avenida José Miguel Carrera 4160, San Miguel | +56 (2) 2329 2149
                Universidad de Valparaíso. Blanco 951, Valparaíso, Chile. Fono: +56 (32) 250 7000.
              </Typography>
              {/* Iconos de redes sociales */}
              <Grid
                container
                spacing={1}
                sx={{
                  marginBottom: { xs: 2, md: 0 }, // Espacio inferior en dispositivos pequeños
                }}
              >
                <Grid item>
                  <IconButton color="primary" component="a" href="https://www.instagram.com/administracionpublicauv/">
                    <InstagramIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton color="primary" component="a" href="https://www.facebook.com/admpublicauv">
                    <FacebookIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton color="primary" component="a" href="https://youtube.com">
                    <YouTubeIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>

            {/* Contenedor de imágenes */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                marginLeft: "auto",
              }}
            >
              <img
                src={imagen1}
                alt="Logo 1"
                style={{ width: "200px", height: "auto", marginRight: "20px" }}
              />
              <img
                src={imagen2}
                alt="Logo 2"
                style={{ width: "200px", height: "auto" }}
              />
            </Box>
          </Paper>
        </Box>
      </Container>
    </BackgroundTransition>
  );
}

export default Home;
