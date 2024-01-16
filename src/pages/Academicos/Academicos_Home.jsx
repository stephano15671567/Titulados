// ProfessorAssignmentsView.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Box } from '@mui/material';
import GuiaTable from './GuiaTable';
import InformanteTable from './InformanteTable';

const ProfessorAssignmentsView = ({ professorId }) => {
  const [guiaAssignments, setGuiaAssignments] = useState([]);
  const [informanteAssignments, setInformanteAssignments] = useState([]);

  useEffect(() => {
    
    axios.get(`http://localhost:4000/api/asignaciones/guia/${professorId}`)
      .then(response => setGuiaAssignments(response.data))
      .catch(error => console.error('Error fetching guia assignments:', error));

    axios.get(`http://localhost:4000/api/asignaciones/informante/${professorId}`)
      .then(response => setInformanteAssignments(response.data))
      .catch(error => console.error('Error fetching informante assignments:', error));
  }, [professorId]);
  
const win = window.sessionStorage; //Variable de sesión

const alo = win.getItem("id");
console.log(alo)


  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
        }}
      >
        <GuiaTable rows={guiaAssignments} />
        <InformanteTable rows={informanteAssignments} />
      </Box>
    </Container>
  );
};

export default ProfessorAssignmentsView;

