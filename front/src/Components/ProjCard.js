import React from 'react';
import { makeStyles } from '@mui/styles';
import { Modal, Box, Typography, Button, Grid, Paper } from '@mui/material';
import "../GlobalStyles/Card.css";




const ProjectCard = ({ show, project, handleClose }) => {

  return (
    <Modal open={show} onClose={handleClose}>
      <Box className="project-card" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
      <Grid item xs={8}>
            <Grid item xs={10}>
              <Typography variant="h2" gutterBottom>
                {project.title}
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Notes
              </Typography>
              <Typography variant="body1" gutterBottom>
                {project.notes}
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="h6" gutterBottom>
                Status
              </Typography>
              <Typography variant="body1" gutterBottom>
                {project.status}
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="h6" gutterBottom>
                Needle
              </Typography>
              <Typography variant="body1" gutterBottom>
                {project.needle}
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="h6" gutterBottom>
                Yarn
              </Typography>
              <Typography variant="body1" gutterBottom>
                {project.yarn}
              </Typography>
            </Grid>

          </Grid>
      

        {/* Add more project information here as needed */}
        <Box sx={{ float: "right", display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mt: 2 }}>
          <Button className="close-button" sx={{ mb: 1 }}>
            Recipe
          </Button>
          <Button className="close-button" sx={{ mb: 1 }}>
            Calculators
          </Button>
          <Button className="close-button"  sx={{ mb: 1 }}>
            Counter
          </Button>
        </Box>

        <Box sx={{ float: "bottom", display: 'flex', flexDirection: 'column-reverse', alignItems: 'flex-end', mt: 2 }}>
          <Button className="close-button" sx={{ bottom: 0, mb: 1 }} onClick={handleClose}>Close</Button>
      
        </Box>

       </Box>
    </Modal>
  );
};

export default ProjectCard;
