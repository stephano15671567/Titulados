import React, { useState, useEffect } from "react";
import axios from "axios";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import Swal from "sweetalert2";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Paper,
  Button,
  Modal,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Input,
  TextField, // Import TextField for the search bar
} from "@mui/material";
import DashBoard from "../Dashboard/DashBoard";

export default function Asignaciones() {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term

  const handleModifyClick = (assignment) => {
    setCurrentAssignment(assignment);
    setFormDataEdit({
      profesor: assignment.profesor_id,
      rol: assignment.rol,
    });
    setEditModalOpen(true);
  };

  const [open, setOpen] = useState(false);
  const [showAssignments, setShowAssignments] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCloseedit = () => setEditModalOpen(false);

  const [error, setError] = useState("");
  const [alumnos, setAlumnos] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const toggleAssignments = () => {
    setShowAssignments(!showAssignments);
  };

  const [formDataEdit, setFormDataEdit] = useState({
    profesor: "",
    rol: "",
  });

  const [formData, setFormData] = useState({
    alumno: "",
    profesor: "",
    rol: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setFormDataEdit((prevformDataEdit) => ({
      ...prevformDataEdit,
      [name]: value,
    }));
  };

  const handleNotify = async (assignmentId) => {
    console.log("Notifying professor with ID:", assignmentId);
    try {
      await notificarCorreo(assignmentId);
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Se ha notificado al profesor correctamente.",
      });
    } catch (error) {
      console.error("Error notifying professor:", error);
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "Hubo un problema al notificar al profesor. Inténtalo de nuevo más tarde.",
      });
    }
  };

  const handleDownload = (assignment) => {
    console.log("Downloading assignment with RUT:", assignment.alumno_RUT);
    window.open(
      `https://apisst.administracionpublica-uv.cl/api/archivos/${assignment.alumno_RUT}`
    );
  };

  const fetchAlumnos = async () => {
    try {
      const response = await axios.get(
        "https://apisst.administracionpublica-uv.cl/api/alumnos"
      );
      const sortedAlumnos = response.data.sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      );
      setAlumnos(sortedAlumnos);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const notificarCorreo = async (assignmentId) => {
    try {
      const response = await axios.post(
        `https://apisst.administracionpublica-uv.cl/api/correo_send/notificar/${assignmentId}/`
      );
      console.log("Correo enviado:", response.data);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const fetchProfesores = async () => {
    try {
      const response = await axios.get(
        "https://apisst.administracionpublica-uv.cl/api/profesores"
      );
      const sortedProfesores = response.data.sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      );
      setProfesores(sortedProfesores);
    } catch (error) {
      console.error("Error fetching professors:", error);
    }
  };

  const fetchFetchedAssignments = async () => {
    try {
      const response = await axios.get(
        "https://apisst.administracionpublica-uv.cl/api/asignaciones/"
      );
      setAssignments(response.data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  useEffect(() => {
    fetchAlumnos();
    fetchProfesores();
    fetchFetchedAssignments();
  }, []);

  const handleDeletedb = async (assignmentId) => {
    try {
      const response = await axios.delete(
        `https://apisst.administracionpublica-uv.cl/api/asignaciones/${assignmentId}`
      );
      console.log("Asignación eliminada:", response.data);
      fetchFetchedAssignments();
      Swal.fire("¡Eliminado!", "La asignación ha sido eliminada.", "success");
    } catch (error) {
      console.error("Error deleting assignment:", error);
      Swal.fire(
        "Error",
        "Hubo un problema al eliminar la asignación.",
        "error"
      );
    }
  };

  const handleDelete = (assignmentId) => {
    console.log("Deleting assignment with ID:", assignmentId);

    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeletedb(assignmentId);
      } else {
        console.log("Eliminación cancelada por el usuario.");
      }
    });
  };

  const modifyAssignment = async () => {
    setError("");

    try {
      const response = await axios.put(
        `https://apisst.administracionpublica-uv.cl/api/asignaciones/${currentAssignment.asignacion_id}`,
        {
          alumnoId: currentAssignment.alumno_RUT,
          profesorId: formDataEdit.profesor,
          rol: formDataEdit.rol,
        }
      );
      console.log("Updated assignment data:", response.data);
      fetchFetchedAssignments();
      setEditModalOpen(false);

      Swal.fire(
        "Asignación actualizada",
        "La asignación ha sido actualizada con éxito.",
        "success"
      );
    } catch (error) {
      console.log(error);
      setError("No se puede asignar al mismo profesor");
    }
  };

  const handleModify = (event) => {
    event.preventDefault();
    modifyAssignment();
  };

  const handleAssign = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        "https://apisst.administracionpublica-uv.cl/api/asignaciones",
        {
          alumnoId: formData.alumno,
          profesorId: formData.profesor,
          rol: formData.rol,
        }
      );
      fetchFetchedAssignments();
      console.log("Asignación creada:", response.data);

      Swal.fire(
        "Asignación creada",
        "La asignación ha sido creada con éxito.",
        "success"
      );

      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (error) {
      console.error("Error al crear asignación:", error.response.data);
      setError("Alumno ya fue previamente asignado");
    }
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const drawerWidth = 240;
  const appBarHeight = 64;

  // Filtered assignments based on search term
  const filteredAssignments = assignments.filter((assignment) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      assignment.alumno_nombre.toLowerCase().includes(searchTermLower) ||
      assignment.nombre_profesor.toLowerCase().includes(searchTermLower)
    );
  });

  const columns = [
    { field: "alumno_nombre", headerName: "Alumno", width: 200 },
    { field: "nombre_profesor", headerName: "Profesor", width: 200 },
    { field: "rol", headerName: "Rol", width: 150 },
    {
      field: "fechaAsignacion",
      headerName: "Fecha de Asignación",
      width: 200,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        const pad = (n) => n.toString().padStart(2, "0");
        const day = pad(date.getDate());
        const month = pad(date.getMonth() + 1);
        const year = date.getFullYear();
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());
        return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
      },
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 600,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          <Button
            onClick={() => handleModifyClick(params.row)}
            size="small"
            variant="outlined"
          > 
            Modificar
          </Button>
          <Button
            onClick={() => handleDelete(params.row.asignacion_id)}
            startIcon={<DeleteIcon />}
            color="error"
            size="small"
            variant="outlined"
          >
            Eliminar
          </Button>
          <Button
            onClick={() => handleNotify(params.row.asignacion_id)}
            startIcon={<AttachEmailIcon />}
            color="success"
            size="small"
            variant="outlined"
          >
            Notificar profesor
          </Button>
          <Button
            onClick={() => handleDownload(params.row)}
            startIcon={<RemoveRedEyeIcon />}
            color="primary"
            size="small"
            variant="outlined"
          >
            Ver Ficha
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <>
      <DashBoard />
      <Box
        sx={{
          ml: { sm: `${drawerWidth}px` },
          mt: `${appBarHeight}px`,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          boxSizing: "border-box",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: "10px" }}>
          <Box mr={1}>
            <Button variant="contained" onClick={handleOpen} color="success">
              Generar Asignación
            </Button>
          </Box>
          <Button variant="contained" onClick={toggleAssignments} color="error">
            Visualizar Asignaciones
          </Button>
        </Box>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Crear Asignación
              </Typography>
              <Button
                variant="outlined"
                onClick={handleClose}
                startIcon={<HighlightOffIcon />}
              >
                Cerrar
              </Button>
            </Box>
            <Box component="form" onSubmit={handleAssign} sx={{ mt: 2 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Alumno</InputLabel>
                <Select
                  name="alumno"
                  value={formData.alumno || ""}
                  label="Alumno"
                  onChange={handleInputChange}
                >
                  {alumnos.map((alumno) => (
                    <MenuItem key={alumno.RUT} value={alumno.RUT}>
                      {alumno.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Profesor</InputLabel>
                <Select
                  name="profesor"
                  value={formData.profesor || ""}
                  label="Profesor"
                  onChange={handleInputChange}
                >
                  {profesores.map((profesor) => (
                    <MenuItem
                      key={profesor.profesor_id}
                      value={profesor.profesor_id}
                    >
                      {profesor.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Rol</InputLabel>
                <Select
                  name="rol"
                  value={formData.rol}
                  label="Rol"
                  onChange={handleInputChange}
                >
                  <MenuItem value="guia">Guía</MenuItem>
                  <MenuItem value="informante">Informante</MenuItem>
                  <MenuItem value="secretario">Secretario</MenuItem>
                  <MenuItem value="presidente">Presidente</MenuItem>
                </Select>
              </FormControl>

              <Button variant="contained" type="submit">
                Guardar Asignaciones
              </Button>
            </Box>
          </Box>
        </Modal>

        {showAssignments && assignments.length > 0 && (
          <Box sx={{ height: 400, width: "100%", mt: 3 }}>
            <Paper sx={{ p: 2, mb: 2 }}> {/* Added padding and margin to Paper */}
              <TextField
                label="Buscar por nombre (alumno/profesor)"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 2 }} // Margin below the search bar
              />
              <DataGrid
                rows={filteredAssignments.map((assignment) => ({
                  ...assignment,
                  id: assignment.asignacion_id,
                }))}
                columns={columns}
                pageSizeOptions={[5, 10, 20]}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 50 },
                  },
                }}
              />
            </Paper>
          </Box>
        )}

        <Modal
          open={editModalOpen}
          onClose={handleCloseedit}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            {currentAssignment && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Modificar asignación
                  </Typography>

                  <Button
                    variant="outlined"
                    onClick={handleCloseedit}
                    startIcon={<HighlightOffIcon />}
                  >
                    Cerrar
                  </Button>
                </Box>
                <Box component="form" onSubmit={handleModify} sx={{ mt: 2 }}>
                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}
                  <InputLabel>Alumno</InputLabel>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <Input
                      disabled
                      defaultValue={
                        currentAssignment.alumno_RUT +
                        " " +
                        currentAssignment.alumno_nombre
                      }
                    />
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Profesor</InputLabel>
                    <Select
                      name="profesor"
                      value={formDataEdit.profesor || ""}
                      label="Profesor"
                      onChange={handleEditChange}
                    >
                      {profesores.map((profesor) => (
                        <MenuItem
                          key={profesor.profesor_id}
                          value={profesor.profesor_id}
                        >
                          {profesor.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Rol</InputLabel>
                    <Select
                      name="rol"
                      value={formDataEdit.rol}
                      label="Rol"
                      onChange={handleEditChange}
                    >
                      <MenuItem value="guia">Guía</MenuItem>
                      <MenuItem value="informante">Informante</MenuItem>
                      <MenuItem value="secretario">Secretario</MenuItem>
                      <MenuItem value="presidente">Presidente</MenuItem>
                    </Select>
                  </FormControl>

                  <Button variant="contained" type="submit">
                    Modificar Asignación
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Modal>
      </Box>
    </>
  );
}