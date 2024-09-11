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
      await axios.post('https://apisst.administracionpublica-uv.cl/upload/', formData); // Reemplaza con la URL adecuada
      setUploadStatus('Archivo subido con éxito');
    } catch (error) {
      setUploadStatus('Error al subir el archivo');
      console.error('Error al subir el archivo:', error);
    }
  };

  const handleDownloadReport = () => {
    const reportUrl = 'https://apisst.administracionpublica-uv.cl/api/report/download-report'; // Reemplaza con la URL correcta del reporte
    window.open(reportUrl, '_blank');
  };

  return (
    <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <DashBoard/>
      <Box sx={{ bgcolor: '#f0f0f0', p: 2, mb: 2, width: '100%' }}>
        <Typography variant="h6" mb={1}>Subir Archivo</Typography>
        <Typography variant="body1" mb={2}>Por favor selecciona un archivo y haz clic en "Subir Archivo".</Typography>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".xlsx, .xls, .csv"
          style={{ display: 'none' }}
          id="raised-button-file"
        />
        <label htmlFor="raised-button-file" style={{ width: '100%', marginBottom: '16px' }}>
          <Button variant="contained" fullWidth startIcon={<selectFileIcon />} sx={{ bgcolor: '#0093ff', color: 'white' }} component="span">
            Seleccionar archivo
          </Button>
        </label>
        <Button variant="contained" fullWidth startIcon={<uploadFileIcon />} sx={{ bgcolor: '#4CAF50', color: 'white' }} onClick={handleFileUpload}>
          Subir Archivo
        </Button>

        {/* Botón para generar reporte */}
        <Button variant="contained" fullWidth startIcon={<reportIcon />} sx={{ bgcolor: '#FFA726', color: 'white', mt: 2 }} onClick={handleDownloadReport}>
          Reporte
        </Button>
      </Box>
      {uploadStatus && <Typography sx={{ mt: 2 }}>{uploadStatus}</Typography>}
    </Box>
  );
}

export default FileUpload;
