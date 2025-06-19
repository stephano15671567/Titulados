import React from "react";
import CustomTable from "../components/CustomTable"; // Corrected import path
import DashBoard from "../Dashboard/DashBoard";
import { Button, Paper, Typography, Box } from "@mui/material";

function NotificacionesTable() {
  const rows = [
    {
      timestamp: new Date("2024-07-31T10:00:00"),
      accion: "Súbida rúbrica de profesor guía",
      afectado: "Alumno: Martin Scorsece",
      revisado: 0,
    },
    {
      timestamp: new Date("2024-07-31T11:00:00"),
      accion: "Súbida rúbrica de profesor guía",
      afectado: "Alumno: Yoel Alumno",
      revisado: 1,
    },
    {
      timestamp: new Date("2024-07-31T11:00:00"),
      accion: "Súbida tesis",
      afectado: "Alumno: Yoel2 Alumno",
      revisado: 1,
    },
    {
      timestamp: new Date("2024-07-31T11:00:00"),
      accion: "Súbida de ficha de alumno",
      afectado: "Secretaria",
      revisado: 1,
    },
  ];
  console.log(rows);

  const drawerWidth = 240; // Definir aquí
  const appBarHeight = 64; // Altura típica

  return (
    <>
      <DashBoard /> {/* Se mantiene aquí */}
      <Box
        component="main"
        sx={{
          ml: { sm: `${drawerWidth}px` },
          mt: `${appBarHeight}px`,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          boxSizing: "border-box",
        }}
      >
        <Paper sx={{ mb: 2, p: 2 }}>
          <Typography variant="h4" gutterBottom>
            {" "}
            Notificaciones{" "}
          </Typography>
          <Typography variant="h5" gutterBottom>
            {" "}
            Filtrar por{" "}
          </Typography>
          <Button color="success" sx={{ mr: 1 }}>
            Revisados
          </Button>
          <Button color="warning" sx={{ mr: 1 }}>
            No Revisados
          </Button>
          <Button color="info">Por fecha</Button>
        </Paper>

        <CustomTable rows={rows} />
      </Box>
    </>
  );
}

export default NotificacionesTable;