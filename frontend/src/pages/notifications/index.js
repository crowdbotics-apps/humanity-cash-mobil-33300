import React, {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import {APISuccessMessage, showMessage, useApi} from "../../services/helpers"
import MDBox from "../../components/MDBox";
import {Grid} from "@mui/material";
import MDInput from "../../components/MDInput";
import DashboardLayout from "../../components/LayoutContainers/DashboardLayout";
import MDTypography from "../../components/MDTypography";
import MDAvatar from "../../components/MDAvatar";
import logoround from "../../assets/images/logo-round.png"
import moment from "moment/moment";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Pagination from "../../components/Pagination/Pagination";
import ConfirmDialogModal from "../../components/ConfirmDialogModal";

const Notifications = () => {
  const api = useApi()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [selected, setSelected] = useState(null)
  const [message, setMessage] = useState(undefined)
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const [selectedElement, setSelectedElement] = useState(null)

  const avatarStyles = {
    border: ({borders: {borderWidth}, palette: {white}}) =>
      `${borderWidth[2]} solid ${white.main}`,
    position: "relative",
    ml: -1.5,

    "&:hover, &:focus": {
      zIndex: "10",
    },
  };

  const getNotifications = (page = 1) => {
    setLoading(true)
    api.getNotification('', page, '', 25).then((result) => {
      if (result.kind === "ok") {
        const {count, results} = result.data
        setData(results)
        setNumberOfItems(count)
      } else {
        showMessage()
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  const markAsRead = (id) => {
    setLoading(true)
    api.markAsRead(id).then((result) => {
      if (result.kind === "ok") {
        APISuccessMessage()
        getNotifications()
      } else {
        showMessage()
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  const sendNote = (id, data) => {
    setLoading(true)
    api.sendNote(id, data).then((result) => {
      if (result.kind === "ok") {
        APISuccessMessage()
        getNotifications()
        setMessage(undefined)
      } else {
        showMessage()
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  const openReply = (id) => {
    if (selected) {
      setSelected(null)
    } else {
      setSelected(id)
    }
  }

  const sendReply = () => {
    sendNote(selectedElement, message)
    setOpenConfirmModal(false)
    setSelectedElement(null)
    setMessage(" ")
  }
  const handleMessageChange = (string) => {
    setMessage(string.target.value)
  }

  const selectItemNote = (item) => {
    setOpenConfirmModal(true)
    setSelectedElement(item.id)
  }

  const cancelItemNote = () => {
    setOpenConfirmModal(false)
    setSelectedElement(null)
    setMessage(" ")
  }

  useEffect(() => {
    getNotifications()
  }, [])

  const renderNotification = (item) => {
    return (
      <MDBox key={item.id} style={{marginLeft: "auto", marginRight: "auto"}}>
        <Grid container direction={"row"} spacing={2}>
          <Grid item>

              <MDAvatar style={{placeItems: "center"}} src={item?.from_user?.profile_picture ? item.from_user.profile_picture : logoround} size="xl"
                        sx={avatarStyles}/>
          </Grid>
          <Grid item style={{justifyItems: "center", alignItems: "center"}}>
            <Stack>
              <MDTypography style={{fontSize: "18px"}}>{item?.from_user?.name}</MDTypography>
              <MDTypography style={{
                fontSize: "14px",
                opacity: "0.5"
              }}>{moment(item.created_at).format("MMMM Do YYYY")}</MDTypography>
              <MDTypography style={{fontSize: "14px"}}>{item.content}</MDTypography>
            </Stack>
            <MDBox style={{
              width: "50%",
              display: "inline-block",
              textAlign: "left"
            }}
            >
              <MDTypography
                mb={1}
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#438B44",
                  cursor: "pointer",
                }}
                onClick={() => {
                  openReply(item.id)
                }}
              >
                Reply
              </MDTypography>
            </MDBox>
            <MDBox
              style={{
                width: "50%",
                display: "inline-block",
                textAlign: "right"
              }}
            >
              {item.is_read === false ? (
                <MDTypography style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#438B44",
                  cursor: "pointer",
                }}
                              onClick={() => {
                                markAsRead(item.id)
                              }}
                >
                  Mark as Read
                </MDTypography>
              ) : (
                <MDTypography
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#438B44",
                  }}
                  onClick={() => {
                  }}
                >
                  Read
                </MDTypography>
              )
              }
            </MDBox>
            {item.id === selected && item?.from_user && (
              <MDBox pr={2}>
                <MDInput
                  type="text"
                  label="Leave a reply here"
                  multiline
                  value={message}
                  onChange={handleMessageChange}
                  rows={4}
                  fullWidth
                />
                <MDTypography
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#438B44",
                    cursor: "pointer",
                  }}
                  mt={2}
                  onClick={() => {
                    (message === undefined) ?
                      showMessage("Please fill in a reply to send it")
                      :
                      selectItemNote(item)
                  }}
                >
                  Send Reply
                </MDTypography>
              </MDBox>
            )}
          </Grid>
        </Grid>
        <Divider/>
      </MDBox>
    )
  }


  return (
    <DashboardLayout showCard loginRequired>
      {data.length === 0 && <MDBox display={'flex'} flex={1} alignItems={'center'} justifyContent={'center'}>
        <MDTypography>No notifications found</MDTypography>
      </MDBox>}
      {data.length > 0 && data.map(item => renderNotification(item))}
      <Pagination
        currentPage={currentPage}
        totalCount={numberOfItems}
        pageSize={10}
        onPageChange={page => {
          getNotifications(page)
          setCurrentPage(page)
        }}
      />
      <ConfirmDialogModal
        title={'Are you sure you want to save this note?'}
        description={`${message}`}
        cancelText={'Cancel'}
        confirmText={'Confirm'}
        open={openConfirmModal}
        handleClose={() => cancelItemNote()}
        handleConfirm={() => sendReply()}
      />
    </DashboardLayout>
  )
}

export default Notifications
