import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Encabezado
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/titulados">Titulados</Button>
        <Button color="inherit" component={Link} to="/secretaria">Secretaria</Button>
        <Button color="inherit" component={Link} to="/academicos">Académicos</Button>
        <Button color="inherit" component={Link} to="/jefatura">Jefatura</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
