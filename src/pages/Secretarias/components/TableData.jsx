import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Checkbox,
  Menu,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GetAppIcon from '@mui/icons-material/GetApp';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DescriptionIcon from '@mui/icons-material/Description';
import MenuIcon from '@mui/icons-material/Menu';

// Crear un contexto para el estado global
const RowsContext = createContext();

// Proveedor de contexto para envolver toda la aplicación
const RowsProvider = ({ children }) => {
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editMenuOpen, setEditMenuOpen] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null); // Nuevo estado para el elemento ancla del menú

  // Función para realizar la solicitud HTTP a la API y obtener los datos
  async function fetchDataFromApi() {
    try {
      const response = await axios.get('https://localhost:4000/api/alumnos/');
      const data = response.data; // Los datos obtenidos de la API
      // Transforma los datos en el formato necesario para las filas de la tabla
      const formattedRows = data.map(item => createData(item.RUT, item.nombre, item.CODIGO, item.ANO_INGRESO, item.ANO_EGRESO, item.n_resolucion, item.fecha_examen, item.mail));
      setRows(formattedRows); // Actualiza el estado 'rows' con los datos obtenidos
    } catch (error) {
      console.error('Error fetching data from API:', error);
    }
  }

  useEffect(() => {
    fetchDataFromApi();
  }, []);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0); // Resetear la página cuando se cambia el número de filas por página
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleSelectRow = (row) => {
    if (selectedRows.includes(row)) {
      setSelectedRows(selectedRows.filter(selectedRow => selectedRow !== row));
    } else {
      setSelectedRows([...selectedRows, row]);
    }
  };

  const isSelected = (row) => selectedRows.includes(row);

  const handleEditButtonClick = (event, row) => {
    setEditedData(row);
    setAnchorEl(event.currentTarget);
    setEditMenuOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`https://localhost:4000/api/alumnos/${editedData.RUT}`, editedData);
      console.log('Alumno actualizado correctamente');
      setEditMenuOpen(false);
    } catch (error) {
      console.error('Error al actualizar alumno:', error);
    }
  };

  const handleEditCancel = () => {
    setEditMenuOpen(false);
  };

  return (
    <RowsContext.Provider value={{ rows: rows.slice(page * rowsPerPage, (page + 1) * rowsPerPage), rowsPerPage, handleChangeRowsPerPage, page, handleChangePage, handleSelectRow, isSelected, selectedRows, handleEditButtonClick, editMenuOpen, editedData, handleInputChange, handleEditSubmit, handleEditCancel }}>
      {children}
    </RowsContext.Provider>
  );
};

// Función para crear datos de fila
function createData(RUT, nombre, CODIGO, ANO_INGRESO, ANO_EGRESO, n_resolucion, fecha_examen, mail) {
  return { RUT, nombre, CODIGO, ANO_INGRESO, ANO_EGRESO, n_resolucion, fecha_examen, mail };
}

