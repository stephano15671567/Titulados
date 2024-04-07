import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Outlet } from "react-router";
import axios from "axios";
import background1 from "../Home/components/images/imag_valparaiso.jpg";
import background2 from "../Home/components/images/imagen_2.jpg";
import background3 from "../Home/components/images/imagen_3.jpg";
import background4 from "../Home/components/images/imagen_4.jpg";
import background5 from "../Home/components/images/imagen_5.jpg";
import BackgroundTransition from "../../BackgroundTransition/BackgroundTransition";
import { jwtDecode } from "jwt-decode";
import Button from '@mui/material/Button'; // Importar Button de MUI
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Titulados() {
  const navigate = useNavigate();
  const win = window.sessionStorage; //Variable de sesión
  const [user, setUser] = useState({});
  const [showSignIn, setShowSignIn] = useState(!win.getItem("status")); // Show if no token
  
  const verifyToken = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/profesores/ver/",
        {},
        {
          headers: {
            authorization: "Bearer " + win.getItem("token"),
          },
        }
      );
      if (res.data.status === true) {
        win.setItem("status", res.data.status);
        win.setItem("rol", res.data.rol);
        win.setItem("token", res.data.token);
        win.setItem("id", res.data.id);

        setUser({ rol: win.getItem("rol") });
        console.log(user)
        setShowSignIn(false);
        return true;
      }
    } catch (err) {
      win.clear();
      setShowSignIn(true);
      return false
    }
  }

  useEffect(() => {
    if (win.getItem("status") === "true" && win.getItem("rol") === "profesor") {
      if (win.getItem("token") !== null) {
        verifyToken();
      }
    } else {
      win.clear();
      setShowSignIn(true);
    }
  }, []);

  //Global de google
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        "417041141509-495v48nc29snmejlojgaj49pq8ck3ukn.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    if (showSignIn) {
      google.accounts.id.renderButton(document.getElementById("signIn"), {
        theme: "filled_blue",
        size: "large",
        text: "continue_with",
      });

      google.accounts.id.prompt();
    }
  }, [showSignIn]);
 
  const handleToken = async (response) => {
    try {
      const res = await axios.post("http://localhost:4000/api/profesores/auth/", {
        token: response.credential,
      });
      const usuario = jwtDecode(res.data);
      console.log(usuario)
      /*SETEO DE CREDENCIALES*/
      win.setItem("status", usuario.status);
      win.setItem("rol", usuario.rol);
      win.setItem("token", res.data);
      win.setItem("id", usuario.id);

      setUser({ rol: usuario.rol });
      setShowSignIn(false); // Hide signIn button
      return true;
    } catch (err) {
      console.error("Error during token verification: ", err);
      return false;
    }
  };
  //GUARDAR TOKEN ENCRIPTADO EN VARIABLE DE CONTEXTO

  function handleCallbackResponse(response) {
    handleToken(response);
  }

  function handleSignOut() {
    setUser({});
    win.clear();
    setShowSignIn(true); // Show signIn button
  }

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "20px",  
  };

  const formContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "20px",
    background: "lightgray",
    padding: "20px",
    width: "100%",
    maxWidth: "600px",   
  };

  const leftTextStyle = {
    fontSize: "15px",  
  };

  return (
    <BackgroundTransition
      images={[background1, background2, background3, background4, background5]}
      duration={5000}
    >
      {showSignIn && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
        <Button variant="contained" 
          onClick={() => navigate('/')} // Replace '/' with your home route
          sx={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 1000,
          }}
        startIcon={<ArrowBackIcon />}>
        Atras
        </Button>
          <Paper elevation={10} sx={{ padding: 3, width: 400 }}>
            <Typography variant="h5" gutterBottom textAlign="center">
              Inicie sesión con su correo institucional
            </Typography>
            <Box
              fullWidth
              sx={{
                marginTop: 2,
                backgroundColor: "#4285F4",
                "&:hover": {
                  backgroundColor: "#357ae8",
                },
              }}
              id="signIn"
            >
              Iniciar Sesión con Google
            </Box>
          </Paper>
        </Box>
      )}

      {user.rol && (
        <>
          <div>
            <Outlet />
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        </>
      )}
    </BackgroundTransition>
  );
}

export default Titulados;


