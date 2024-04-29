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
  Checkbox
} from '@mui/material';

// Crear un contexto para el estado global
const RowsContext = createContext();

// Proveedor de contexto para envolver toda la aplicación
const RowsProvider = ({ children }) => {
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);

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

  return (
    <RowsContext.Provider value={{ rows: rows.slice(page * rowsPerPage, (page + 1) * rowsPerPage), rowsPerPage, handleChangeRowsPerPage, page, handleChangePage, handleSelectRow, isSelected, selectedRows }}>
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
  const { rows, rowsPerPage, handleChangeRowsPerPage, page, handleChangePage, handleSelectRow, isSelected } = useContext(RowsContext);

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
