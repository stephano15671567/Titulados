import React, { useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import axios from 'axios';
const api = "https://10.100.32.192:4001/";

function FileUpload({ buttonSx }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadStatus('');
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Por favor selecciona un archivo para subir');
      return;
    }
  
    const formData = new FormData();
    formData.append('archivo', selectedFile);
  
    try {
      await axios.post(api+'upload', formData, {
        
      });
      setUploadStatus('Archivo subido con éxito');
    } catch (error) {
      setUploadStatus('Error al subir el archivo');
      console.error('Error al subir el archivo:', error);
    }
  };

  // Añadimos un margen entre los botones
  const spacing = { mt: 1, mb: 1 };

  return (
    <Box sx={{ ...spacing, width: '100%', '& > *': { mb: 2 } }}> {/* Agregamos espaciado entre los elementos */}
      <input
        type="file"
        onChange={handleFileChange}
        accept=".xlsx, .xls, .csv"
        style={{ display: 'none' }}
        id="raised-button-file"
      />
      <label htmlFor="raised-button-file" style={{ width: '100%' }}>
        <Button variant="contained" component="span" fullWidth sx={buttonSx}>
          Seleccionar archivo
        </Button>
      </label>
      <Button variant="contained" fullWidth sx={buttonSx} onClick={handleFileUpload}>
        Subir Archivo
      </Button>
      {uploadStatus && <Typography sx={{ mt: 2 }}>{uploadStatus}</Typography>}
    </Box>
  );
}

export default FileUpload;
