import React, { useState, useEffect } from "react";
import axios from "axios";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import Swal from "sweetalert2";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import MoreVertIcon from '@mui/icons-material/MoreVert'; // Importar icono para "más opciones"
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
  TextField,
  IconButton, // Importar IconButton
  Menu,       // Importar Menu
} from "@mui/material";
import DashBoard from "../Dashboard/DashBoard";

export default function Asignaciones() {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [open, setOpen] = useState(false);
  const [showAssignments, setShowAssignments] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // La función handleModifyClick original para abrir el modal de edición.
  // Ahora solo se usa directamente cuando se hace clic en un botón "Modificar" individual,
  // pero la lógica principal de establecer el estado se duplica en handleModifyFromMenu.
  // Podrías eliminarla si solo usas el menú, pero es un patrón común tenerla por separado.
  const handleModifyClick = (assignment) => {
    setCurrentAssignment(assignment);
    setFormDataEdit({
      profesor: assignment.profesor_id,
      rol: assignment.rol,
    });
    setEditModalOpen(true);
  };


  const handleCloseEdit = () => setEditModalOpen(false);

  const [error, setError] = useState("");
  const [alumnos, setAlumnos] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [processedAssignments, setProcessedAssignments] = useState([]);

  // Estados para el menú de acciones por rol
  const [anchorEl, setAnchorEl] = useState(null);
  const [assignmentForMenu, setAssignmentForMenu] = useState(null); // Almacena la asignación específica para el menú

  const handleMenuClick = (event, assignment) => {
    setAnchorEl(event.currentTarget);
    setAssignmentForMenu(assignment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setAssignmentForMenu(null);
  };

  // ***** CORRECCIÓN IMPORTANTE AQUÍ *****
  const handleModifyFromMenu = () => {
    if (assignmentForMenu) {
        // Esta es la lógica que antes estaba en handleModifyClick
        setCurrentAssignment(assignmentForMenu);
        setFormDataEdit({
          profesor: assignmentForMenu.profesor_id,
          rol: assignmentForMenu.rol,
        });
        setEditModalOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteFromMenu = () => {
    if (assignmentForMenu) {
        handleDelete(assignmentForMenu.asignacion_id);
    }
    handleMenuClose();
  };

  const handleNotifyFromMenu = () => {
    if (assignmentForMenu) {
        handleNotify(assignmentForMenu.asignacion_id);
    }
    handleMenuClose();
  };
  // ***** FIN CORRECCIONES *****


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
    console.log("Downloading assignment for student RUT:", assignment.alumno_RUT);
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
      setAssignments(response.data); // Store raw assignments
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  useEffect(() => {
    fetchAlumnos();
    fetchProfesores();
    fetchFetchedAssignments();
  }, []);

  useEffect(() => {
    if (assignments.length > 0) {
      const grouped = {};

      assignments.forEach((assignment) => {
        if (!assignment || !assignment.alumno_RUT) {
          console.warn("Skipping invalid assignment (missing alumno_RUT):", assignment);
          return;
        }

        if (!grouped[assignment.alumno_RUT]) {
          grouped[assignment.alumno_RUT] = {
            id: assignment.alumno_RUT,
            alumno_nombre: assignment.alumno_nombre,
            alumno_RUT: assignment.alumno_RUT,
            guia_profesor: "",
            guia_id: null,
            guia_fechaAsignacion: "",
            informante_profesor: "",
            informante_id: null,
            informante_fechaAsignacion: "",
            secretario_profesor: "",
            secretario_id: null,
            secretario_fechaAsignacion: "",
            presidente_profesor: "",
            presidente_id: null,
            presidente_fechaAsignacion: "",
            all_assignments: [],
          };
        }

        const role = assignment.rol.toLowerCase();
        switch (role) {
          case "guia":
            grouped[assignment.alumno_RUT].guia_profesor = assignment.nombre_profesor;
            grouped[assignment.alumno_RUT].guia_id = assignment.asignacion_id;
            grouped[assignment.alumno_RUT].guia_fechaAsignacion = assignment.fechaAsignacion;
            break;
          case "informante":
            grouped[assignment.alumno_RUT].informante_profesor = assignment.nombre_profesor;
            grouped[assignment.alumno_RUT].informante_id = assignment.asignacion_id;
            grouped[assignment.alumno_RUT].informante_fechaAsignacion = assignment.fechaAsignacion;
            break;
          case "secretario":
            grouped[assignment.alumno_RUT].secretario_profesor = assignment.nombre_profesor;
            grouped[assignment.alumno_RUT].secretario_id = assignment.asignacion_id;
            grouped[assignment.alumno_RUT].secretario_fechaAsignacion = assignment.fechaAsignacion;
            break;
          case "presidente":
            grouped[assignment.alumno_RUT].presidente_profesor = assignment.nombre_profesor;
            grouped[assignment.alumno_RUT].presidente_id = assignment.asignacion_id;
            grouped[assignment.alumno_RUT].presidente_fechaAsignacion = assignment.fechaAsignacion;
            break;
          default:
            console.warn("Unknown role encountered:", role, assignment);
        }
        grouped[assignment.alumno_RUT].all_assignments.push(assignment);
      });

      setProcessedAssignments(Object.values(grouped));
    } else {
      setProcessedAssignments([]);
    }
  }, [assignments]);

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
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Error al modificar la asignación. Intenta de nuevo.");
      }
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
        setFormData({
          alumno: "",
          profesor: "",
          rol: "",
        });
      }, 1500);
    } catch (error) {
      console.error("Error al crear asignación:", error.response.data);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Error al crear la asignación. Verifica los datos.");
      }
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

  const filteredAssignments = processedAssignments.filter((assignment) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      assignment.alumno_nombre.toLowerCase().includes(searchTermLower) ||
      assignment.guia_profesor.toLowerCase().includes(searchTermLower) ||
      assignment.informante_profesor.toLowerCase().includes(searchTermLower) ||
      assignment.secretario_profesor.toLowerCase().includes(searchTermLower) ||
      assignment.presidente_profesor.toLowerCase().includes(searchTermLower)
    );
  });

  // Helper para renderizar las celdas de profesor con acciones
  const renderProfessorCell = (profesorName, assignmentId, alumnoRUT, rol) => {
    // Si no hay ID de asignación (es decir, no hay profesor asignado a este rol), no renderizar el botón de acciones
    if (!assignmentId) {
        return (
            <Typography variant="body2" color="text.secondary">
                No Asignado
            </Typography>
        );
    }

    // Crear un objeto de asignación completo para pasarlo al menú de contexto
    // Incluye el nombre del alumno para mostrarlo en el modal de edición.
    const assignment = {
      asignacion_id: assignmentId,
      alumno_RUT: alumnoRUT,
      rol: rol,
      profesor_id: profesores.find(p => p.nombre === profesorName)?.profesor_id, // Busca el ID del profesor por nombre si es necesario para el formDataEdit
      nombre_profesor: profesorName,
      alumno_nombre: processedAssignments.find(a => a.alumno_RUT === alumnoRUT)?.alumno_nombre
    };

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 1 }}>
        <Typography variant="body2" sx={{ flexGrow: 1, minWidth: '80px', pr: 1 }}>
          {profesorName}
        </Typography>
        <IconButton
          aria-label="más opciones"
          aria-controls={`menu-${assignmentId}`}
          aria-haspopup="true"
          onClick={(event) => handleMenuClick(event, assignment)}
          size="small"
          sx={{ ml: 1 }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>
    );
  };


  const columns = [
    { field: "alumno_nombre", headerName: "Alumno", width: 200 },
    {
      field: "guia_profesor",
      headerName: "Guía",
      width: 220, // Ajustar ancho para acomodar nombre y botón
      renderCell: (params) =>
        renderProfessorCell(params.row.guia_profesor, params.row.guia_id, params.row.alumno_RUT, 'guia'),
    },
    {
      field: "informante_profesor",
      headerName: "Informante",
      width: 220, // Ajustar ancho
      renderCell: (params) =>
        renderProfessorCell(params.row.informante_profesor, params.row.informante_id, params.row.alumno_RUT, 'informante'),
    },
    {
      field: "secretario_profesor",
      headerName: "Secretario",
      width: 220, // Ajustar ancho
      renderCell: (params) =>
        renderProfessorCell(params.row.secretario_profesor, params.row.secretario_id, params.row.alumno_RUT, 'secretario'),
    },
    {
      field: "presidente_profesor",
      headerName: "Presidente",
      width: 220, // Ajustar ancho
      renderCell: (params) =>
        renderProfessorCell(params.row.presidente_profesor, params.row.presidente_id, params.row.alumno_RUT, 'presidente'),
    },
    {
      field: "ficha_alumno",
      headerName: "Ficha Alumno",
      width: 150,
      renderCell: (params) => (
        <Button
          onClick={() => handleDownload(params.row)}
          startIcon={<RemoveRedEyeIcon />}
          color="primary"
          size="small"
          variant="outlined"
          sx={{ fontSize: '0.75rem', minWidth: '100px' }}
        >
          Ver Ficha
        </Button>
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

        {/* Modal para Crear Asignación */}
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

        {/* Tabla de Asignaciones Visualizadas */}
        {showAssignments && processedAssignments.length > 0 && (
          <Box sx={{ height: 600, width: "100%", mt: 3 }}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <TextField
                label="Buscar por nombre (alumno/profesor)"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 2 }}
              />
              <DataGrid
                rows={filteredAssignments}
                columns={columns}
                pageSizeOptions={[5, 10, 20, 50, 100]}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 50 },
                  },
                }}
                getRowId={(row) => row.id}
                getRowHeight={() => 'auto'} // Altura automática para las filas
                getEstimatedRowHeight={() => 70} // Estimación para virtualización
                sx={{
                    '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '8px' },
                    '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '8px' },
                    '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '8px' },
                    '.MuiDataGrid-virtualScrollerContent': {
                        overflowX: 'hidden',
                    },
                }}
              />
            </Paper>
          </Box>
        )}
        {showAssignments && processedAssignments.length === 0 && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="h6">No hay asignaciones para mostrar.</Typography>
          </Box>
        )}

        {/* Modal para Modificar Asignación */}
        <Modal
          open={editModalOpen}
          onClose={handleCloseEdit}
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
                    onClick={handleCloseEdit}
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

        {/* Menú de Acciones (para el MoreVertIcon) */}
        <Menu
          id="role-actions-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={handleModifyFromMenu}>
            <Button startIcon={<HighlightOffIcon />} size="small">Modificar</Button>
          </MenuItem>
          <MenuItem onClick={handleDeleteFromMenu}>
            <Button startIcon={<DeleteIcon />} color="error" size="small">Eliminar</Button>
          </MenuItem>
          <MenuItem onClick={handleNotifyFromMenu}>
            <Button startIcon={<AttachEmailIcon />} color="success" size="small">Notificar</Button>
          </MenuItem>
        </Menu>

      </Box>
    </>
  );
}