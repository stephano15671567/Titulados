import React, { useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import DashBoard from '../Dashboard/DashBoard';
import Swal from 'sweetalert2';

function FileUpload({ buttonSx }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadStatus('');
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      Swal.fire({
        icon: 'warning',
        title: 'Por favor selecciona un archivo para subir',
        showConfirmButton: false,
        timer: 2000 // Muestra el mensaje durante 2 segundos
      });
      return;
    }
  
    const formData = new FormData();
    formData.append('archivo', selectedFile);
  
    try {
      await axios.post('http://localhost:4000/upload', formData, {
        
      });
      setUploadStatus('Archivo subido con éxito');
    } catch (error) {
      setUploadStatus('Error al subir el archivo');
      console.error('Error al subir el archivo:', error);
    }
  };

  // Añadimos un margen entre los botones
  const spacing = { mt: 1, mb: 1 };
   // Agregamos el componente DashBoard
  return (
    <Box sx={{ ...spacing, width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <DashBoard/>
      <input
        type="file"
        onChange={handleFileChange}
        accept=".xlsx, .xls, .csv"
        style={{ display: 'none' }}
        id="raised-button-file"
      />
      <label htmlFor="raised-button-file" style={{ width: '100%', marginBottom: '16px' }}>
        <Button variant="contained" component="span" fullWidth sx={{ bgcolor: '#0093ff', color: 'white', mb: 2 }}>
          Seleccionar archivo
        </Button>
      </label>
      <Button variant="contained" fullWidth sx={{ bgcolor: '#4CAF50', color: 'white', mb: 2 }} onClick={handleFileUpload}>
        Subir Archivo
      </Button>
      {uploadStatus && <Typography sx={{ mt: 2 }}>{uploadStatus}</Typography>}
    </Box>

  );
}

export default FileUpload;
