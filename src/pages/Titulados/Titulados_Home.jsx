import React from "react";
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
import LogoutIcon from "@mui/icons-material/Logout";
import Swal from "sweetalert2";

function TituladosHome() {
  const win = window.sessionStorage;
  const id = win.getItem("id");
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);

  const cargando = () => {
    Swal.fire({
      title: "Cargando . . .",
      text: "Espere por favor",
      html: '<i class="fas fa-spinner fa-spin" style="font-size: 24px;"></i>',
      allowOutsideClick: false,
      showConfirmButton: false,
    });
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };

  const handleSignOut = () => {
    win.clear();
    window.location.href = "/";
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    cargando();

    const formData = new FormData();
    formData.append("file", file);
    const endpoint = `https://apisst.administracionpublica-uv.cl/api/archivos/${id}`;

    try {
      const response = await axios.post(endpoint, formData, {
        withCredentials: true,
      });
      Swal.fire(
        "Subida exitosa",
        "Su ficha ha sido subida correctamente",
        "success"
      );
    } catch (err) {
      console.log(
        "Error al subir el archivo:",
        err.response?.data ?? err.message
      );
      Swal.fire(
        "Error",
        "Hubo un error al subir el archivo, pruebe nuevamente más tarde.",
        "error"
      );
    }
  };

  const handleFileDownload = async () => {
    const url = `https://apisst.administracionpublica-uv.cl/api/archivos/descargar/archivo-word`;

    try {
      const response = await axios.get(url, {
        responseType: "blob",
      });

      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute(
        "download",
        "Formulario Inscripción Seminario de Título.docx"
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      Swal.fire(
        "Descargado",
        "El archivo se ha descargado correctamente.",
        "success"
      );
    } catch (error) {
      console.log("Error durante la descarga:", error);
      Swal.fire(
        "Error",
        "Hubo un error al descargar el archivo, pruebe nuevamente más tarde.",
        "error"
      );
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
        style={{ position: "absolute", top: "20px", right: "20px" }}
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
              Sube o descarga tu ficha de inscripción para tu seminario de
              título.
            </Typography>
            <input
              accept="*"
              style={{ display: "none" }}
              id="upload-ficha"
              type="file"
              onChange={(e) => handleFileUpload(e)}
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
            <Button
              onClick={handleFileDownload}
              variant="contained"
              style={{
                backgroundColor: "rgba(0, 150, 136, 1)",
                marginTop: "20px",
              }}
              fullWidth
            >
              Descargar Ficha de Inscripción
            </Button>
          </Paper>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Notificación</DialogTitle>
            <DialogContent>
              <DialogContentText>¡Archivo subido con éxito!</DialogContentText>
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
