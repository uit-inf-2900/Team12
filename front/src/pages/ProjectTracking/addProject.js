import React, { useState, useRef } from 'react';
import { IoIosCloudUpload } from "react-icons/io";
import { makeStyles } from '@mui/styles';
import Modal from '@mui/material/Modal';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';
import InputField from '../../Components/InputField';
import CustomButton from '../../Components/Button';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: 400,
    outline: 'none',
    borderRadius: 8,
  },
}));

const UploadProjects = ({ onClose }) => {
  const classes = useStyles();
  if (!show) {
    return null; // Render nothing if show is false
    }
  

  return (
    <Modal open={show} onClose={onClose}>
    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 400, }}>
        <Typography variant="h6" component="h2">
            {project.title}
        </Typography>
        <Typography variant="body1">
            Status: {project.status}
        </Typography>
        <Typography variant="body1">
            Knitting Gauge: {project.knittingGauge}
        </Typography>
        <Button onClick={handleClose} variant="contained" color="primary" sx={{ mt: 2 }}>
            Close
        </Button>
    </Box>
</Modal>
    );
};

export default UploadProjects;
