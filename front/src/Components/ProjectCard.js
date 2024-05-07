import React from 'react';
import { makeStyles } from '@mui/styles';
import { Modal, Box, Typography, Button, Grid, Avatar } from '@mui/material';
import "../GlobalStyles/Card.css";

const ProjectCard = ({ show, project, handleClose, onDelete }) => {

  
  

  return (
    <Modal open={show} onClose={handleClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 10, borderRadius: 10, width: '80vw', maxWidth: 1000,height: 1200, maxHeight: '100vh', overflowY: 'auto' }}>
        {/* Header */}
        <Typography variant="h2" gutterBottom>
          {project.title}
        </Typography>

        {/* Main Content */}
        <Grid container spacing={2}>
          {/* Left Column */}
          <Grid item xs={12} md={6}>

            <Typography variant="h6" gutterBottom>
              Status
            </Typography>
            <Typography variant="body1" gutterBottom>
              {project.status}
            </Typography>

            <Typography variant="h6" gutterBottom>
              Needle
            </Typography>
            {/* <Typography variant="body1" gutterBottom>
              {project.needles}
            </Typography> */}
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={6}>

          <Typography variant="h6" gutterBottom>
              Needles
            </Typography>
            {project.needles.map((needle) => (
              <Typography key={needle.itemId} variant="body1" gutterBottom>
                {needle.type} needle size {needle.size} and {needle.length} cm long
              </Typography>
            ))}

            <Typography variant="h6" gutterBottom>
              Yarn
            </Typography>
            {project.yarns.map((yarn) => (
              <Typography key={yarn.itemId} variant="body1" gutterBottom>
                {yarn.type} by {yarn.manufacturer}, color: {yarn.color}
                Amount in use: {yarn.inUse}
              </Typography>
              
            ))}



            <Typography variant="h6" gutterBottom>
              Notes
            </Typography>
            <Typography variant="body1" gutterBottom>
              {project.notes}
            </Typography>

          </Grid>
        </Grid>

        {/* Footer */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Button variant="contained" color="primary" sx={{ mr: 1 }}>
              Recipe
            </Button>
            <Button variant="contained" color="primary" sx={{ mr: 1 }}>
              Calculators
            </Button>
            <Button variant="contained" color="primary" sx={{ mr: 1 }}>
              Counter
            </Button>
            <Button variant="contained" onClick={onDelete} color="primary" sx={{ mr: 1 }}>
              Delete project
            </Button>
          </Box>
          <Button variant="contained" onClick={handleClose}>Close</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProjectCard;
