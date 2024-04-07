import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Container, Grid, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import  BackgroundTransition  from "../../BackgroundTransition/BackgroundTransition";
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import imagen1 from "./components/images/Titulado.png";
import imagen2 from "./components/images/Secretaria.png";
import imagen3 from "./components/images/Profesor.png";
import background1 from "./components/images/imag_valparaiso.jpg";
import background2 from "./components/images/imagen_2.jpg";
import background3 from "./components/images/imagen_3.jpg";
import background4 from "./components/images/imagen_4.jpg";
import background5 from "./components/images/imagen_5.jpg";
import logo1 from "./components/images/logo1.png";
import logo2 from "./components/images/LOGO-UV-APU-AZUL_1.png";
import "./fonts.css";

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

  // Definición de la función BotonCard
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
                transform: "scale(0.9)",
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
                fontFamily: "Swis721BT-bold",
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
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={500}
            sx={{ borderRadius: "20px", padding: "20px", bottom: "10px" }}
          >
            {/* Botones */}
            <Grid container spacing={3} justifyContent="center" sx={{ flexWrap: "wrap" }}>
              <BotonCard to="/Titulados" image={imagen1} label="Titulados" />
              <BotonCard to="/Secretarias" image={imagen2} label="Secretarias" />
              <BotonCard to="/Academicos" image={imagen3} label="Académicos" />
              <BotonCard to="/Jefaturas" image={imagen3} label="Jefaturas" />
            </Grid>
          </Box>

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
              maxHeight: "100px",
            }}
          >
            {/* Contenido del texto y los iconos */}
            <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" }, // Columna en dispositivos pequeños, fila en dispositivos medianos y superiores
              alignItems: "flex-start",
              justifyContent: "center",
              flexWrap: "wrap", // Permitir que los elementos se envuelvan
              marginRight: "auto",
              marginBottom: isMinimized ? "20px" : "0", // Ajusta el margen inferior si la pantalla está minimizada
              width: { xs: "100%", md: "auto" }, // Ancho completo en dispositivos pequeños
              maxHeight: "140px", // Altura máxima del contenedor
              overflow: "hidden", // Ocultar el exceso de contenido
            }}
          >
              {/* Contenido de texto */}
              <Typography
              variant="body1"
              sx={{
                color: "#fff",
                textAlign: "left",
                marginBottom: isMinimized ? "10px" : "0", // Ajuste el margen inferior
                marginTop: "10px", // Ajuste el margen superior
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
                src={logo1}
                alt="Logo 1"
                style={{ width: "200px", height: "auto", marginRight: "20px" }}
              />
              <img
                src={logo2}
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
