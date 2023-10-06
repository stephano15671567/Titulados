import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
} from "@mui/material";

function JefaturasView() {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Estudiante 1",
      carrera: "Carrera A",
      guia: "",
      informante: "",
      notas: { guia: "", informante: "" },
    },
    {
      id: 2,
      name: "Estudiante 2",
      carrera: "Carrera B",
      guia: "",
      informante: "",
      notas: { guia: "", informante: "" },
    },
    {
      id: 3,
      name: "Estudiante 3",
      carrera: "Carrera A",
      guia: "",
      informante: "",
      notas: { guia: "", informante: "" },
    },
    // Agrega más estudiantes con sus datos aquí
  ]);

  // Función para calcular el promedio de las notas
  const calculateAverage = (student) => {
    const guiaNote = parseFloat(student.notas.guia) || 0;
    const informanteNote = parseFloat(student.notas.informante) || 0;
    return ((guiaNote + informanteNote) / 2).toFixed(2);
  };

  const [selectedStudent, setSelectedStudent] = useState(null);

  // Función para ver la tesis del alumno
  const handleVerTesis = () => {
    if (selectedStudent) {
      // Implementa la lógica para ver la tesis del alumno
      console.log(`Ver tesis de ${selectedStudent.name}`);
    }
  };

  // Función para generar un reporte del alumno
  const handleGenerarReporte = () => {
    if (selectedStudent) {
      // Implementa la lógica para generar un reporte del alumno
      console.log(`Generar reporte de ${selectedStudent.name}`);
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        padding="20px"
      >
        <Typography variant="h4" align="center" gutterBottom>
          Panel de Jefaturas
        </Typography>

        <Paper elevation={3} style={{ padding: "20px", borderRadius: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Carrera</TableCell>
                <TableCell>Profesor Guía</TableCell>
                <TableCell>Profesor Informante</TableCell>
                <TableCell>Nota Guía</TableCell>
                <TableCell>Nota Informante</TableCell>
                <TableCell>Promedio</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      selectedStudent && selectedStudent.id === student.id
                        ? "#e0e0e0"
                        : "transparent",
                  }}
                >
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.carrera}</TableCell>
                  <TableCell>{student.guia}</TableCell>
                  <TableCell>{student.informante}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={student.notas.guia}
                      onChange={(e) =>
                        setStudents((prevStudents) =>
                          prevStudents.map((prevStudent) =>
                            prevStudent.id === student.id
                              ? {
                                  ...prevStudent,
                                  notas: {
                                    ...prevStudent.notas,
                                    guia: e.target.value,
                                  },
                                }
                              : prevStudent
                          )
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={student.notas.informante}
                      onChange={(e) =>
                        setStudents((prevStudents) =>
                          prevStudents.map((prevStudent) =>
                            prevStudent.id === student.id
                              ? {
                                  ...prevStudent,
                                  notas: {
                                    ...prevStudent.notas,
                                    informante: e.target.value,
                                  },
                                }
                              : prevStudent
                          )
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>{calculateAverage(student)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleVerTesis}
            disabled={!selectedStudent}
          >
            Ver Tesis
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleGenerarReporte}
            disabled={!selectedStudent}
          >
            Generar Reporte
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default JefaturasView;
