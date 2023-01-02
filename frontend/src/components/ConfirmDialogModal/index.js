import React from 'react';
import {Grid, Modal} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MDButton from "../MDButton";


const ConfirmDialogModal = ({
                              title,
                              description,
                              cancelText,
                              confirmText,
                              open,
                              handleClose,
                              handleConfirm,
                              children=null
                            }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        minWidth: 300,
        minHeight: 150,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'column',
        flex: 1
      }}>
        <Typography variant="h5" textAlign={'center'} mb={2}>
          {title}
        </Typography>
        <Typography variant="text" textAlign={'center'} mb={2}>
          {description}
        </Typography>
        <Grid container display={'flex'} justifyContent={'center'} mt={2}>
          <Grid item xs={5}>
            <MDButton variant="gradient" color="primary" fullWidth onClick={handleClose}>
              {cancelText}
            </MDButton>
          </Grid>
          <Grid item xs={5} ml={2}>
            <MDButton variant="gradient" color="error" fullWidth onClick={handleConfirm}>
              {confirmText}
            </MDButton>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
};

export default ConfirmDialogModal;
