import React from "react"
import { Modal, Box, IconButton, CardMedia, Typography } from "@mui/material"

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  maxHeight: "90vh",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflow: "auto",
  color: "black"
}

const ModalComponent = ({ open, onClose, title, explanation }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box sx={modalStyle} onClick={onClose}>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "grey.500"
          }}></IconButton>

        <Typography id="modal-modal-title" variant="h4" gutterBottom>
          {title}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {explanation}
        </Typography>
      </Box>
    </Modal>
  )
}

export default ModalComponent
