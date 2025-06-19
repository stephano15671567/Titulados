import React, { useState, useEffect } from "react";
import axios from "axios";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AttachEmailIcon from '@mui/icons-material/AttachEmail';
import Swal from 'sweetalert2';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
} from "@mui/material";
import DashBoard from "../Dashboard/DashBoard"; // Mantener esta importación

export default function Asignaciones() {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);

  const handleModifyClick = (assignment) => {
    setCurrentAssignment(assignment);
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
  const [assignments, setAssignments] = useState({}); // { [alumnoId]: { profesorId, rol } }
  const toggleAssignments = () => {
    setShowAssignments(!showAssignments); // Toggle the visibility of the assignments table
  };

  const [formDataEdit, setFormDataEdit] = useState({
    alumno: "",
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
        icon: 'success',
        title: '¡Éxito!',
        text: 'Se ha notificado al profesor correctamente.',
      });
    } catch (error) {
      console.error("Error fetching fetched assignments:", error);
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Hubo un problema al notificar al profesor. Inténtalo de nuevo más tarde.',
      });
    }
  };

  const handleDownload = (assignment) => {
    console.log("Downloading assignment with ID:", assignment.alumno_RUT);
    window.open(`https://apisst.administracionpublica-uv.cl/api/archivos/${assignment.alumno_RUT}`);
  };

  const fetchAlumnos = async () => {
    try {
      const response = await axios.get("https://apisst.administracionpublica-uv.cl/api/alumnos");
      setAlumnos(response.data);
    } catch (error) {
      console.error("Error fetching fetched assignments:", error);
    }
  };

  const notificarCorreo = async (assignmentId) => {
    try {
      const response = await axios.post(
        `https://apisst.administracionpublica-uv.cl/api/correo_send/notificar/${assignmentId}/`
      );
      console.log("Correo enviado:", response.data);
    } catch (error) {
      console.error("Error fetching fetched assignments:", error);
    }
  };

  const fetchProfesores = async () => {
    try {
      const response = await axios.get("https://apisst.administracionpublica-uv.cl/api/profesores");
      const sortedProfesores = response.data.sort((a, b) => a.nombre.localeCompare(b.nombre));
      setProfesores(sortedProfesores);
    } catch (error) {
      console.error("Error fetching profesores:", error);
    }
  };

  const fetchFetchedAssignments = async () => {
    try {
      const response = await axios.get(
        "https://apisst.administracionpublica-uv.cl/api/asignaciones/"
      );
      setAssignments(response.data);
    } catch (error) {
      console.error("Error fetching fetched assignments:", error);
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
    } catch (error) {
      console.error("Error deleting assignment:", error);
    }
  };

  const handleDelete = (assignmentId) => {
    console.log("Deleting assignment with ID:", assignmentId);

    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!'
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
        'Asignación actualizada',
        'La asignación ha sido actualizada con éxito.',
        'success'
      );
    } catch (error) {
      console.log(error);
      setError("No se puede asignar al mismo profesor");
    }
  };

  const handleModify = (event) => { // Cambiado a 'event' en lugar de 'alumnoId'
    event.preventDefault();
    modifyAssignment();
    fetchFetchedAssignments();
  };

  const handleAssign = async (event) => { // Cambiado a 'event' en lugar de 'alumnoId'
    event.preventDefault(); // Asegúrate de prevenir el comportamiento por defecto del formulario
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
        'Asignación creada',
        'La asignación ha sido creada con éxito.',
        'success'
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

  const drawerWidth = 240; // Definir drawerWidth aquí para usarlo en los estilos del Box
  const appBarHeight = 64; // Altura típica de un AppBar en Material-UI

  return (
    <>
      <DashBoard/> {/* Se mantiene aquí */}
      <Box
        sx={{
          ml: { sm: `${drawerWidth}px` }, // Margen izquierdo para compensar el Drawer
          mt: `${appBarHeight}px`, // Margen superior para compensar el AppBar
          p: 3, // Padding general para el contenido
          width: { sm: `calc(100% - ${drawerWidth}px)` }, // Ajustar el ancho para no desbordar
          boxSizing: 'border-box', // Asegurar que el padding no añada ancho extra
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: '10px' }}>
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
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography id="modal-modal-title" variant="h6" component="h2">Crear Asignación</Typography>
              <Button variant="outlined" onClick={handleClose} startIcon={<HighlightOffIcon />}>Cerrar</Button>
            </Box>
            <Box component="form" onSubmit={handleAssign} sx={{ mt: 2 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Alumno</InputLabel>
                <Select value={currentAssignment?.alumno || ""} label="Alumno" onChange={(e) => setFormData(prev => ({...prev, alumno: e.target.value}))}> {/* Asegura que selectedAlumno se use correctamente */}
                  {alumnos.map((alumno) => (
                    <MenuItem key={alumno.RUT} value={alumno.RUT}>
                      {alumno.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Profesor</InputLabel>
                <Select value={formData.profesor || ""} label="Profesor" name="profesor" onChange={handleInputChange}>
                  {profesores.map((profesor) => (
                    <MenuItem key={profesor.profesor_id} value={profesor.profesor_id}>
                      {profesor.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Rol</InputLabel>
                <Select value={formData.rol} label="Rol" name="rol" onChange={handleInputChange}>
                  <MenuItem value="guia">Guía</MenuItem>
                  <MenuItem value="informante">Informante</MenuItem>
                  <MenuItem value="secretario">Secretario</MenuItem>
                  <MenuItem value="presidente">Presidente</MenuItem>
                </Select>
              </FormControl>

              <Button variant="contained" type="submit">Guardar Asignaciones</Button>
            </Box>
          </Box>
        </Modal>

        {showAssignments && Array.isArray(assignments) && assignments.length > 0 && (
          <TableContainer component={Paper} style={{ width: '100%' /* Ajustado a 100% */, margin: '20px 0' /* Centrado, sin float */ }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Alumno</TableCell>
                  <TableCell>Profesor</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Fecha de Asignación</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map((assignment, index) => (
                  <TableRow key={index}>
                    <TableCell>{assignment.alumno_nombre}</TableCell>
                    <TableCell>{assignment.nombre_profesor}</TableCell>
                    <TableCell>{assignment.rol}</TableCell>
                    <TableCell>{new Date(assignment.fechaAsignacion).toLocaleString()}</TableCell>
                    <TableCell>
                      <div>
                        <Button onClick={() => handleModifyClick(assignment)} startIcon={<EditIcon />} size="small" style={{ marginBottom: '8px' }}>Modificar</Button>
                        <Button onClick={() => handleDelete(assignment.asignacion_id)} startIcon={<DeleteIcon />} color="error" size="small" style={{ marginBottom: '8px' }}>Eliminar</Button>
                        <Button onClick={() => handleNotify(assignment.asignacion_id)} startIcon={<AttachEmailIcon />} color="success" size="small" style={{ marginBottom: '8px' }}>Notificar profesor</Button>
                        <Button onClick={() => handleDownload(assignment)} startIcon={<RemoveRedEyeIcon />} color="success" size="small" style={{ marginBottom: '8px' }}>Ver Ficha</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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