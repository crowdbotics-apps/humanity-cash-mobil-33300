import moment from "moment";
import {CalendarView} from "./constants";
import DatePicker from "react-date-picker";
import {styles} from "./calendar.styles";
import React, {useEffect, useState} from "react";
import {Box, Button, Grid, TextField} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DesktopDatePicker} from "@mui/x-date-pickers";


export const MyToolbar = (props) => {
  const {toolbar, viewState, setViewState, onChangeDate, setShowScheduledServiceModal} = props
  const [Label, setLabel] = useState()

  useEffect(() => {
    if (toolbar) {
      formatLabel(moment(toolbar.date))
    }
  }, [toolbar, viewState])

  const formatLabel = (date) => {
    const todayDate = moment(new Date()).format("MM/DD/YYYY")
    const nowDay = moment(date).format("MM/DD/YYYY")
    let label = ""
    if (viewState === CalendarView.DAY) {
      label = todayDate === nowDay
        ? `Today, ${moment(date).format("MM/DD/YYYY")}`
        : nowDay
    } else {
      label = moment(date).format("MMMM YYYY")
    }
    setLabel(label)
  }

  const goToPrevious = () => {
    let mDate = moment(toolbar.date)
    let newDate
    if (viewState === CalendarView.MONTH) {
      newDate = new Date(mDate.year(), mDate.month() - 1, 1)
    } else if (viewState === CalendarView.WEEK) {
      newDate = moment(new Date(
        mDate.year(),
        mDate.month(),
        mDate.date(),
        1
      )).subtract(7, 'days')
      newDate = newDate.toDate()
    } else {
      newDate = mDate.subtract(1, 'day')
      newDate = newDate.toDate()
    }
    props.goToPrevious(newDate)
    formatLabel(newDate)
  }

  const goToNext = () => {
    let mDate = moment(toolbar.date)
    let newDate
    if (viewState === CalendarView.MONTH) {
      newDate = new Date(mDate.year(), mDate.month() + 1, 1)
    } else if (viewState === CalendarView.WEEK) {
      newDate = moment(new Date(
        mDate.year(),
        mDate.month(),
        mDate.date(),
        1
      ))
      newDate = newDate.add(7, 'days')
      newDate = newDate.toDate()
    } else {
      newDate = mDate.add(1, 'day')
      newDate = newDate.toDate()
    }
    props.goToNext(newDate)
    formatLabel(newDate)
  }


  const toolbarLabel = () => {
    return (
      <>
          <span>
            {viewState !== CalendarView.DAY  && Label}
            {props.CurrentDate && viewState === CalendarView.DAY && (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Date"
                  inputFormat="MM/DD/YYYY"
                  value={moment(props.CurrentDate).toDate()}
                  InputAdornmentProps={{ position: 'end' }}
                  onChange={(newValue)=>{
                    props.goToSpecificDate(newValue.$d)
                  }}
                  renderInput={(params) => <TextField
                    {...params} label={''} helperText={''} placeholder={''}
                  />}
                />
              </LocalizationProvider>
            )}
          </span>

      </>
    )
  }


  const goToMonthView = () => {
    toolbar.onView("month")
    setViewState(CalendarView.MONTH)
    formatLabel(moment(toolbar.date))
    props.goToMonthView(moment(toolbar.date))
  }


  const goToDayView = () => {
    toolbar.onView("day")
    setViewState(CalendarView.DAY)
    formatLabel(moment(toolbar.date))
    props.goToDayView(moment(toolbar.date))
  }
  const goToWeekView = () => {
    toolbar.onView("week")
    props.goToWeekView(moment(toolbar.date))
    setViewState(CalendarView.WEEK)

  }


  return (
    <Box sx={{flexGrow: 1, marginBottom: "30px", marginTop: "20px"}}>
      <Grid container spacing={2}>
        <Grid item md={4} style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
          <div>
            <button style={styles.arrowStyle} onClick={goToPrevious}>
              <img alt="..." src={require("assets/icons/caretLeft.png")}/>
            </button>
            <button style={styles.arrowStyle} onClick={goToNext}>
              <img alt="..." src={require("assets/icons/caretRight.png")}/>
            </button>
            <label style={styles.monthLabel}>{toolbarLabel()}</label>
          </div>
        </Grid>

        <Grid item md={3} style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
          <div style={styles.toolbarStyle}>
            <Button
              style={viewState === 1 ? styles.btnStyle : styles.btnWrapperStyle}
              onClick={goToDayView}>
              <span>Day</span>
            </Button>
            <Button
              style={viewState === 2 ? styles.btnStyle : styles.btnWrapperStyle}
              onClick={goToWeekView}
            >
              <span>Week</span>
            </Button>
            <Button
              style={viewState === 3 ? styles.btnStyle : styles.btnWrapperStyle}
              onClick={goToMonthView}>
              <span>Month</span>
            </Button>
          </div>
        </Grid>
        <Grid item md={3} style={{display: "flex", flexDirection: "row-reverse", alignItems: "center"}}>
          <Button onClick={() => setShowScheduledServiceModal(true)} style={styles.addBtnText}>
            Add Appointment
          </Button>
        </Grid>
        <Grid item md={2} style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
          <img alt="..." src={require("assets/images/logo_img.png")}/>
        </Grid>
      </Grid>
    </Box>
  )

}
