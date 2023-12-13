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
              backgroundColor: "rgba(0, 60, 88, 1)",
              borderRadius: "20px",
              padding: "10px",
              position: "absolute",
              bottom: "-50px",
              left: "-20px",
              right: "-20px",
              display: "flex",
              justifyContent: "space-between", // Adjust spacing between items
              alignItems: "center",
              boxShadow: "0px 0px 15px rgba(0, 0, 0, 1)",
            }}
          >
            {/* Content Box for text and icons */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start", // Align items to the left
                justifyContent: "center",
                marginRight: "auto", // Pushes everything to the left
              }}
            >
              {/* Text Content */}
              <Typography
                variant="body1"
                sx={{
                  color: "#fff",
                  textAlign: "left",
                  marginBottom: "10px",
                }}
              >
                Escuela de Administración Pública, Casa Central - Las Heras 6, Valparaíso | +56 (32) 250 7961
                Campus Santiago - Gran Avenida José Miguel Carrera 4160, San Miguel | +56 (2) 2329 2149
                Universidad de Valparaíso. Blanco 951, Valparaíso, Chile. Fono: +56 (32) 250 7000.
              </Typography>
              {/* Social Media Icons */}
              <Grid container spacing={1}>
                <Grid item>
                  <IconButton color="primary" component="a" href="https://instagram.com">
                    <InstagramIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton color="primary" component="a" href="https://facebook.com">
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

            {/* Image Box */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end", // Keep images on the right
                marginLeft: "auto", // Pushes images to the right
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