import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import DashBoard from "../Dashboard/DashBoard"; // Mantener esta importación
import { DataGrid } from "@mui/x-data-grid";

function Archivos() {
  const [selectedFile, setSelectedFile] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState("");
  const [acceptedFileTypes, setAcceptedFileTypes] = useState("");
  const [studentRut, setStudentRut] = useState("");
  const [type, setType] = useState("");
  const [file, setFile] = useState(null);
  const [guiaNumber, setGuiaNumber] = useState("");
  const [guiaTesisName, setGuiaTesisName] = useState(1.0);
  const [informanteNumber, setInformanteNumber] = useState(1.0);
  const [loadingDownload, setLoadingDownload] = useState(false);

  useEffect(() => {
    const fetchFollowUps = async () => {
      try {
        const response = await axios.get(`https://apisst.administracionpublica-uv.cl/api/alumnos/`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchFollowUps();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClose = (selection, rut) => {
    setStudentRut(rut);
    let content = "";
    let fileTypes = "";
    switch (selection) {
      case "ficha":
        content = "Sube un archivo .docx para la ficha del estudiante.";
        fileTypes = ".docx";
        setType("ficha");
        break;
      case "guia":
        content = "Sube un archivo .pdf para la rúbrica de guía.";
        fileTypes = ".pdf";
        setType("guia");
        break;
      case "informante":
        content = "Sube un archivo .xlsx para la rúbrica de informante.";
        fileTypes = ".xlsx";
        setType("informante");
        break;
      case "tesis":
        content = "Sube un archivo .pdf para la tesis.";
        fileTypes = ".pdf";
        setType("tesis");
        break;
      default:
        content = "Opción no válida.";
    }

    setDialogContent(content);
    setAcceptedFileTypes(fileTypes);
    setDialogOpen(true);
    setAnchorEl(null);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedFile(null);
  };

  const handleFileChangeStudent = (event) => {
    const selected = event.target.files[0];
    if (!selected) return;

    const fileExtension = selected.name.split(".").pop().toLowerCase();
    const acceptedExtensions = acceptedFileTypes
      .split(",")
      .map((ext) => ext.trim().slice(1));

    if (!acceptedExtensions.includes(fileExtension)) {
      Swal.fire({
        icon: "error",
        title: "Tipo de archivo no válido",
        text: `Por favor, sube un archivo con una de las siguientes extensiones: ${acceptedFileTypes}`,
        showConfirmButton: true,
      });
      return;
    }

    setFile(selected);
    setUploadStatus("");
  };

  const handleFileUploadStudent = async () => {
    if (!file) {
      Swal.fire({
        icon: "warning",
        title: "Por favor selecciona un archivo para subir",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    if (!studentRut) {
      Swal.fire({
        icon: "error",
        title: "RUT de estudiante no válido",
        text: "Por favor, selecciona un estudiante válido",
        showConfirmButton: true,
      });
      return;
    }

    switch (type) {
      case "ficha":
        try {
          setDialogOpen(false);
          const formData = new FormData();
          formData.append("file", file);
          Swal.fire({
            title: "Por favor espera",
            text: "Subiendo archivo...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
          });
          await axios.post(
            `https://apisst.administracionpublica-uv.cl/api/archivos/${studentRut}`,
            formData
          );
          Swal.close();
          Swal.fire("Subida exitosa", "Ficha ha sido subida correctamente", "success");
          setFile(null);
        } catch (error) {
          Swal.close();
          Swal.fire(
            "Error",
            "Hubo un error al subir el archivo, pruebe nuevamente más tarde.",
            "error"
          );
          console.error("Error al subir el archivo:", error);
          setFile(null);
        }
        break;

      case "guia":
        try {
          setDialogOpen(false);
          const formData = new FormData();
          formData.append("file", file);
          if (!guiaNumber || !guiaTesisName) {
            Swal.fire({
              icon: "error",
              title: "Campos vacíos",
              text: "Por favor, completa los campos requeridos",
              showConfirmButton: true,
            });
            return;
          }
          Swal.fire({
            title: "Por favor espera",
            text: "Subiendo archivo...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
          });
          await axios.post(
            `https://apisst.administracionpublica-uv.cl/api/archivos/subir/rubrica/guia/${studentRut}`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          const payload = { tesis: guiaTesisName };
          await axios.patch(`https://apisst.administracionpublica-uv.cl/api/alumnos/${studentRut}/tesis`, payload);
          const asignment = await axios.get(
            `https://apisst.administracionpublica-uv.cl/api/notas/obtainid/${studentRut}`
          );
          const profesorId = asignment.data.find((item) => item.rol === "guia").profesor_id;
          const payloadNotas = {
            alumno_RUT: studentRut,
            nota: guiaNumber,
            profesor_id: profesorId,
            rol: "guia",
          };
          await axios.post(`https://apisst.administracionpublica-uv.cl/api/notas/upsert`, payloadNotas);
          Swal.close();
          Swal.fire("Subida exitosa", "Rúbrica de guía ha sido subida correctamente", "success");
          setFile(null);
        } catch (error) {
          console.error("Error al subir el archivo:", error);
          setFile(null);
        }
        break;

      case "informante":
        try {
          setDialogOpen(false);
          if (!informanteNumber) {
            Swal.fire({
              icon: "error",
              title: "Campos vacíos",
              text: "Por favor, completa los campos requeridos",
              showConfirmButton: true,
            });
            return;
          }
          Swal.fire({
            title: "Por favor espera",
            text: "Subiendo archivo...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
          });
          const formData = new FormData();
          formData.append("file", file);
          await axios.post(
            `https://apisst.administracionpublica-uv.cl/api/archivos/subir/rubrica/informante/${studentRut}`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          const asignment = await axios.get(
            `https://apisst.administracionpublica-uv.cl/api/notas/obtainidinformante/${studentRut}`
          );
          const profesorId = asignment.data.find((item) => item.rol === "informante").profesor_id;
          const payload = {
            alumno_RUT: studentRut,
            nota: informanteNumber,
            profesor_id: profesorId,
            rol: "informante",
          };
          await axios.post(`https://apisst.administracionpublica-uv.cl/api/notas/upsert`, payload);
          Swal.close();
          Swal.fire(
            "Subida exitosa",
            "Rúbrica de informante ha sido subida correctamente",
            "success"
          );
          setFile(null);
        } catch (error) {
          Swal.close();
          console.error("Error al subir el archivo:", error);
          setFile(null);
        }
        break;

      case "tesis":
        try {
          setDialogOpen(false);
          if (!file) {
            Swal.fire({
              icon: "error",
              title: "Por favor selecciona un archivo para subir",
              showConfirmButton: false,
              timer: 2000,
            });
            return;
          }
          Swal.fire({
            title: "Por favor espera",
            text: "Subiendo archivo...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
          });
          const formData = new FormData();
          formData.append("tesis", file);
          await axios.post(
            `https://apisst.administracionpublica-uv.cl/api/archivos/subir/tesis/${studentRut}`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          Swal.close();
          Swal.fire("Subida exitosa", "Tesis ha sido subida correctamente", "success");
          setFile(null);
        } catch (error) {
          Swal.close();
          Swal.fire(
            "Error",
            "Hubo un error al subir el archivo, pruebe nuevamente más tarde.",
            "error"
          );
          console.error("Error al subir el archivo:", error);
        }
        break;
      default:
        setFile(null);
        setDialogOpen(false);
        setStudentRut("");
        console.error("Tipo de archivo no válido");
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadStatus("");
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      Swal.fire({
        icon: "warning",
        title: "Por favor selecciona un archivo para subir",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("archivo", selectedFile);

    try {
      await axios.post("https://apisst.administracionpublica-uv.cl/upload/", formData);
      setUploadStatus("Archivo subido con éxito");
    } catch (error) {
      setUploadStatus("Error al subir el archivo");
      console.error("Error al subir el archivo:", error);
    }
  };

  const handleDownloadReport = async () => {
    const token = window.sessionStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "No autenticado",
        text: "Por favor inicia sesión para descargar el reporte",
      });
      return;
    }

    setLoadingDownload(true);

    try {
      const response = await fetch("https://apisst.administracionpublica-uv.cl/api/report/download-report", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al descargar el archivo");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "reporte.xlsx";
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al descargar",
        text: error.message || "Hubo un problema al descargar el reporte",
      });
      console.error("Error al descargar el archivo:", error);
    } finally {
      setLoadingDownload(false);
    }
  };

  const columns = [
    { field: "RUT", headerName: "rut", width: 150 },
    { field: "nombre", headerName: "Nombre", width: 150 },
    {
      field: "actions",
      headerName: "Acciones",
      width: 300,
      renderCell: (params) => {
        return (
          <Box>
            <Button variant="contained" color="primary" onClick={handleClick}>
              Subir archivo
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{ "aria-labelledby": "basic-button" }}
            >
              <MenuItem onClick={() => handleClose("ficha", params.row.RUT)}>
                Ficha del estudiante
              </MenuItem>
              <MenuItem onClick={() => handleClose("guia", params.row.RUT)}>
                Rúbrica de Guía
              </MenuItem>
              <MenuItem onClick={() => handleClose("informante", params.row.RUT)}>
                Rúbrica de informante
              </MenuItem>
              <MenuItem onClick={() => handleClose("tesis", params.row.RUT)}>
                Tesis
              </MenuItem>
            </Menu>
          </Box>
        );
      },
    },
  ];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const drawerWidth = 240;
  const appBarHeight = 64;

  return (
    <main>
      <DashBoard /> {/* Se mantiene aquí */}
      <Box
        sx={{
          ml: { sm: `${drawerWidth}px` }, // Margen izquierdo para compensar el Drawer
          mt: `${appBarHeight}px`, // Margen superior para compensar el AppBar
          p: 3, // Padding general para el contenido
          width: { sm: `calc(100% - ${drawerWidth}px)` }, // Ajustar el ancho para no desbordar
          boxSizing: 'border-box', // Asegurar que el padding no añada ancho extra
        }}
      >
        <Box sx={{ bgcolor: "#f0f0f0", p: 2, mb: 2, width: "100%" }}>
          <Typography variant="h6" mb={1}>
            Subir Archivo
          </Typography>
          <Typography variant="body1" mb={2}>
            Por favor selecciona un archivo y haz clic en "Subir Archivo".
          </Typography>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".xlsx, .xls, .csv"
            style={{ display: "none" }}
            id="raised-button-file"
          />
          <label
            htmlFor="raised-button-file"
            style={{ width: "100%", marginBottom: "16px" }}
          >
            <Button
              variant="contained"
              fullWidth
              sx={{ bgcolor: "#0093ff", color: "white" }}
              component="span"
            >
              Seleccionar archivo
            </Button>
          </label>
          <Button
            variant="contained"
            fullWidth
            sx={{ bgcolor: "#4CAF50", color: "white" }}
            onClick={handleFileUpload}
          >
            Subir Archivo
          </Button>

          <Button
            variant="contained"
            fullWidth
            sx={{ bgcolor: "#FFA726", color: "white", mt: 2 }}
            onClick={handleDownloadReport}
            disabled={loadingDownload}
          >
            {loadingDownload ? "Descargando..." : "Descargar Reporte"}
          </Button>
        </Box>

        {uploadStatus && <Typography sx={{ mt: 2 }}>{uploadStatus}</Typography>}

        <Box sx={{ bgcolor: "#f0f0f0", p: 2, mb: 2, width: "100%" }}>
          <Typography variant="h6" mb={1}>
            Subir archivos manualmente a alumnos
          </Typography>
          <TextField
            label="Buscar por nombre"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <DataGrid
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
            }}
            pageSizeOptions={[10, 100, { value: users.length, label: "All" }]}
            rows={filteredUsers}
            columns={columns}
            getRowId={(row) => row.RUT}
            sx={{ height: "100%", width: "100%" }}
          />
        </Box>

        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Opción seleccionada</DialogTitle>
          <DialogContent>
            <DialogContentText>{dialogContent}</DialogContentText>
            {(type === "guia" || type === "informante") && (
              <>
                {type === "guia" && (
                  <TextField
                    label="Nota de Guía"
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                    required
                    type="number"
                    inputProps={{ step: "0.1", min: 1.0, max: 7.0 }}
                    onChange={(e) => {
                      let value = parseFloat(e.target.value);
                      if (value < 1.0) value = 1.0;
                      if (value > 7.0) value = 7.0;
                      setGuiaNumber(value);
                    }}
                    value={guiaNumber}
                  />
                )}
                {type === "guia" && (
                  <TextField
                    label="Nombre Tesis"
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                    required
                    onChange={(e) => setGuiaTesisName(e.target.value)}
                  />
                )}
                {type === "informante" && (
                  <TextField
                    label="Nota de Informante"
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                    required
                    type="number"
                    inputProps={{ step: "0.1", min: 1.0, max: 7.0 }}
                    onChange={(e) => {
                      let value = parseFloat(e.target.value);
                      if (value < 1.0) value = 1.0;
                      if (value > 7.0) value = 7.0;
                      setInformanteNumber(value);
                    }}
                    value={informanteNumber}
                  />
                )}
              </>
            )}
            {(type === "ficha" ||
              type === "guia" ||
              type === "informante" ||
              type === "tesis") && (
            <input
              type="file"
              onChange={handleFileChangeStudent}
              accept={acceptedFileTypes}
              style={{ display: "block", marginTop: "16px" }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleFileUploadStudent}
            disabled={
              !file ||
              (type === "guia" && (!guiaNumber || !guiaTesisName)) ||
              (type === "informante" && !informanteNumber)
            }
          >
            Subir Archivo
          </Button>
          <Button onClick={handleDialogClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
    </main>
  );
}

export default Archivos;