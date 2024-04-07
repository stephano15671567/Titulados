import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Box } from '@mui/material';
import GuiaTable from './GuiaTable';
import InformanteTable from './InformanteTable';

const ProfessorAssignmentsView = () => {
  const [guiaAssignments, setGuiaAssignments] = useState([]);
  const [informanteAssignments, setInformanteAssignments] = useState([]);

  const win = window.sessionStorage; 
  const professorId = win.getItem("id"); 

  useEffect(() => {
    if (professorId) {
      axios.get(`http://localhost:4000/api/asignaciones/guia/${professorId}`)
        .then(response => setGuiaAssignments(response.data))
        .catch(error => console.error('Error fetching guia assignments:', error));

      axios.get(`http://localhost:4000/api/asignaciones/informante/${professorId}`)
        .then(response => setInformanteAssignments(response.data))
        .catch(error => console.error('Error fetching informante assignments:', error));
    }
  }, [professorId]);

  const [alumnos, setAlumnos] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [assignments, setAssignments] = useState({}); // { [alumnoId]: { profesorId, rol } }

    useEffect(() => {
        fetchAlumnos();
        fetchProfesores();
        fetchAsignaciones(); 
    }, []);

    
    useEffect(() => {
        // Ensure that both alumnos and profesores are fetched before fetching asignaciones
        if (alumnos.length > 0 && profesores.length > 0) {
            fetchAsignaciones();
        }
    }, [alumnos, profesores]); 
    
    //CHANGE TO FULL CRUD TABLEEEEEEEE

    //RUTEAR A ENDPOINT EL QUE TRAIGA TODOS LOS GUÍAS INFORMÁNTE Y AMBOS 
    const fetchAsignaciones = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/asignaciones');
            const enrichedAsignaciones = response.data.map(asignacion => {
                const alumno = alumnos.find(al => al.RUT === asignacion.alumno_RUT) || {};
                const profesor = profesores.find(pr => pr.profesor_id === asignacion.profesor_id) || {};
                return { ...asignacion, alumnoNombre: alumno.nombre, profesorNombre: profesor.nombre };
            });
            setAssignments(enrichedAsignaciones);
            console.log(enrichedAsignaciones)
        } catch (error) {
            console.error('Error fetching asignaciones:', error);
            // Handle error appropriately
        }
    };
         //SE QUEDA
    const fetchAlumnos = async () => {
        const response = await axios.get('http://localhost:4000/api/alumnos');
        setAlumnos(response.data);
    };
             //SE QUEDA
    const fetchProfesores = async () => {
        const response = await axios.get('http://localhost:4000/api/profesores');
        setProfesores(response.data);
    };




  

  console.log(assignments)
  console.log(informanteAssignments)

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
        <GuiaTable rows={assignments} />
        <InformanteTable rows={informanteAssignments} />
      </Box>
    </Container>
  );
};

export default ProfessorAssignmentsView;