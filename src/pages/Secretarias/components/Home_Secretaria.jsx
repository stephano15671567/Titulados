// src/pages/Secretarias/components/Home_Secretaria.jsx

import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import { jwtDecode } from 'jwt-decode';
import axios from "axios";
import BackgroundTransition from "../../../BackgroundTransition/BackgroundTransition";
import background1 from "../../Home/components/images/imag_valparaiso.jpg";
import background2 from "../../Home/components/images/imagen_2.jpg";
import background3 from "../../Home/components/images/imagen_3.jpg";
import background4 from "../../Home/components/images/imagen_4.jpg";
import background5 from "../../Home/components/images/imagen_5.jpg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Outlet, useNavigate } from "react-router-dom";

function HomeSecretaria() {
  const navigate = useNavigate();
  const win = window.sessionStorage;
  const [showSignIn, setShowSignIn] = useState(!win.getItem("status"));
  const [user, setUser] = useState({ rol: "", status: false });

  const verifyToken = async () => {
    try {
      const token = win.getItem("token");
      if (!token) return;

      const res = await axios.post(
        "http://localhost:4000/api/secretarias/ver",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.status && res.data.rol === "secretaria") {
        win.setItem("status", res.data.status);
        win.setItem("rol", res.data.rol);
        win.setItem("token", res.data.token);
        // campus
        win.setItem("campus", res.data.campus);

        setUser({ rol: "secretaria", status: true });
        setShowSignIn(false);
      } else {
        win.clear();
        setShowSignIn(true);
      }
    } catch (error) {
      console.error("Error verifying token Secretaria:", error);
      win.clear();
      setShowSignIn(true);
    }
  };

  useEffect(() => {
    if (win.getItem("status") === "true" && win.getItem("rol") === "secretaria") {
      verifyToken();
    } else {
      win.clear();
      setShowSignIn(true);
    }
    // eslint-disable-next-line
  }, []);

  // Google
  useEffect(() => {
    /* global google */
    if (showSignIn && window.google) {
      google.accounts.id.initialize({
        client_id: "376536263555-11knv0d7p87f1o5aa97mjnm2m2b297ir.apps.googleusercontent.com",
        callback: handleCallbackResponse,
      });
      google.accounts.id.renderButton(document.getElementById("signIn"), {
        theme: "filled_blue",
        size: "large",
        text: "continue_with",
      });
      google.accounts.id.prompt();
    }
  }, [showSignIn]);

  const handleCallbackResponse = async (response) => {
    try {
      const backendResp = await axios.post(
        "http://localhost:4000/api/secretarias/auth",
        { token: response.credential }
      );
      const decoded = jwtDecode(backendResp.data); 

      win.setItem("status", decoded.status);
      win.setItem("rol", decoded.rol);
      win.setItem("token", backendResp.data);
      // campus
      win.setItem("campus", decoded.campus);

      setUser({ rol: decoded.rol, status: decoded.status });
      setShowSignIn(false);
    } catch (err) {
      console.error("Error login Secretaria:", err);
    }
  };

  const handleSignOut = () => {
    win.clear();
    setUser({ rol: "", status: false });
    setShowSignIn(true);
  };

  return (
    <BackgroundTransition
      images={[background1, background2, background3, background4, background5]}
      duration={5000}
    >
      {showSignIn && (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{
              position: "absolute",
              top: 20,
              left: 20,
              zIndex: 1000,
            }}
            startIcon={<ArrowBackIcon />}
          >
            Atrás
          </Button>
          <Paper elevation={10} sx={{ p: 3, width: 400 }}>
            <Typography variant="h5" textAlign="center" gutterBottom>
              Inicia sesión con tu correo institucional
            </Typography>
            <Box
              id="signIn"
              sx={{
                mt: 2,
                backgroundColor: "#4285F4",
                "&:hover": { backgroundColor: "#357ae8" },
              }}
            >
              Iniciar Sesión con Google
            </Box>
          </Paper>
        </Box>
      )}

      {!showSignIn && user.rol === "secretaria" && (
        <Box sx={{ position: "relative", minHeight: "100vh" }}>
          <Button
            onClick={handleSignOut}
            variant="contained"
            color="secondary"
            sx={{ position: "absolute", top: 20, right: 20 }}
          >
            Cerrar Sesión
          </Button>
          <Outlet />
        </Box>
      )}
    </BackgroundTransition>
  );
}

export default HomeSecretaria;


