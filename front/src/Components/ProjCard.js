import React, { useState } from 'react';
import { Card, CardActionArea, CardContent, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { Document, Page } from 'react-pdf';

const ProjectCard = ({ project }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Card>
        <CardActionArea onClick={handleClickOpen}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {project.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {project.description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{project.title}</DialogTitle>
        <DialogContent>
          <Document file={project.pdfUrl}>
            <Page pageNumber={1} />
          </Document>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProjectCard;
