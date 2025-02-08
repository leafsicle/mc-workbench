import React, { useState } from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography
} from '@mui/material';
import ModalComponent from '../modal/modal';

export const CardComponent = ({ title, image, explanation, hdVersion }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Card 
        sx={{ width: "100%", height: "100%", mb: 4, cursor: 'pointer' }}
        onClick={handleOpen}
      >
        <CardMedia
          component="img"
          height="100%"
          image={hdVersion ? hdVersion : image}
          alt={title}
        />
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {explanation}
          </Typography>
        </CardContent>
      </Card>

      <ModalComponent
        open={open}
        onClose={handleClose}
        title={title}
        image={image}
        explanation={explanation}
        hdVersion={hdVersion}
      />
    </>
  );
};

export default CardComponent;
