import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import PageContainer from "../../components/container/PageContainer";

const Error = () => (
  <PageContainer title="Error" description="Página de error">
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      textAlign="center"
      justifyContent="center"
      sx={{ backgroundColor: "#e4f5ff" }}
    >
      <Container maxWidth="md">
        <Typography align="center" variant="h1">
          404
        </Typography>
        <Typography align="center" variant="h4">
          This page could not be found.
        </Typography>
        <Button
          color="primary"
          variant="contained"
          component={Link}
          to="/"
          disableElevation
        >
          Back to Home
        </Button>
      </Container>
    </Box>
  </PageContainer>
);

export default Error;
