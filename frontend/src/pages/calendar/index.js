import {observer} from "mobx-react";
import LoadingBar from "react-top-loading-bar";
import React, {memo, useCallback, useEffect, useRef, useState} from "react";
import MDBox from "../../components/MDBox";
import {Backdrop, CircularProgress, Grid} from "@mui/material";
import a from "color-alpha";
import {CalendarView} from "./constants";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import {Calendar as MyCalendar, momentLocalizer} from "react-big-calendar";
import moment from "moment"
import timezone from "moment-timezone"
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "./styles.css"
import "./paper-dashboard.css"
import {MyToolbar} from "./toolbar";
import {styles} from "./calendar.styles";
import {AddNoteOrServiceModal, NotesModal} from "./modals";
import {useApi} from "../../services/helpers";
import {AppointmentModal} from "./appointmentModal";
import MDTypography from "../../components/MDTypography";
import DashboardLayout from "../../components/LayoutContainers/DashboardLayout";


timezone.tz.setDefault("en")
const BigCalendar = memo(withDragAndDrop(MyCalendar))
const localizer = momentLocalizer(timezone)


let XToolbar = null

const CalendarPage = observer(props => {
  const [Requesting, setRequesting] = useState(false)
  const [viewState, setViewState] = useState(CalendarView.DAY)
  const calendarRef = useRef()
  const [Toolbar, setToolbar] = useState(null)
  const [FullSize, setFullSize] = useState(false)
  const [updateValues, setUpdateValues] = useState(false)
  const [currentPendingPage, setCurrentPendingPage] = useState(1)
  const [totalPendingCount, setTotalPendingCount] = useState(false)
  const [pendingRequests, setPendingRequests] = useState([])
  // const [appointmentsDays, setAppointmentsDays] = useState([])
  const [notes, setNotes] = useState([])
  const [TeamMembers, setTeamMembers] = useState([])
  const [Resources, setResources] = useState([])
  const [Teams, setTeams] = useState([])
  const [ShowNoteModal, setShowNoteModal] = useState(false)
  const [ShowAppointmentModal, setShowAppointmentModal] = useState(false)
  const [ShowNoteServiceModal, setShowNoteServiceModal] = useState(false)
  const [SelectedEvent, setSelectedEvent] = useState(null)
  const [SelectedNote, setSelectedNote] = useState(null)
  const api = useApi()
  const [CurrentDate, setCurrentDate] = useState(moment(new Date()))
  const [slotsValue, setSlotsValue] = useState(false)
  const [draggedEvent, setDraggedEvent] = useState()
  const [currentpage, setCurrentPage] = useState(1)
  const [Loading, setLoading] = useState(true)
  const [Appointments, setAppointments] = useState(null)
  const [Events, setEvents] = useState([])

  const resourceDummyData = [
    {
      resourceId: -1,
      resourceTitle: "No appointment"
    }
  ]

  useEffect(() => {
    if (SelectedNote) {
      setShowNoteModal(true)
    }
  }, [SelectedNote])

  useEffect(() => {
    setToolbar(XToolbar)
  }, [XToolbar])


  useEffect(() => {
  }, [Resources])

  const getAppointmentsDays = () => {
    return api.getDayAcceptedAppointments(CurrentDate.format("YYYY-MM-DD")).then((response) => {
      if (response.kind === "ok") {
        return response.data
      }
      return []
    }).catch(error => {
      console.log(error)
      return []
    })
  }

  const getAppointmentsWeek = () => {
    const start = CurrentDate.startOf('week').format('YYYY-MM-DD');
    const end = CurrentDate.endOf('week').format('YYYY-MM-DD');
    return api.getWeekAcceptedAppointments(start, end).then((response) => {
      if (response.kind === "ok") {
        return response.data
      }
      return []
    }).catch(error => {
      console.log(error)
      return []
    })
  }
  const getAppointmentsMonth = () => {
    const startOfMonth = CurrentDate.startOf('month').format('YYYY-MM-DD');
    const endOfMonth = CurrentDate.endOf('month').format('YYYY-MM-DD');

    return api.getMonthAcceptedAppointments(startOfMonth, endOfMonth).then((response) => {
      if (response.kind === "ok") {
        return response.data
      }
      return []
    }).catch(error => {
      console.log(error)
      return []
    })
  }

  const processEvents = async () => {

    setLoading(false)


    let teams = await getTeams()
    setTeams(teams)

    const unassignedTeam = teams.filter(v => v.title === 'Unassigned')
    const restOfTeams = teams.filter(v => v.title !== 'Unassigned')

    // this is to let the unassigned on the last position at list
    teams = [...restOfTeams, ...unassignedTeam]

    // const date = sessionStorage.getItem("date")
    const date = moment(CurrentDate).format("YYYY-MM-DD")
    let events = []
    if (viewState === 1) {
      events =
        teams &&
        teams
          .map((item, index) => {
            return (
              item &&
              (viewState === 1) &&
              item?.team_members?.map(member => {
                return {
                  allDay: true,
                  end: new Date(`${date} 00:00:00`),
                  start: new Date(`${date} 00:00:00`),
                  title: member?.name,
                  resourceId: item?.id,
                  color: "#88AE31",
                  memberId: member?.id,
                  teamId: item?.id,
                  viewState: viewState
                }
              })
            )
          })
          .flat(1)
    }


    const service = Appointments && Appointments.map((item, index) => {
      const data = {
        allDay: false,
        end: new Date(`${item?.appointment_date} ${item?.end_time}`),
        start: new Date(`${item?.appointment_date} ${item?.start_time}`),
        title: item?.title,
        resourceId: item?.assigned_team?.id,
        color: item && item.frequency ? item.frequency.color_code : item.color_code,
        desc: item?.service?.description,
        eventDetail: item,
        viewState: viewState,
        isNote: item.is_note
      }
      if (data.isNote) {
        data.desc = item.description ? item.description.substr(0, 30) + "..." : ""
      }


      return data
    })

    if (service && service.length) {
      events.push(...service)
    }

    const teamResource =
      teams &&
      teams.map(element => {
        return {
          resourceId: element?.id,
          resourceTitle: element?.title
        }
      })
    const resourceList = teamResource.length ? teamResource : resourceDummyData
    setResources(resourceList)
    setEvents(events)
  }

  useEffect(() => {
    if (SelectedEvent) {
      setShowAppointmentModal(true)
    }
  }, [SelectedEvent])


  useEffect(() => {
    processEvents()
  }, [Appointments])

  const init = async () => {
    let appointments = null
    if (viewState === 1) {
      appointments = await getAppointmentsDays()
    } else if (viewState === 2) {
      appointments = await getAppointmentsWeek()
    } else {
      appointments = await getAppointmentsMonth()
    }
    setAppointments(appointments)
  }

  useEffect(() => {
    init()
    getNotes()
    getPendingRequests()
  }, [CurrentDate])


  const handlePendingPageChange = page => {
    setCurrentPendingPage(page)
    // props.getPendingRequests(page)
  }


  const onChangeDate = (selectedDate, toolbar) => {
    XToolbar = toolbar
    XToolbar.onNavigate("next", selectedDate)
  }

  const getTeams = () => {
    return api.getCustomTeams("", 1, "", 10000, {all_teams: true, current_date: CurrentDate ? moment(CurrentDate).format('YYYY-MM-DD'): null}).then((response) => {
      return (response.kind === "ok") ? response.data.results : []
    }).catch(error => {
      console.log(error)
      return []
    })
  }


  const getPendingRequests = () => {
    api.getPendingRequests(1).then((response) => {
      if (response.kind === "ok") {
        setPendingRequests(response.data.results)
      }
    }).catch(error => console.log(error))
  }

  const getNotes = () => {
    api.getNotesCalendar({}).then((response) => {
      if (response.kind === "ok") {
        setNotes(response.data.results)
      }
    }).catch(error => console.log(error))
  }

  const EmptyToolbar = (toolbar) => {
    XToolbar = toolbar
    return (<div></div>)
  }

  const goToDayView = (date) => {
    setLoading(true)
    setCurrentDate(moment())
    setViewState(1)
    setFullSize(false)
  }

  const goToWeekView = (date) => {
    setCurrentDate(moment())
    setResources([])
    setLoading(true)
    setViewState(2)
    setFullSize(false)
  }

  const goToSpecificDate = (date) => {
    setCurrentDate(moment(date))
    if (date instanceof Date && !isNaN(date)){
      setLoading(true)
      setToolbar(XToolbar)
      setViewState(1)
      setFullSize(false)
      XToolbar.onNavigate("next", date)
    }

  }


  const goToNext = (date) => {
    setLoading(true)
    setCurrentDate(moment(date))
    XToolbar.onNavigate("next", date)
    setToolbar(XToolbar)
  }


  const goToPrevious = (date) => {
    setLoading(true)
    setCurrentDate(moment(date))
    XToolbar.onNavigate("previous", date)
    setToolbar(XToolbar)
  }


  const goToMonthView = (date) => {
    setCurrentDate(moment())
    setLoading(true)
    setViewState(3)
    setFullSize(true)
  }

  const updateValue = note => {
    // setUpdateValues(items)
    setSelectedNote(note)
  }

  const WeekHeaderCellContent = props => {
    const {date} = props
    return (
      <div style={{height: 90, paddingTop: 20, marginBottom: 20}}>
        <div style={styles.dayWeekStyle} component="span">
          {moment(date).format("ddd")}
        </div>
        <div component="span" style={styles.dayWeekTextStyle}>
          {moment(date).format("D")}
        </div>
      </div>
    )
  }

  const MonthHeaderCellContent = props => {
    const {date} = props
    return (
      <div style={styles.monthHeaderStyle}>
        <div style={styles.dayMonthStyle} component="span">
          {moment(date).format("ddd")}
        </div>
      </div>
    )
  }

  const DateCellWrapper = ({date, label}) => {
    return (
      <div style={styles.monthDayCellStyle}>
        <span>{label}</span>
      </div>
    )
  }


  const EventViewMonth = React.memo(({event}) => {
    return (
      <div style={styles.eventViewMonthContent}>
        <span style={styles.eventViewMonthTitle}>{event.title}</span>
      </div>
    )
  })


  const addTeamDrageOver = e => {
    e.preventDefault()
  }


  const EventViewWeek = ({event}) => {
    return (
      <div style={styles.eventViewWeekContent}>
        <div>
          <span style={styles.eventViewWeekTitle}>
           {event.title}
          </span>
        </div>
      </div>
    )
  }

  const handleSelectEvent = (event) => {
    if (event.hasOwnProperty('isNote')) {
      if (event.isNote) {
        setSelectedNote(event)
      } else {
        setSelectedEvent(event)
      }
    }
  }

  const EventViewDay = ({event}) => {
    return (
      <div style={styles.eventViewDayContent}>
        <div>
          <div style={styles.eventViewDayTitle}>
            <MDTypography style={{
              color: event.isNote ? "white" : "black",
              fontSize: 12,
              fontWeight: "bold"
            }}> {event.title} </MDTypography>
          </div>
          <span style={styles.desStyle}>
            <MDTypography style={{color: event.isNote ? "white" : "black", fontSize: 12}}> {event.desc} </MDTypography>
          </span>
        </div>
        <div>
          <span style={{
            ...styles.desStyle,
            color: event.isNote ? "white" : "black",
            fontWeight: "bold"
          }}>{`${moment(event.start).format("h:mm A")}-${moment(
            event.end).format("h:mm A")}`}</span>
        </div>
      </div>
    )
  }

  const AllDayEvent = React.memo(({event}) => {
    return (
      <div
        className={viewState === 3 ? "" : "pt-2"}
        draggable
        onDragOver={e => event.allDay && addTeamDrageOver(e)}>
              <span
                style={{
                  fontWeight: event.allDay ? "500" : "600",
                  fontFamily: "Montserrat",
                  fontSize: 12,
                  color: "white"
                }}
              >
                {event.title}
              </span>
      </div>
    )
  })


  function CustomEvent(opts) {
    const {event} = opts
    return (
      <>
        {event.allDay && (
          <AllDayEvent event={event}/>
        ) || (
          <>
            {event.viewState === CalendarView.DAY && (
              <EventViewDay event={event}/>
            )}
            {event.viewState === CalendarView.WEEK && (
              <EventViewWeek event={event}/>
            )}
            {event.viewState === CalendarView.MONTH && (
              <EventViewMonth event={event}/>
            )}
          </>
        )}
      </>
    )
  }


  const onEventDrop = props => {
    const teamId = Teams.find(items => items.id === props.resourceId)
    if (props?.isAllDay || props.event.allDay === true) {
      if (props.event.teamId !== undefined) {
        const id = teamId.custom_id
        const data = {
          employee_id: props.event.memberId,
          id,
          current_date: CurrentDate ? moment(CurrentDate).format('YYYY-MM-DD'): null
        }
        if (props.event.resourceId !== id) {
          api.addTeamCustomMember(data).then(() => {
            processEvents()
          }).catch(err => console.log(err))

          setCurrentPage(1)
        }
      }
    } else {
      if (teamId?.title !== "Unassigned") {
        const id = props.event.eventDetail.id
        const swapIndex = Appointments.findIndex(e => e.id === id)
        const data = new FormData()

        data.append("appointment_date", moment(props.end).format("YYYY-MM-DD"))
        data.append("start_time", moment(props.start).format("HH:mm:ss"))
        data.append("end_time", moment(props.end).format("HH:mm:ss"))
        viewState === 1 && data.append("assigned_team_id", props?.resourceId)

        let appointmentData = [...Appointments]


        if (props.event.isNote) {
          api.editNoteAppointment(id, data).then(response => {
            if (response.kind === "ok") {
              appointmentData[swapIndex] = response.response
              setAppointments(appointmentData)
            }
          }).catch(err => console.log(err))
        } else {
          api.editAppointment(id, data).then(response => {
            if (response.kind === "ok") {
              appointmentData[swapIndex] = response.response
              setAppointments(appointmentData)
            }
          }).catch(err => console.log(err))
        }
      }
    }
  }

  const onSelectSlot = ({action, slots, ...props}) => {

    const selSlotTeam = Teams.find(item => item.id === props.resourceId)
    const teamOrNull = selSlotTeam?.title === "Unassigned" ? null : selSlotTeam
    setSlotsValue({team: teamOrNull, slots})
    setShowNoteServiceModal(true)

    return false
  }

  const customOnDragOver = useCallback(
    dragEvent => {
      if (draggedEvent !== "undroppable") {
        dragEvent.preventDefault()
      }
    },
    [draggedEvent]
  )

  return (
    <DashboardLayout loginRequired showNavbar={false} fullSize={true}>
      <LoadingBar color="#4B8C01" height={5} progress={Requesting ? 30 : 100}/>
      <Backdrop
        sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
        open={Loading}
      >
        <CircularProgress color="inherit"/>
      </Backdrop>


      <MyToolbar
        toolbar={Toolbar}
        CurrentDate={CurrentDate}
        viewState={viewState}
        setShowScheduledServiceModal={setShowAppointmentModal}
        goToNext={goToNext}
        goToPrevious={goToPrevious}
        onChangeDate={onChangeDate}
        goToDayView={goToDayView}
        goToWeekView={goToWeekView}
        goToMonthView={goToMonthView}
        goToSpecificDate={goToSpecificDate}
        setViewState={setViewState}/>

      <Grid container spacing={0}>
        <Grid item lg={FullSize ? 12 : 10}>
          <BigCalendar
            ref={calendarRef}
            components={{
              toolbar: EmptyToolbar,
              event: CustomEvent,
              week: {
                header: WeekHeaderCellContent
              },
              month: {
                header: MonthHeaderCellContent,
                dateHeader: DateCellWrapper
              }
            }}

            localizer={localizer}
            onEventDrop={onEventDrop}
            onDragOver={customOnDragOver}
            // min={new Date(0, 0, 0, 7, 0, 0)}
            // max={new Date(0, 0, 0, 19, 0, 0)}
            events={Events}
            selectable
            resourceIdAccessor={viewState === 1 ? "resourceId" : null}
            resources={viewState === 1 ? Resources : null}
            resourceTitleAccessor={viewState === 1 ? "resourceTitle" : null}
            defaultView="day"
            onSelectSlot={onSelectSlot}
            dayLayoutAlgorithm="no-overlap"
            showMultiDayTimes={true}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={event => handleSelectEvent(event)}
            eventPropGetter={event => {
              const eventData = Events.find(ot => ot?.eventDetail?.id === event?.eventDetail?.id)

              let backgroundColor = eventData && eventData.color

              let styles = {
                borderRadius: viewState === 3 ? 10 : 5
              }
              if (event.allDay) {
                backgroundColor = `linear-gradient(0deg, ${backgroundColor}  40%, ${a(backgroundColor, .8)} 60%, ${a(backgroundColor, .7)} 80%,  ${a(backgroundColor, .6)} 100%)`
                styles.height = "30px"
                styles.textAlign = "center"
              } else if (event.isNote) {
                backgroundColor = `#4c9041`
                styles.border = "none"
              } else {
                backgroundColor = `linear-gradient(180deg, ${backgroundColor}  30%, ${a(backgroundColor, .9)} 45%,  ${a(backgroundColor, .8)} 50%, ${a(backgroundColor, .7)} 60%,  ${a(backgroundColor, .4)} 100%)`
                styles.border = "none"
              }
              styles.fontFamily = "Montserrat"
              styles.fontSize = 13
              styles.color = "black"

              if (viewState === 2) {
                styles.fontWeight = "bold"
                styles.width = "30px !important"
                styles.minWidth = "30px !important"
              } else if (viewState === 1) {
                styles.fontWeight = "bold"
              }
              styles.background = backgroundColor
              return {
                style: styles,
              }
            }}
          />
        </Grid>
        {!FullSize && (
          <Grid item lg={2}>
            <div style={styles.rightCol}>
              <div style={styles.rightColTitle}>
                <span style={{fontWeight: "500", fontSize: 12}}>Requests / Notes</span>
              </div>
              <div className="text-center" style={styles.headerTextStyle}>
                <MDBox md={4} sm={12} style={styles.notesTitle}>
                  <button
                    style={{display: "contents"}}
                    onClick={() => {
                      setSelectedNote({})
                      setShowNoteModal(true)
                    }}>
                    <img
                      alt="..."
                      src={require("assets/icons/plusCircle.png")}
                    />
                  </button>
                  <span style={{marginLeft: 5}}>Notes</span>
                </MDBox>
              </div>
              <div style={{overflowY: "scroll", height: 300}}>
                {notes.length ? (
                  notes.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => updateValue(item)}
                      className="text-center"
                      style={styles.notesListStyle}
                    >
                      <div>
                        <label style={styles.labelStyle}>
                          {item.title}
                        </label>
                      </div>
                      <div>
                        <label style={styles.labelStyle}>
                          {item.description}
                        </label>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center">
                    <label style={styles.notFoundStyle}>
                      No record found
                    </label>
                  </div>
                )}
              </div>
              <div
                className="text-center"
                style={styles.pendingTextStyle}
              >
                <span>Pending Requests</span>
              </div>
              <div style={{overflowY: "scroll", height: 300}}>
                {pendingRequests?.length ? (
                  pendingRequests?.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {

                        // setEventDetail(item)
                        // setUpdateModal(true)
                      }}
                      className="text-center"
                      style={styles.teamListStyle}
                    >
                      <label style={styles.labelStyle}>
                        {item.title}
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="text-center">
                    <label style={styles.notFoundStyle}>
                      No record found
                    </label>
                  </div>
                )}
              </div>
              {totalPendingCount && totalPendingCount && (
                <div className="pt-3 d-flex justify-content-center">
                  {/*<Pagination*/}
                  {/*  aria-label="Page navigation example"*/}
                  {/*  itemClass="page-item"*/}
                  {/*  linkClass="page-link"*/}
                  {/*  prevPageText="<"*/}
                  {/*  nextPageText=">"*/}
                  {/*  firstPageText="<<"*/}
                  {/*  lastPageText=">>"*/}
                  {/*  activePage={currentPendingPage}*/}
                  {/*  itemsCountPerPage={24}*/}
                  {/*  pageRangeDisplayed={2}*/}
                  {/*  totalItemsCount={*/}
                  {/*    totalPendingCount && totalPendingCount*/}
                  {/*  }*/}
                  {/*  onChange={handlePendingPageChange}*/}
                  {/*/>*/}
                </div>
              )}
            </div>
          </Grid>
        )}

      </Grid>

      <NotesModal
        open={ShowNoteModal}
        note={SelectedNote}
        slotValue={slotsValue}
        onSave={() => {
          setSelectedNote(null)
          init()
          getNotes()
        }}
        handleClose={() => setShowNoteModal(false)}/>

      <AppointmentModal
        showModal={ShowAppointmentModal}
        appointment={SelectedEvent?.eventDetail}
        onSave={() => {
          init()
          setShowAppointmentModal(false)
        }}
        slotValue={slotsValue}
        handleClose={() => {
          setSelectedEvent(null)
          setShowAppointmentModal(false)
        }}/>


      <AddNoteOrServiceModal
        open={ShowNoteServiceModal}
        handleClose={() => {
          setSlotsValue(false)
          setShowNoteServiceModal(false)
        }}
        handleAddAppointment={() => {
          setShowAppointmentModal(true)
          setShowNoteServiceModal(false)

        }}
        handleAddNote={() => {
          setShowNoteModal(true)
          setShowNoteServiceModal(false)
        }}

      />


    </DashboardLayout>
  )

})

export default CalendarPage
