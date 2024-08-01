import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import PropTypes from 'prop-types';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const options = { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString('es-ES', options);
};

const CustomTable = ({ rows }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: '15px' }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha y Hora</TableCell>
              <TableCell>Acción Realizada</TableCell>
              <TableCell>Persona afectada </TableCell>
              <TableCell>Revisado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{formatDate(row.timestamp)}</TableCell>
                <TableCell>{row.accion}</TableCell>
                <TableCell>{row.afectado}</TableCell>
                <TableCell>{row.revisado  === 1 ? <><CheckCircleIcon color="success" /> </>: <><CancelIcon color="error" /> </>}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

CustomTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      timestamp: PropTypes.instanceOf(Date).isRequired,
      accion: PropTypes.string.isRequired,
      afectado: PropTypes.string.isRequired,
      revisado: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default CustomTable;