// Función MyComponent que consume el contexto
function MyComponent() {
  const { rows, rowsPerPage, handleChangeRowsPerPage, page, handleChangePage, handleSelectRow, isSelected, handleEditButtonClick, editMenuOpen, editedData, handleInputChange, handleEditSubmit, handleEditCancel } = useContext(RowsContext);
  const [anchorEl, setAnchorEl] = useState(null); // Se agrega esta línea

  const handleDeleteClick = (event, row) => {
    // Aquí puedes implementar la lógica para eliminar al alumno
    console.log('Eliminar alumno:', row);
  };

  const handleDownloadClick = (event, row) => {
    // Aquí puedes implementar la lógica para descargar el acta
    console.log('Descargar acta:', row);
  };

  const handleAddNoteClick = (event, row) => {
    // Aquí puedes implementar la lógica para añadir una nota de defensa
    console.log('Añadir nota de defensa:', row);
  };

  const handleDownloadRubricGuideClick = (event, row) => {
    // Aquí puedes implementar la lógica para descargar la rúbrica de guía
    console.log('Descargar rúbrica de guía:', row);
  };

  const handleDownloadRubricInformantClick = (event, row) => {
    // Aquí puedes implementar la lógica para descargar la rúbrica de informante
    console.log('Descargar rúbrica de informante:', row);
  };

  const handleThesisClick = (event, row) => {
    // Aquí puedes implementar la lógica para abrir la tesis
    console.log('Abrir tesis:', row);
  };

  return (
    <div style={{ position: 'relative' }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>RUT</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Código</TableCell>
              <TableCell>Año Ingreso</TableCell>
              <TableCell>Año Egreso</TableCell>
              <TableCell>Número Resolución</TableCell>
              <TableCell>Fecha Examen</TableCell>
              <TableCell>Mail</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.RUT}>
                <TableCell>
                  <Checkbox
                    checked={isSelected(row)}
                    onChange={() => handleSelectRow(row)}
                  />
                </TableCell>
                <TableCell>{row.RUT}</TableCell>
                <TableCell>{row.nombre}</TableCell>
                <TableCell>{row.CODIGO}</TableCell>
                <TableCell>{row.ANO_INGRESO}</TableCell>
                <TableCell>{row.ANO_EGRESO}</TableCell>
                <TableCell>{row.n_resolucion}</TableCell>
                <TableCell>{new Date(row.fecha_examen).toLocaleDateString()}</TableCell>
                <TableCell>{row.mail}</TableCell>
                <TableCell>
                  <Button
                    aria-controls={`actions-menu-${row.RUT}`}
                    aria-haspopup="true"
                    onClick={(event) => handleEditButtonClick(event, row)}
                    startIcon={<MenuIcon />}
                  >
                    Acciones
                  </Button>
                  <Menu
                    id={`actions-menu-${row.RUT}`}
                    anchorEl={anchorEl}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    anchorPosition={{ top: 550, left: 430 }}
                    anchorReference='anchorPosition'
                    open={editMenuOpen && editedData.RUT === row.RUT}
                    onClose={handleEditCancel}
                  >
                    <MenuItem onClick={(event) => handleEditButtonClick(event, row)}>
                      <ListItemIcon>
                        <EditIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Editar" />
                    </MenuItem>
                    <MenuItem onClick={(event) => handleDeleteClick(event, row)}>
                      <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Eliminar" />
                    </MenuItem>
                    <MenuItem onClick={(event) => handleDownloadClick(event, row)}>
                      <ListItemIcon>
                        <GetAppIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Descargar Acta" />
                    </MenuItem>
                    <MenuItem onClick={(event) => handleAddNoteClick(event, row)}>
                      <ListItemIcon>
                        <NoteAddIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Añadir Nota Defensa" />
                    </MenuItem>
                    <MenuItem>
                      <ListItemIcon>
                        <DescriptionIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Descargar Rúbrica">
                        <Menu>
                          <MenuItem onClick={(event) => handleDownloadRubricGuideClick(event, row)}>Guía</MenuItem>
                          <MenuItem onClick={(event) => handleDownloadRubricInformantClick(event, row)}>Informante</MenuItem>
                        </Menu>
                      </ListItemText>
                    </MenuItem>
                    <MenuItem onClick={(event) => handleThesisClick(event, row)}>
                      <ListItemIcon>
                        <DescriptionIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Tesis" />
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ position: 'absolute', bottom: '-80px', right: '10px', backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '5px', borderRadius: '5px' }}>
        <FormControl>
          <InputLabel>Tablas por Página</InputLabel>
          <Select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
          >
            {[5, 10, 25].map((perPage) => (
              <MenuItem key={perPage} value={perPage}>
                {perPage}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button disabled={page === 0} onClick={() => handleChangePage(page - 1)} style={{ marginTop: '10px' }}>
          Previo 
        </Button>
        <Button disabled={rows.length < rowsPerPage || rows.length === 0} onClick={() => handleChangePage(page + 1)} style={{ marginTop: '10px' }}>
          Siguiente
        </Button>
      </div>
    </div>
  );
}

// Ejemplo de uso
function App() {
  return (
    <RowsProvider>
      <MyComponent />
    </RowsProvider>
  );
}

export default App;
