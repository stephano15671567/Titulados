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
const api = "https://10.100.32.192:4001/";

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
    // Mostrar mensaje de éxito con Swal
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Se ha notificado al profesor correctamente.',
    });
  } catch (error) {
    console.error("Error fetching fetched assignments:", error);
    // Mostrar mensaje de error con Swal
    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: 'Hubo un problema al notificar al profesor. Inténtalo de nuevo más tarde.',
    });
  }
}; 
 
  const handleDownload = (assignment) => {
    console.log("Downloading assignment with ID:", assignment.alumno_RUT);
    window.open(`${api}api/archivos/${assignment.alumno_RUT}`);
  };


  const fetchAlumnos = async () => {
    try {
      const response = await axios.get(api+"api/alumnos");
      setAlumnos(response.data);
    } catch (error) {
      console.error("Error fetching fetched assignments:", error);
    }
  };

  const notificarCorreo = async (assignmentId) => {
    try {
      const response = await axios.post(
        `${api}apiapi/correo_send/notificar/${assignmentId}/`
      );
      console.log("Correo enviado:", response.data);
    } catch (error) {
      console.error("Error fetching fetched assignments:", error);
    }
  };


  const fetchProfesores = async () => {
    try {
      const response = await axios.get(api +"api/profesores");
      setProfesores(response.data);
    } catch (error) {
      console.error("Error fetching fetched assignments:", error);
    }
  };

  const fetchFetchedAssignments = async () => {
    try {
      const response = await axios.get(
        api+"api/asignaciones"
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
        `${api}api/asignaciones/${assignmentId}`
      );
      console.log("Asignación eliminada:", response.data);
      fetchFetchedAssignments();
    } catch (error) {
      console.error("Error deleting assignment:", error);
    }
  };

  

  const handleDelete = (assignmentId) => {
  console.log("Deleting assignment with ID:", assignmentId);

  // Mostrar mensaje de confirmación utilizando Swal
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
      // Si el usuario confirma, eliminar la asignación
      handleDeletedb(assignmentId);
    } else {
      // Si el usuario cancela, no hacer nada
      console.log("Eliminación cancelada por el usuario.");
    }
  });
};

  const modifyAssignment = async (alumnoId) => {
  setError("");

  try {
    const response = await axios.put(
      `${api}api/asignaciones/${currentAssignment.asignacion_id}`,
      {
        alumnoId: currentAssignment.alumno_RUT,
        profesorId: formDataEdit.profesor,
        rol: formDataEdit.rol,

      }
    );
    console.log("Updated assignment data:", response.data);
    fetchFetchedAssignments();
    setEditModalOpen(false); // Close the modal

    // Mostrar mensaje de éxito con Swal
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

  const handleModify = (alumnoId) => {
    alumnoId.preventDefault();
    modifyAssignment();
    fetchFetchedAssignments();
  };

  const handleAssign = async (alumnoId) => {
  alumnoId.preventDefault();
  setError("");
  try {
    const response = await axios.post(
      api+"api/asignaciones",
      {
        alumnoId: formData.alumno,
        profesorId: formData.profesor,
        rol: formData.rol,
      }
    );
    // Handle success
    fetchFetchedAssignments();
    console.log("Asignación creada:", response.data);

    // Mostrar mensaje de éxito con Swal
    Swal.fire(
      'Asignación creada',
      'La asignación ha sido creada con éxito.',
      'success'
    );

    // Cerrar la ventana modal después de un breve retraso
    setTimeout(() => {
      handleClose();
    }, 1000); // 1000ms = 1 segundo (puedes ajustar este valor según tu preferencia)
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
  return (
    <>
     <Box sx={{ display: 'flex', justifyContent: 'center', mb: '15px' }}>
  <Box mr={1}>
    <Button variant="contained" onClick={handleOpen} color="primary">
      Generar Asignación
    </Button>
  </Box>
  <Button variant="contained" onClick={toggleAssignments} color="secondary">
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
              mb: 2, // Margin bottom for spacing
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
              Crear Asignación
            </Button>
          </Box>
        </Box>
      </Modal>

      {showAssignments && (
        <TableContainer component={Paper}>
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
                    <Button
                      onClick={() => handleModifyClick(assignment)}
                      startIcon={<EditIcon />}
                    >
                      Modificar
                    </Button>
                    <Button
                      onClick={() => handleDelete(assignment.asignacion_id)} // Replace 'id' with your unique identifier
                      startIcon={<DeleteIcon />}
                      color="error"
                    >
                      Eliminar
                    </Button>
                    <Button
                      onClick={() => handleNotify(assignment.asignacion_id)} // Replace 'id' with your unique identifier
                      startIcon={<AttachEmailIcon />}
                      color="success"
                    >
                      Notificar profesor
                    </Button>
                    <Button
                      onClick={() => handleDownload(assignment)} // Replace 'id' with your unique identifier
                      startIcon={<RemoveRedEyeIcon />}
                      color="success"
                    >
                      Ver Ficha
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Modificar Asignación
          </Typography>
          {currentAssignment && (
            <>
              <Box sx={modalStyle}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2, // Margin bottom for spacing
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
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}