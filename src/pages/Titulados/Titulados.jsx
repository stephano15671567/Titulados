import React, { useState, useEffect } from "react";
import { Button, Paper, Typography, TextField, Box } from "@mui/material";
import { jwtDecode } from "jwt-decode"; // Corrected import
import { Outlet } from "react-router";
import axios from "axios";
import BackgroundTransition from "../../BackgroundTransition/BackgroundTransition";
import background1 from "../Home/components/images/imag_valparaiso.jpg";
import background2 from "../Home/components/images/imagen_2.jpg";
import background3 from "../Home/components/images/imagen_3.jpg";
import background4 from "../Home/components/images/imagen_4.jpg";
import background5 from "../Home/components/images/imagen_5.jpg";

function Titulados() {
  const win = window.sessionStorage; //Variable de sesión
  const [user, setUser] = useState({});
  const [showSignIn, setShowSignIn] = useState(!win.getItem("token")); // Show if no token

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar el inicio de sesión con nombre de usuario y contraseña si lo necesitas
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:4000/auth/google";
  };

  useEffect(() => {
    if (win.getItem("token")) {
      console.log("Token exists: ", win.getItem("token"));
      const userObject = jwtDecode(win.getItem("token"));
      setUser(userObject);
      setShowSignIn(false); // Hide signIn button
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
    console.log("token: ", response.credential);
    try {
      const res = await axios.post('localhost:4000/api/alumnos/auth/', {
        token: response.credential,
      });
      console.log(res.data);
      win.setItem("token", response.credential);
      setShowSignIn(false); // Hide signIn button
      return true;
    } catch (err) {
      console.error("Error during token verification: ", err);
      return false;
      // Handle the error
    }
  };
  //GUARDAR TOKEN ENCRIPTADO EN VARIABLE DE CONTEXTO 

  function handleCallbackResponse(response) {
    console.log("token: ", response.credential); //Este token va al backend para verificar la autenticidad del usuario pero antes tiene que ir encriptado
    const UserObject = jwtDecode(response.credential);
    console.log(UserObject);
    setUser(UserObject);
    win.setItem("token", response.credential);
    handleToken(response);
    
    setShowSignIn(false); // Hide signIn button
  }

  function handleSignOut() {
    setUser({});
    win.clear();
    setShowSignIn(true); // Show signIn button
  }

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
          <Paper elevation={10} sx={{ padding: 3, width: 400 }}>
            <Typography variant="h5" gutterBottom textAlign="center">
              Inicia sesión con tu correo institucional
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

      {Object.keys(user).length !== 0 && (
        <>
          <div>
            <Outlet />
            <img src={user.picture} alt="User" />
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        </>
      )}
    </BackgroundTransition>
  );
}

export default Titulados;
