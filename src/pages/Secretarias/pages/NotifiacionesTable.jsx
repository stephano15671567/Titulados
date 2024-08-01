import React from "react";
import CustomTable from "./Notificaciones";
import DashBoard from "../Dashboard/DashBoard";
import { Button, Paper, Typography } from "@mui/material";

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
  console.log(rows)

  return (
    <div>
      <DashBoard />
      <Paper>
        <Typography typography="h4"> Notificaciones </Typography>
        <Typography typography="h5"> Filtrar por </Typography>
        <Button color="success">Revisados</Button>
        <Button color="warning">No Revisados</Button>
        <Button color="info">Por fecha</Button>
      </Paper>

      <CustomTable rows={rows} />
    </div>
  );
}

export default NotificacionesTable;
