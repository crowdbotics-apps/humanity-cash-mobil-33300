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
        <Typography variant="h5" textAlign={'left'} mb={2} fontWeight={700} color={'primary'}>
          {title}
        </Typography>
        <Typography variant="text" textAlign={'left'} mb={4} fontWeight={500} fontSize={14}>
          {description}
        </Typography>
        <Grid container display={'flex'} justifyContent={'center'} mt={2}>
            {cancelText &&
              <Grid item xs={5}>
                <MDButton variant="outlined" color="primary" fullWidth onClick={handleClose}>
                  {cancelText}
                </MDButton>
              </Grid>
            }
            {confirmText &&
                <Grid item xs={5} ml={2}>
                    <MDButton variant="contained" color="primary" fullWidth onClick={handleConfirm}>
                        {confirmText}
                    </MDButton>
                </Grid>
            }
        </Grid>
      </Box>
    </Modal>
  )
};

export default ConfirmDialogModal;
