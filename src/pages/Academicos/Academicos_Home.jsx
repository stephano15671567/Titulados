import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload"; // Importa el icono de subir archivo

function AcademicoView() {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [thesisNote, setThesisNote] = useState("");
  const [attachedFile, setAttachedFile] = useState(null); // Estado para el archivo adjunto
  const students = ["Estudiante 1", "Estudiante 2", "Estudiante 3"]; // Agrega más estudiantes aquí

  const handleStudentChange = (event) => {
    setSelectedStudent(event.target.value);
  };

  const handleSaveNoteAndFile = () => {
    // Lógica para guardar o actualizar la nota de la tesis y adjuntar la ficha (rúbrica)
    console.log(`Nota para ${selectedStudent}: ${thesisNote}`);
    console.log("Archivo adjunto:", attachedFile);
    // Puedes implementar el proceso de guardar o actualizar la nota y adjuntar la ficha aquí
  };

  const handleFileUpload = (event) => {
    // Maneja la subida de archivos y actualiza el estado del archivo adjunto
    const file = event.target.files[0];
    setAttachedFile(file);
  };

  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        padding="20px"
      >
        <Typography variant="h4" align="center" gutterBottom>
          Vista de Académico
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Paper elevation={3} style={{ padding: "20px", textAlign: "center", borderRadius: "20px" }}>
              <Typography variant="h5" gutterBottom>
                Lista de Estudiantes
              </Typography>
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel id="student-label">Estudiante</InputLabel>
                <Select
                  labelId="student-label"
                  id="student-select"
                  value={selectedStudent}
                  onChange={handleStudentChange}
                  label="Estudiante"
                >
                  <MenuItem value="">
                    <em>Seleccionar estudiante</em>
                  </MenuItem>
                  {students.map((student) => (
                    <MenuItem key={student} value={student}>
                      {student}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper elevation={3} style={{ padding: "20px", textAlign: "center", borderRadius: "20px" }}>
              <Typography variant="h5" gutterBottom>
                Nota de Tesis y Adjuntar Ficha (Rúbrica)
              </Typography>
              <Typography variant="body1">
                Asigna una nota a la tesis del estudiante seleccionado y adjunta la ficha (rúbrica).
              </Typography>
              <TextField
                label="Nota de Tesis"
                variant="outlined"
                fullWidth
                margin="normal"
                value={thesisNote}
                onChange={(e) => setThesisNote(e.target.value)}
              />
              <input
                accept=".pdf" // Puedes especificar aquí el tipo de archivo permitido
                id="file-upload"
                type="file"
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
              <label htmlFor="file-upload">
                <IconButton
                  color="primary"
                  aria-label="Subir archivo"
                  component="span"
                >
                  <CloudUploadIcon />
                </IconButton>
                Subir Ficha (Rúbrica)
              </label>
              <Button
                variant="contained"
                color="primary"
                style={{ borderRadius: "20px", marginTop: "20px" }}
                onClick={handleSaveNoteAndFile}
              >
                Guardar Nota y Adjuntar Ficha
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* Contenido de texto adicional */}
        <Typography variant="h6" align="center" gutterBottom>
          Información Adicional
        </Typography>
        <Typography variant="body1">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla bibendum ex nec justo euismod, ac fringilla metus malesuada.
          Suspendisse facilisis sem eget metus eleifend, a dignissim ex hendrerit. Maecenas vel justo at odio ullamcorper consectetur.
        </Typography>
        <Typography variant="body1">
          Proin in vehicula turpis. Etiam a neque in metus dictum bibendum. Vivamus scelerisque justo ac tortor gravida, vel suscipit orci
          aliquam. Fusce sit amet eros vitae enim blandit condimentum. Nullam laoreet libero non euismod euismod.
        </Typography>
      </Box>
    </Container>
  );
}

export default AcademicoView;

