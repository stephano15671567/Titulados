import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Button,
  Container,
  Paper,
} from "@mui/material";
import BackgroundTransition from "../../BackgroundTransition/BackgroundTransition";
import background1 from "../Home/components/images/imag_valparaiso.jpg";
import background2 from "../Home/components/images/imagen_2.jpg";
import background3 from "../Home/components/images/imagen_3.jpg";
import background4 from "../Home/components/images/imagen_4.jpg";
import background5 from "../Home/components/images/imagen_5.jpg";
import axios from "axios";
import LogoutIcon from '@mui/icons-material/Logout';
import API from "../../config/const";



function TituladosHome() {
  const win = window.sessionStorage; //Variable de sesión
  const id = win.getItem("id") 
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };
  
  // Función para cerrar sesión
  const handleSignOut = () => {
    // Eliminar información de sesión
    win.clear();
    // Redireccionar al usuario a la página de inicio de sesión (sustituir '/' por la ruta de inicio de sesión)
    window.location.href = '/';
  };

  const handleFileUpload = async (e, endpoint) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("idUsuario", id);
    endpoint = endpoint + id;
    console.log(endpoint);
    try {
      const response = await axios.post(
        `/${endpoint}`,
        formData,
        {
          withCredentials: true, // This is equivalent to 'credentials: "include"'
        }
      );
      try{
        const response2 = await axios.post(
          `${API}/api/correo_send/${id}/`,
          {
            withCredentials: true, // This is equivalent to 'credentials: "include"'
          }
        );
      }catch(err){
        console.log(err)
        setOpen2(true);
        return;
      }
      setOpen(true);
    } catch (err) {
      setOpen2(true);

      if (err.response) {
        // The server responded with a status code outside the 2xx range
        console.log("Error al subir el archivo:", err.response.data);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error:", err.message);
      }
    }
  };

  return (
    <BackgroundTransition
      images={[background1, background2, background3, background4, background5]}
      duration={5000}
    >
    <Button
        onClick={handleSignOut}
        variant="contained"
        color="secondary"
        startIcon={<LogoutIcon />}
        style={{ position: 'absolute', top: '20px', right: '20px' }}
    >
      Salir
    </Button>
      <Container maxWidth="md">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          padding="20px"
          position="relative"
        >
          <Paper
            elevation={3}
            style={{
              padding: "20px",
              textAlign: "center",
              background: "lightgray",
              marginBottom: "20px",
            }}
          >
            <Typography variant="h4" align="center" gutterBottom>
              Bienvenido al Sistema de Titulación
            </Typography>
            <Typography variant="h5" gutterBottom>
              Ficha de Inscripción
            </Typography>
            <Typography variant="body1">
             Sube tu ficha de inscripción para tu seminario de título.
            </Typography>
            <input
              accept="application/"
              style={{ display: "none" }}
              id="upload-ficha"
              type="file"
              onChange={(e) => handleFileUpload(e, `${API}/api/archivos/`)}
            />
            <label
              htmlFor="upload-ficha"
              style={{ width: "100%", marginTop: "20px" }}
            >
              <Button
                variant="contained"
                style={{ backgroundColor: "rgba(0, 60, 88, 1)" }}
                fullWidth
                component="span"
              >
                Subir Ficha de Inscripción
              </Button>
            </label>
          </Paper>
          
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Notificación</DialogTitle>
            <DialogContent>
              <DialogContentText>
                ¡Archivo subido con éxito!
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cerrar</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={open2} onClose={handleClose2}>
            <DialogTitle>Notificación</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Hubo un error al subir el archivo, pruebe nuevamente más tarde
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose2}>Cerrar</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    </BackgroundTransition>
  );
}

export default TituladosHome;