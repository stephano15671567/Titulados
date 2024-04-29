import React from "react";
import { Box, Typography, Paper, Container, Grid, IconButton } from "@mui/material";
import BotonesInicio from "./botones";
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
<<<<<<< HEAD
import LinkedInIcon from '@mui/icons-material/LinkedIn'; 
=======
import LinkedinIcon from '@mui/icons-material/LinkedIn'; // Corregir la importación aquí
>>>>>>> clarin
import background1 from "./components/images/imag_valparaiso.jpg";
import background2 from "./components/images/imagen_2.jpg";
import background3 from "./components/images/imagen_3.jpg";
import background4 from "./components/images/imagen_4.jpg";
import background5 from "./components/images/imagen_5.jpg";
import BackgroundTransition from "../../BackgroundTransition/BackgroundTransition";
import imagen1 from "./components/images/LOGO-UV-APU-AZUL_1.png";
import imagen2 from "./components/images/logo1.png";
<<<<<<< HEAD
import axios from "axios";
=======
>>>>>>> clarin

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
          <Paper
            elevation={3}
            sx={{
              backgroundColor: "rgba(0, 60, 88, 1)", 
              borderRadius: "20px",
              padding: "10px",
              position: "absolute",
              top: 0,
              left: "50%", // Center the paper horizontally
              transform: "translateX(-50%)", // Center the paper horizontally
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0px 0px 15px rgba(0, 0, 0, 1)", 
              width: "80%", // Adjust the width for responsiveness
              maxWidth: "600px", // Set maximum width
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{
                color: "#fff",
                fontFamily: "swiss721bt",
                fontWeight: 700,
                letterSpacing: ".1rem",
                textAlign: "center", // Center align text
              }}
            >
              Sistema de Seminario de Título 
            </Typography>
          </Paper>

          <BotonesInicio />

          <Paper
            elevation={3}
            sx={{
              backgroundColor: "rgba(0, 60, 88, 1)",
              borderRadius: "20px",
              padding: "10px",
              position: "relative",
              bottom: "-50px",
              width: "80%", // Adjust the width for responsiveness
              maxWidth: "600px", // Set maximum width
              boxShadow: "0px 0px 15px rgba(0, 0, 0, 1)",
              marginBottom: "20px", // Add space at the bottom
              marginLeft: "auto", // Center the paper horizontally
              marginRight: "auto", // Center the paper horizontally
            }}
          >
<<<<<<< HEAD
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#fff",
                      marginBottom: "10px",
                    }}
                  >
                    Escuela de Administración Pública, Casa Central - Las Heras 6, Valparaíso | +56 (32) 250 7961
                    Campus Santiago - Gran Avenida José Miguel Carrera 4160, San Miguel | +56 (2) 2329 2149
                    Universidad de Valparaíso. Blanco 951, Valparaíso, Chile. Fono: +56 (32) 250 7000.
                  </Typography>
                  <Grid container spacing={1}>
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
                      <IconButton color="primary" component="a" href="https://www.linkedin.com/in/administraci%C3%B3n-p%C3%BAblica-universidad-de-valpara%C3%ADso-b785a4b4/">
                        <LinkedInIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
=======
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
                  marginBottom: "0px",
                }}
              >
                Escuela de Administración Pública, Casa Central - Las Heras 6, Valparaíso | +56 (32) 250 7961
                Campus Santiago - Gran Avenida José Miguel Carrera 4160, San Miguel | +56 (2) 2329 2149
                Universidad de Valparaíso. Blanco 951, Valparaíso, Chile. Fono: +56 (32) 250 7000.
              </Typography>
              {/* Social Media Icons */}
              <Grid container spacing={1}>
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
                  <IconButton color="primary" component="a" href="https://www.linkedin.com/in/administraci%C3%B3n-p%C3%BAblica-universidad-de-valpara%C3%ADso-b785a4b4/">
                    <LinkedinIcon />
                  </IconButton>
                </Grid>
>>>>>>> clarin
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={imagen1}
                    alt="Logo 1"
                    style={{ width: "150px", height: "auto", marginRight: "20px" }}
                  />
                  <img
                    src={imagen2}
                    alt="Logo 2"
                    style={{ width: "150px", height: "auto" }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
    </BackgroundTransition>
  );
}

export default Home;
