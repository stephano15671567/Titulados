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

/* ***Layouts**** */
/*const FullLayout = Loadable(
  lazy(() => import("../layouts/full-layout/MainLayout"))
);*/

/* ***End Layouts**** */

const Error = Loadable(lazy(() => import("../pages/Error/404")));

/* ****Pages***** */
const HomePage = Loadable(lazy(() => import("../pages/Home/Home")));

/* ****Routes***** */

const Router = [
  {
    /*path: "/",
    element: <FullLayout />,*/
    children: [
      { path: "", exact: true, element: <HomePage /> },
      { path: "*", element: <Navigate to="/404" /> },
      { path: "404", element: <Error /> },
      {
        path: "/Titulados",
        element: <Titulados />,
        children: [
          {
            path: "",
            element: <TituladosHome />,
          },
        ],
      }, //Login de titulados
      { path: "/Secretarias",
        element: <HomeS />,
        children: [
          {
            path: "",
            element: <Secretarias />,
          },
        ],
      },
      { path: "/Academicos",
        element: <Academicos />,
        children: [
          {
            path: "",
            element: <AcademicosH />,
          },
        ],
      },
      { path: "/Jefaturas", element: <Jefaturas /> },
      //Plataforma para titulados
      { path: "/JefaturasHome", element: <JefaturasH /> },
      { path: "/AcademicosHome", element: <AcademicosH /> },
    ],
  },
];

export default Router;