import React, { useState, useEffect } from "react";
import axios from "axios";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AttachEmailIcon from '@mui/icons-material/AttachEmail';
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

  const handleNotify = (assignmentId) => {
    console.log("Notifying professor with ID:", assignmentId);
    notificarCorreo(assignmentId);
  };

  const fetchAlumnos = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/alumnos");
      setAlumnos(response.data);
    } catch (error) {
      console.error("Error fetching fetched assignments:", error);
    }
  };

  const notificarCorreo = async (assignmentId) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/correo_send/notificar/${assignmentId}/`
      );
      console.log("Correo enviado:", response.data);
    } catch (error) {
      console.error("Error fetching fetched assignments:", error);
    }
  };


  const fetchProfesores = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/profesores");
      setProfesores(response.data);
    } catch (error) {
      console.error("Error fetching fetched assignments:", error);
    }
  };

  const fetchFetchedAssignments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/asignaciones"
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
        `http://localhost:4000/api/asignaciones/${assignmentId}`
      );
      console.log("Asignación eliminada:", response.data);
      fetchFetchedAssignments();
    } catch (error) {
      console.error("Error deleting assignment:", error);
    }
  };

  const handleDelete = (assignmentId) => {
    console.log("Deleting assignment with ID:", assignmentId);
    handleDeletedb(assignmentId);
  };

  const modifyAssignment = async (alumnoId) => {
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
      setEditModalOpen(false); // Close the modal
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
        "http://localhost:4000/api/asignaciones",
        {
          alumnoId: formData.alumno,
          profesorId: formData.profesor,
          rol: formData.rol,
        }
      );
      // Handle success
      fetchFetchedAssignments();
      console.log("Asignación creada:", response.data);
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
      <Box mb="15px">
        <Button variant="contained" onClick={handleOpen}>
          Generar Asignación
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
                {/* Add more role options */}
              </Select>
            </FormControl>

            <Button variant="contained" type="submit">
              Crear Asignación
            </Button>
          </Box>
        </Box>
      </Modal>

      <Box mb="15px">
        <Button variant="contained" onClick={toggleAssignments}>
          Visualizar Asignaciones
        </Button>
      </Box>

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
                      {/* Add more role options */}
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

/*
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
} from "@mui/material";

function Asignaciones() {
  const [alumnos, setAlumnos] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [assignments, setAssignments] = useState({}); // { [alumnoId]: { profesorId, rol } }
  const [fetchedAssignments, setFetchedAssignments] = useState([]); // Array to store fetched assignments

  useEffect(() => {
    fetchAlumnos();
    fetchProfesores();
    fetchFetchedAssignments();
  }, []);
  const fetchAlumnos = async () => {
    const response = await axios.get("http://localhost:4000/api/alumnos");
    setAlumnos(response.data);
  };

  const fetchProfesores = async () => {
    const response = await axios.get("http://localhost:4000/api/profesores");
    setProfesores(response.data);
  };

  const fetchFetchedAssignments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/asignaciones"
      );
      setFetchedAssignments(response.data);
    } catch (error) {
      console.error("Error fetching fetched assignments:", error);
    }
  };

  const handleProfessorChange = (alumnoId, profesorId) => {
    setAssignments((prev) => ({
      ...prev,
      [alumnoId]: { ...prev[alumnoId], profesorId },
    }));
  };

  const handleRoleChange = (alumnoId, rol) => {
    setAssignments((prev) => ({
      ...prev,
      [alumnoId]: { ...prev[alumnoId], rol },
    }));
  };

  const handleAssign = async (alumnoId) => {
    const assignment = assignments[alumnoId];
    try {
      const response = await axios.post(
        "http://localhost:4000/api/asignaciones",
        {
          alumnoId,
          profesorId: assignment.profesorId,
          rol: assignment.rol,
        }
      );
      // Handle success
      console.log("Asignación creada:", response.data);
      // Aquí podrías actualizar el estado o la interfaz de usuario según la respuesta
    } catch (error) {
      // Handle error
      console.error("Error al crear asignación:", error.response.data);
      //Renderizar modal mwajaja
      alert("Alumno ya asignado a profesor: ");
      // Aquí podrías mostrar un mensaje de error en la interfaz de usuario
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Alumno</TableCell>
            <TableCell>Profesor</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Asignar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {alumnos.map((alumno) => (
            <TableRow key={alumno.RUT}>
              <TableCell>{alumno.nombre}</TableCell>
              <TableCell>
                
                <Select
                  value={assignments[alumno.RUT]?.profesorId || ""}
                  onChange={(e) =>
                    handleProfessorChange(alumno.RUT, e.target.value)
                  }
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
              </TableCell>
              <TableCell>
                <Select
                  value={assignments[alumno.RUT]?.rol || ""}
                  onChange={(e) => handleRoleChange(alumno.RUT, e.target.value)}
                >
                  <MenuItem value="guia">Guía</MenuItem>
                  <MenuItem value="informante">Informante</MenuItem>
                </Select>
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => handleAssign(alumno.RUT)}
                  variant="contained"
                >
                  Asignar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Asignaciones;

*/
/* 

TABLA DEPRECATED

 <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Alumno</TableCell>
                        <TableCell>Profesor</TableCell>
                        <TableCell>Rol</TableCell>
                        <TableCell>Asignar</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {alumnos.map(alumno => (
                        <TableRow key={alumno.RUT}>
                            <TableCell>{alumno.nombre}</TableCell>
                            <TableCell>
                                <Select
                                    value={assignments[alumno.RUT]?.profesorId || ''}
                                    onChange={(e) => handleProfessorChange(alumno.RUT, e.target.value)}
                                >
                                    {profesores.map(profesor => (
                                        <MenuItem key={profesor.profesor_id} value={profesor.profesor_id}>
                                            {profesor.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </TableCell>
                            <TableCell>
                                <Select
                                    value={assignments[alumno.RUT]?.rol || ''}
                                    onChange={(e) => handleRoleChange(alumno.RUT, e.target.value)}
                                >
                                    <MenuItem value="guia">Guía</MenuItem>
                                    <MenuItem value="informante">Informante</MenuItem>
                                    <MenuItem value="gyf">Guía y Informante</MenuItem>

                                </Select>
                            </TableCell>
                            <TableCell>
                                <Button
                                    onClick={() => handleAssign(alumno.RUT)}
                                    variant="contained"
                                >
                                    Asignar
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

*/
