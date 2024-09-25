import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  IconButton,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import axios from "axios";
import Swal from "sweetalert2";

const GuiaTable = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [nota, setNota] = useState(1);
  const [file, setFile] = useState(null);
  const [fileTesis, setFileTesis] = useState(null);
  const [rubricaSubida, setRubricaSubida] = useState(false);
  const [tesisSubida, setTesisSubida] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState({
    alumno_RUT: "",
    alumnoNombre: "",
    nota_guia: "",
  });
  const [profesorId, setProfesorId] = useState(
    window.sessionStorage.getItem("id")
  );
  const [tituloTesis, setTituloTesis] = useState(""); // Estado para el título de la tesis
  const [tesisConfirmada, setTesisConfirmada] = useState(false); // Estado para confirmar la tesis

  const cargando = () => {
    Swal.fire({
      title: "Cargando . . .",
      text: "Espere por favor",
      html: '<i class="fas fa-spinner fa-spin" style="font-size: 24px;"></i>',
      allowOutsideClick: false,
      showConfirmButton: false,
    });
  };

  const falla = () => {
    Swal.fire({
      title: "Error",
      text: "No se pudo generar la carta",
      icon: "error",
      confirmButtonText: "Ok",
    });
  };

  useEffect(() => {
    const fetchAssignmentsAndNotes = async () => {
      if (profesorId) {
        const assignmentsResponse = await axios.get(
          `https://apisst.administracionpublica-uv.cl/api/asignaciones/guia/${profesorId}`
        );
        const notasResponse = await axios.get(
          "https://apisst.administracionpublica-uv.cl/api/notas"
        );
        const alumnosResponse = await axios.get(
          "https://apisst.administracionpublica-uv.cl/api/alumnos"
        );
        const alumnos = alumnosResponse.data;

        const combinedData = assignmentsResponse.data.map((asignacion) => {
          const alumno = alumnos.find((a) => a.RUT === asignacion.alumno_RUT);
          const notaItem = notasResponse.data.find(
            (n) => n.alumno_RUT === asignacion.alumno_RUT
          );
          return {
            ...asignacion,
            alumnoNombre: alumno ? alumno.nombre : "Nombre no encontrado",
            nota_guia: notaItem ? notaItem.nota_guia : null,
          };
        });

        setRows(combinedData);
      }
    };

    fetchAssignmentsAndNotes();
  }, [profesorId]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickOpen = (row) => {
    setSelectedAlumno(row);
    setNota(row.nota_guia || 1);
    setRubricaSubida(false);
    setFile(null);
    setTituloTesis(""); // Limpiar el título de la tesis al abrir el modal
    setTesisConfirmada(false); // Reiniciar confirmación
    setOpen(true);
  };

  const handleClose = () => {
    console.log("Cerrando el modal..."); // Verificar en la consola si se ejecuta
    setOpen(false);
  };

  const handleConfirmarTituloTesis = async () => {
    if (!tituloTesis.trim()) {
      Swal.fire("Error", "Debe ingresar un título de tesis válido.", "error");
      return;
    }
  
    cargando();
  
    const payload = {
      tesis: tituloTesis, // Solo envía el campo tesis
    };
  
    try {
      // Usar la nueva ruta para actualizar solo el título de la tesis
      await axios.patch(
        `https://apisst.administracionpublica-uv.cl/api/alumnos/${selectedAlumno.alumno_RUT}/tesis`, 
        payload
      );
  
      setTesisConfirmada(true);
      Swal.fire("¡Éxito!", "El título de la tesis ha sido guardado correctamente.", "success");
      handleClose();
    } catch (error) {
      console.error("Error al guardar el título de la tesis:", error);
      Swal.fire("Error", "No se pudo guardar el título de la tesis.", "error");
      handleClose();
    }
  };
  

  const handleConfirm = async () => {
    if (!file) {
      Swal.fire("Error", "Debe subir un archivo de rúbrica.", "error");
      return;
    }
    cargando();
    handleClose();

    const formData = new FormData();
    formData.append("file", file);
    const alumnoRut = selectedAlumno.alumno_RUT;

    try {
      await axios.post(
        `https://apisst.administracionpublica-uv.cl/api/archivos/subir/rubrica/guia/${alumnoRut}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const url = `https://apisst.administracionpublica-uv.cl/api/notas/upsert`;
      const payload = {
        alumno_RUT: selectedAlumno.alumno_RUT,
        nota: parseFloat(nota).toFixed(1),
        profesor_id: profesorId,
        rol: "guia",
        tesis: tituloTesis, // Enviar el título de la tesis
      };

      await axios.post(url, payload);
      const updatedRows = rows.map((row) => {
        if (row.alumno_RUT === selectedAlumno.alumno_RUT) {
          return { ...row, nota_guia: payload.nota };
        }
        return row;
      });
      setRows(updatedRows);
      setRubricaSubida(true);
      Swal.fire(
        "¡Éxito!",
        "La rúbrica, nota y título de la tesis han sido subidos y guardados.",
        "success"
      );
      handleClose();
    } catch (error) {
      console.error("Error al subir la rúbrica o guardar la nota:", error);
      Swal.fire("Error", "No se pudo completar la acción.", "error");
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleDownload = () => {
    const alumnoRut = selectedAlumno.alumno_RUT;
    window.location.href = `https://apisst.administracionpublica-uv.cl/api/archivos/descargar/rubrica/guia`;
  };

  const handleFileChangeTesis = (event) => {
    setFileTesis(event.target.files[0]);
  };

  const handleUploadTesis = async () => {
    if (!fileTesis) {
      Swal.fire(
        "Error",
        "Por favor, selecciona un archivo de tesis para subir.",
        "error"
      );
      return;
    }
    cargando();
    handleClose();

    const formData = new FormData();
    formData.append("tesis", fileTesis);
    const alumnoRut = selectedAlumno.alumno_RUT;

    try {
      await axios.post(
        `https://apisst.administracionpublica-uv.cl/api/archivos/subir/tesis/${alumnoRut}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setTesisSubida(true);
      Swal.fire("¡Subido!", "La tesis ha sido subida con éxito.", "success");
    } catch (error) {
      console.error("Error al subir la tesis:", error);
      Swal.fire("Error", "No se pudo subir la tesis.", "error");
    }
  };

  const handleNotaChange = (value) => {
    const newValue = Math.min(7, Math.max(1, parseFloat(value).toFixed(1)));
    if (isNaN(newValue) || newValue < 1 || newValue > 7) {
      Swal.fire(
        "Error",
        "Debe ingresar una nota válida entre 1 y 7 con un solo decimal.",
        "error"
      );
      return;
    }
    setNota(newValue);
  };

  const handleIncrement = () => {
    handleNotaChange((parseFloat(nota) + 0.1).toFixed(1));
  };

  const handleDecrement = () => {
    handleNotaChange((parseFloat(nota) - 0.1).toFixed(1));
  };

  return (
    <Paper sx={{ padding: "20px", marginBottom: "20px", width: "100%" }}>
      <Typography variant="h5" gutterBottom component="div">
        Guía
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell align="right">RUT</TableCell>
              <TableCell align="right">Nota Guía</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.alumno_RUT}>
                  <TableCell component="th" scope="row">
                    {row.alumnoNombre}
                  </TableCell>
                  <TableCell align="right">{row.alumno_RUT}</TableCell>
                  <TableCell align="right">
                    {row.nota_guia || "No asignada"}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      onClick={() => handleClickOpen(row)}
                    >
                      Gestionar Rúbrica, Nota y Tesis
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Gestionar Rúbrica, Nota y Título de Tesis del Alumno</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            Nota del Guía (Ingrese un valor entre 1 y 7, con un solo decimal):
          </Typography>
          <Box
            sx={{
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <IconButton onClick={handleDecrement} disabled={nota <= 1}>
              <Remove />
            </IconButton>
            <TextField
              margin="dense"
              id="nota"
              label="Nota del Guía"
              type="number"
              inputProps={{ min: 1, max: 7, step: 0.1 }}
              value={nota}
              onChange={(e) => handleNotaChange(e.target.value)}
              fullWidth
              variant="outlined"
            />
            <IconButton onClick={handleIncrement} disabled={nota >= 7}>
              <Add />
            </IconButton>
          </Box>
          <TextField
            margin="dense"
            id="tituloTesis"
            label="Título de la Tesis"
            type="text"
            fullWidth
            value={tituloTesis}
            onChange={(e) => setTituloTesis(e.target.value)}
            variant="outlined"
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <Button
              onClick={handleConfirmarTituloTesis}
              variant="contained"
              color="primary"
              disabled={tesisConfirmada}
            >
              Confirmar Título de Tesis
            </Button>
          </Box>
          <Box sx={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <Button onClick={handleDownload}>Descargar Rúbrica</Button>
            <Button component="label">
              Subir Rúbrica en PDF (.PDF)
              <input
                type="file"
                accept="application/pdf"
                hidden
                onChange={handleFileChange}
              />
            </Button>
          </Box>
          {file && !rubricaSubida && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              <Button
                onClick={handleConfirm}
                variant="contained"
                color="primary"
              >
                Confirmar Subida y Guardar Nota
              </Button>
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <Button component="label">
              Subir Tesis en PDF (.PDF)
              <input
                type="file"
                accept="application/pdf"
                hidden
                onChange={handleFileChangeTesis}
              />
            </Button>
          </Box>
          {fileTesis && !tesisSubida && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              <Button
                onClick={handleUploadTesis}
                variant="contained"
                color="primary"
              >
                Confirmar Subida de Tesis
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default GuiaTable;
