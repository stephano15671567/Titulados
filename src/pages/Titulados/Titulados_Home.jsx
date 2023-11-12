import React, { useState } from "react";
import { Box, Typography, Button, Container, Paper, Snackbar, CircularProgress } from "@mui/material";
import { useDropzone } from 'react-dropzone';
import BackgroundTransition from "../../BackgroundTransition/BackgroundTransition";
import background1 from "../Home/components/images/imag_valparaiso.jpg";
import background2 from "../Home/components/images/imagen_2.jpg";
import background3 from "../Home/components/images/imagen_3.jpg";
import background4 from "../Home/components/images/imagen_4.jpg";
import background5 from "../Home/components/images/imagen_5.jpg";

function TituladosHome() {
  const [uploading, setUploading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const idUsuario = "id"; // Reemplaza esto con el método que uses para obtener el ID del usuario

  const handleFileUpload = async (e, endpoint) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('idUsuario', idUsuario);

    try {
      const response = await fetch(`http://localhost:4000/${endpoint}`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      setUploading(false);
      if (response.ok) {
        setSnackbarMessage('Archivo subido con éxito');
      } else {
        setSnackbarMessage('Error al subir el archivo');
      }
      setSnackbarOpen(true);
    } catch (err) {
      setUploading(false);
      setSnackbarMessage('Error al subir el archivo');
      setSnackbarOpen(true);
      console.error('Error:', err);
    }
  };

  const onDrop = (acceptedFiles, endpoint) => {
    acceptedFiles.forEach(file => {
      handleFileUpload({ target: { files: [file] } }, endpoint);
    });
  };

  const { getRootProps: getRootPropsTesis, getInputProps: getInputPropsTesis } = useDropzone({
    onDrop: files => onDrop(files, 'upload/tesis'),
    accept: 'application/pdf',
    noClick: true,
  });

  const { getRootProps: getRootPropsFicha, getInputProps: getInputPropsFicha } = useDropzone({
    onDrop: files => onDrop(files, 'upload/ficha'),
    accept: 'application/pdf',
    noClick: true,
  });

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

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
      <Container maxWidth="md">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          padding="20px"
        >
          <Paper elevation={3} style={{ padding: "20px", textAlign: "center", background: "lightgray", marginBottom: "20px" }}>
            <Typography variant="h4" align="center" gutterBottom>
              Bienvenido al Sistema de Titulación
            </Typography>

            {/* Botón para subir tesis y área de arrastrar y soltar */}
            <Typography variant="h5" gutterBottom>
              Subir Tesis
            </Typography>
            <input
              accept="application/pdf"
              style={{ display: "none" }}
              id="upload-tesis"
              type="file"
              onChange={(e) => handleFileUpload(e, 'upload/tesis')}
            />
            <label htmlFor="upload-tesis" style={{ width: '100%', marginTop: "20px" }}>
              <Button
                variant="contained"
                style={{ backgroundColor: 'rgba(0, 60, 88, 1)' }}
                fullWidth
                component="span"
              >
                Subir Tesis
              </Button>
            </label>
            <Box {...getRootPropsTesis()} style={{ border: '2px dashed black', padding: '20px', marginTop: '10px' }}>
              <input {...getInputPropsTesis()} />
              <Typography variant="body1">O arrastra tu tesis aquí</Typography>
            </Box>

            {/* Botón para subir ficha de inscripción y área de arrastrar y soltar */}
            <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>
              Ficha de Inscripción
            </Typography>
            <input
              accept="application/pdf"
              style={{ display: "none" }}
              id="upload-ficha"
              type="file"
              onChange={(e) => handleFileUpload(e, 'upload/ficha')}
            />
            <label htmlFor="upload-ficha" style={{ width: '100%', marginTop: "20px" }}>
              <Button
                variant="contained"
                style={{ backgroundColor: 'rgba(0, 60, 88, 1)' }}
                fullWidth
                component="span"
              >
                Subir Ficha de Inscripción
              </Button>
            </label>
            <Box {...getRootPropsFicha()} style={{ border: '2px dashed black', padding: '20px', marginTop: '10px' }}>
              <input {...getInputPropsFicha()} />
              <Typography variant="body1">O arrastra tu ficha de inscripción aquí</Typography>
            </Box>

            {/* Snackbar para mensajes */}
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={handleSnackbarClose}
              message={snackbarMessage}
            />

            {/* Spinner para mostrar durante la carga */}
            {uploading && (
              <Box display="flex" justifyContent="center" alignItems="center" style={{ marginTop: '20px' }}>
                <CircularProgress />
              </Box>
            )}
          </Paper>
        </Box>
      </Container>
    </BackgroundTransition>
  );
}

export default TituladosHome;
