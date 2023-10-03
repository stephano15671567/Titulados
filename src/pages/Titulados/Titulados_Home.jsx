import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";



function TituladosHome() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Typography variant="h4" align="center" gutterBottom>
        Bienvenido a TituladosHome
      </Typography>

      <Box m={2}>
        <Link to="/subir-tesis">
          <Button variant="contained" color="primary">
            Subir Tesis
          </Button>
        </Link>
      </Box>

      <Typography variant="body1" align="center">
        En TituladosHome, puedes subir tu tesis de forma sencilla.
      </Typography>
    </Box>
  );
}

export default TituladosHome;
