import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';

const CardComponent = ({ title, image, explanation }) => {
  return (
    <Card sx={{  width: "100%", height: "100%", mb: 4, aspectRatio: origin}}>
      <CardMedia
        component="img"
        height="400"
        image={image}
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
  )
}

export default CardComponent;
