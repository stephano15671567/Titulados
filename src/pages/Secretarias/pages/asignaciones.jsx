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
import DashBoard from "../Dashboard/DashBoard";

export default function Asignaciones() {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [open, setOpen] = useState(false);
  const [showAssignments, setShowAssignments] = useState(false);
  const [error, setError] = useState("");
  const [alumnos, setAlumnos] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedAlumno, setSelectedAlumno] = useState("");
  const [formDataEdit, setFormDataEdit] = useState({
    profesor: "",
    rol: "",
  });

  const toggleAssignments = async () => {
    await fetchFetchedAssignments(); // Asegurarse de actualizar las asignaciones antes de mostrarlas
    setShowAssignments(!showAssignments);
  };

  const handleModifyClick = (assignment) => {
    setCurrentAssignment(assignment);
    setEditModalOpen(true);
  };

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const handleCloseedit = () => setEditModalOpen(false);

  const handleAlumnoChange = (event) => {
    const alumnoId = event.target.value;
    setSelectedAlumno(alumnoId);
    fetchAssignments(alumnoId);
  };

  const handleProfesorChange = (rol, profesorId) => {
    setAssignments((prevAssignments) => ({
      ...prevAssignments,
      [rol]: profesorId,
    }));
  };

  const fetchAlumnos = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/alumnos");
      setAlumnos(response.data);
    } catch (error) {
      console.error("Error fetching alumnos:", error);
    }
  };

  const fetchProfesores = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/profesores");
      setProfesores(response.data);
    } catch (error) {
      console.error("Error fetching profesores:", error);
    }
  };

  const fetchAssignments = async (alumnoId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/asignaciones/${alumnoId}`);
      const assignmentsMap = response.data.reduce((acc, curr) => {
        acc[curr.rol] = curr.profesor_id || "";
        return acc;
      }, {});
      setAssignments(assignmentsMap);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  const handleAssign = async () => {
    try {
      const roles = ["guia", "informante", "secretario", "presidente"];
      for (const rol of roles) {
        if (assignments[rol]) {
          await axios.post("http://localhost:4000/api/asignaciones", {
            alumnoId: selectedAlumno,
            profesorId: assignments[rol],
            rol,
          });
        }
      }
      Swal.fire("Éxito", "Asignaciones guardadas correctamente", "success");
      handleClose(); // Cerrar el modal después de guardar
      fetchFetchedAssignments(); // Actualizar las asignaciones para visualizarlas sin recargar
    } catch (error) {
      console.error("Error al asignar profesores:", error);
      setError("Error al asignar profesores");
    }
  };

  const notificarCorreo = async (assignmentId) => {
    try {
      const response = await axios.post(`http://localhost:4000/api/correo_send/notificar/${assignmentId}/`);
      console.log("Correo enviado:", response.data);
    } catch (error) {
      console.error("Error al enviar correo:", error);
    }
  };

  const handleNotify = async (assignmentId) => {
    try {
      await notificarCorreo(assignmentId);
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Se ha notificado al profesor correctamente.',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Hubo un problema al notificar al profesor. Inténtalo de nuevo más tarde.',
      });
    }
  };

  const handleDownload = (assignment) => {
    console.log("Downloading assignment with ID:", assignment.alumno_RUT);
    window.open(`http://localhost:4000/api/archivos/${assignment.alumno_RUT}`);
  };

  const fetchFetchedAssignments = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/asignaciones");
      setAssignments(response.data || []); // Aseguramos que sea un array
    } catch (error) {
      console.error("Error fetching fetched assignments:", error);
      setAssignments([]); // Si hay error, aseguramos que assignments sea un array vacío
    }
  };

  const handleDeletedb = async (assignmentId) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/asignaciones/${assignmentId}`);
      console.log("Asignación eliminada:", response.data);
      fetchFetchedAssignments();
    } catch (error) {
      console.error("Error deleting assignment:", error);
    }
  };

  const handleDelete = (assignmentId) => {
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
      }
    });
  };

  const modifyAssignment = async () => {
    setError("");
    try {
      const response = await axios.put(
        `http://localhost:4000/api/asignaciones/${currentAssignment.asignacion_id}`,
        {
          alumnoId: currentAssignment.alumno_RUT,
          profesorId: formDataEdit.profesor,
          rol: formDataEdit.rol,
        }
      );
      console.log("Updated assignment data:", response.data);
      fetchFetchedAssignments();
      setEditModalOpen(false);
      Swal.fire('Asignación actualizada', 'La asignación ha sido actualizada con éxito.', 'success');
    } catch (error) {
      setError("No se puede asignar al mismo profesor");
    }
  };

  const handleModify = (event) => {
    event.preventDefault();
    modifyAssignment();
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setFormDataEdit((prevFormDataEdit) => ({
      ...prevFormDataEdit,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchAlumnos();
    fetchProfesores();
    fetchFetchedAssignments();
  }, []);

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

  return (
    <>
      <DashBoard />
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
          <Box sx={{ mt: 2 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Alumno</InputLabel>
              <Select value={selectedAlumno || ""} label="Alumno" onChange={handleAlumnoChange}>
                {alumnos.map((alumno) => (
                  <MenuItem key={alumno.RUT} value={alumno.RUT}>
                    {alumno.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedAlumno && (
              <>
                <Typography variant="h6">Asignar Profesores</Typography>
                {["guia", "informante", "secretario", "presidente"].map((rol) => (
                  <Box key={rol} sx={{ mb: 2 }}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>{rol.charAt(0).toUpperCase() + rol.slice(1)}</InputLabel>
                      <Select value={assignments[rol] || ""} onChange={(e) => handleProfesorChange(rol, e.target.value)}>
                        <MenuItem value="">No Asignado</MenuItem>
                        {profesores.map((profesor) => (
                          <MenuItem key={profesor.profesor_id} value={profesor.profesor_id}>
                            {profesor.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                ))}
              </>
            )}

            <Button variant="contained" onClick={handleAssign}>Guardar Asignaciones</Button>
          </Box>
        </Box>
      </Modal>

      {showAssignments && Array.isArray(assignments) && assignments.length > 0 && (
        <TableContainer component={Paper} style={{ width: '50%', float: 'right', marginRight: '10px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Alumno</TableCell>
                <TableCell>Profesor</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((assignment, index) => (
                <TableRow key={index}>
                  <TableCell>{assignment.alumno_nombre}</TableCell>
                  <TableCell>{assignment.nombre_profesor}</TableCell>
                  <TableCell>{assignment.rol}</TableCell>
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
          <Typography id="modal-modal-title" variant="h6" component="h2">Modificar Asignación</Typography>
          {currentAssignment && (
            <>
              <Box component="form" onSubmit={handleModify} sx={{ mt: 2 }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <InputLabel>Alumno</InputLabel>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <Input disabled defaultValue={currentAssignment.alumno_RUT + " " + currentAssignment.alumno_nombre} />
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Profesor</InputLabel>
                  <Select name="profesor" value={formDataEdit.profesor || ""} label="Profesor" onChange={handleEditChange}>
                    {profesores.map((profesor) => (
                      <MenuItem key={profesor.profesor_id} value={profesor.profesor_id}>
                        {profesor.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Rol</InputLabel>
                  <Select name="rol" value={formDataEdit.rol} label="Rol" onChange={handleEditChange}>
                    <MenuItem value="guia">Guía</MenuItem>
                    <MenuItem value="informante">Informante</MenuItem>
                    <MenuItem value="secretario">Secretario</MenuItem>
                    <MenuItem value="presidente">Presidente</MenuItem>
                  </Select>
                </FormControl>

                <Button variant="contained" type="submit">Modificar Asignación</Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}
