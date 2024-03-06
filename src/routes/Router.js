import React, { lazy } from "react";
import Loadable from "../layouts/Loadable";
import { Navigate } from "react-router-dom";
import Titulados from "../pages/Titulados/Titulados";
import Secretarias from "../pages/Secretarias/Secretarias";
import Academicos from "../pages/Academicos/Academicos";
import Jefaturas from "../pages/Jefaturas/Jefaturas";
import HomeS from "../pages/Secretarias/Home_Secretaria";
import Alumnos from "../pages/Titulados/Titulados_Home";
import JefaturasH from "../pages/Jefaturas/Jefaturas_Home";
import AcademicosH from "../pages/Academicos/Academicos_Home";
import TituladosHome from "../pages/Titulados/Titulados_Home";
import Reporte from "../pages/Secretarias/Reporte"; 

const Error = Loadable(lazy(() => import("../pages/Error/404")));
const HomePage = Loadable(lazy(() => import("../pages/Home/Home")));

const Router = [
  {
    children: [
      { path: "", exact: true, element: <HomePage /> },
      { path: "*", element: <Navigate to="/404" /> },
      { path: "404", element: <Error /> },
      {
        path: "Titulados",
        element: <Titulados />,
        children: [
          {
            path: "",
            element: <TituladosHome />,
          },
        ],
      },
      { 
        path: "Secretarias",
        element: <Secretarias />,
        children: [
          {
            path: "",
            element: <HomeS />,
            children: [
              { path: "reporte", element: <Reporte /> }, // Ajuste aquí
            ],
          },
        ],
      },
      { 
        path: "Academicos",
        element: <Academicos />,
        children: [
          {
            path: "",
            element: <AcademicosH />,
          },
        ],
      },
      { 
        path: "Jefaturas",
        element: <Jefaturas />,
        children: [
          {
            path: "",
            element: <JefaturasH />,
          },
        ],
      },
    ],
  },
];

export default Router;
