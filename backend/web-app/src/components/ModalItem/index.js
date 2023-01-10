import React from 'react';
import {Modal} from "@mui/material";
import Box from "@mui/material/Box";
import ClearIcon from "@mui/icons-material/Clear";
import Typography from "@mui/material/Typography";
import MDBox from "../MDBox";
import DeleteIcon from "@mui/icons-material/Delete";

const ModalItem = ({
                     children,
                     title,
                     handleClose,
                     handleDelete = null,
                     open,
                     closeOnClickOutside= true,
                     scrollable = true,
                     height = 600,
                     width = "100%",
                     paddingStyle = 4,
                     marginRightIcon,
                     marginTopIcon,
                     fontSizeIcon
                   }) => {
  return (
    <Modal
      open={open}
      onClose={(event)=>{
        if(closeOnClickOutside){
          handleClose(event)
        }
      }}
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        minWidth: 500,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: paddingStyle,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'column',
        flex: 1
      }}>
        <MDBox style={{display: "flex", flexDirection: "row",flex: 1}}>

          {handleDelete !== null && (
            <DeleteIcon sx={{marginRight: 'auto', cursor: 'pointer', marginLeft: marginRightIcon, marginTop: marginTopIcon}}
                       color={'secondary'} onClick={handleDelete} fontSize={fontSizeIcon}/>
          )}
          <ClearIcon sx={{marginLeft: 'auto', cursor: 'pointer', marginRight: marginRightIcon, marginTop: marginTopIcon}}
                     color={'secondary'} onClick={handleClose} fontSize={fontSizeIcon}/>
        </MDBox>
        <Typography variant="h3" textAlign={'center'} mb={2}>
          {title}
        </Typography>
        <MDBox sx={{overflowY: scrollable ? 'auto' : 'unset', overflowX: 'hidden'}} display={'flex'} height={height} width={width}>
          {children}
        </MDBox>
      </Box>
    </Modal>
  )

};

export default ModalItem;
