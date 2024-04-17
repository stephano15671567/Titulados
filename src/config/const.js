import 'dotenv/config.js';

/* These lines of code are assigning values to constants using the values of environment variables. The
`process.env` object in Node.js provides access to environment variables. */
const API = "https://apisst.administracionpublica-uv.cl/"; //process.env.REACT_APP_API_ENDPOIN

const object = {
    API
}

Object.freeze(object) //The Object.freeze() static method freezes an object

export default object;