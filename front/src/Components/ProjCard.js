import React from 'react';
import { Modal, Box, Typography, Button, Grid } from '@mui/material';
import "../GlobalStyles/Card.css";

const ModalCard = ({ show, project, handleClose }) => {
  return (
    <Modal open={show} onClose={handleClose}>
      <Box className="project-card" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
      <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="h6" gutterBottom>
              Title
            </Typography>
            <Typography variant="body1" gutterBottom>
              {project.title}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" gutterBottom>
              Notes
            </Typography>
            <Typography variant="body1" gutterBottom>
              {project.notes}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" gutterBottom>
              Status
            </Typography>
            <Typography variant="body1" gutterBottom>
              {project.status}
            </Typography>
          </Grid>
        </Grid>
        {/* Add more project information here as needed */}
        <Box sx={{ float: "right", display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mt: 2 }}>
          <Button className="close-button" sx={{ mb: 1 }} variant="outlined">
            Recipe
          </Button>
          <Button className="close-button" sx={{ mb: 1 }}>
            Calculators
          </Button>
          <Button className="close-button"  sx={{ mb: 1 }}>
            Counter
          </Button>
        </Box>

        <Button className="close-button" sx={{ bottom: 0, mb: 1 }} onClick={handleClose}>Close</Button>
      </Box>
    </Modal>
  );
};

export default ModalCard;
