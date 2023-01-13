import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import { useEffect, useRef, useState } from "react"
import { showMessage, useApi } from "../../services/helpers"
import { useNavigate } from "react-router-dom";
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction'
import MDBox from "components/MDBox";

import { CalendarIcon, StoriesIcon } from "../../assets/svg";
import { event_list } from "./data";
import { ContentEventCard, ContentEventDetail, getTitleFormat, HourLine } from "./components";
import '../../assets/fakescroll/fakescroll.css'
import FakeScroll from '../../assets/fakescroll/react.fakescroll.js'
import moment from 'moment'
import MDButton from "components/MDButton";
import ConfirmDialogInputModal from "components/ConfirmDialogInputModal";
import {AddEventForm, AddStoryForm} from "./forms";

// keep at the end
import './Content.css';

const getDateRange = (dateRange) => {
  if (dateRange === null || dateRange === undefined) {
    return {
      start: moment().startOf('month').format(),
      end: moment().endOf('month').format()
    }
  }
  return {
    start: moment(dateRange.start).add(1, 'days').startOf('month').format(),
    end: moment(dateRange.end).endOf('month').format()
  }
}

const BlockchainTransactions = () => {
  const api = useApi()
  const navigate = useNavigate()
  const CalendarEl = useRef(null);
  const [loading, setLoading] = useState(false)

  const { innerWidth: width, innerHeight: height } = window;
  const [CalendarHeight, setCalendarHeight] = useState(height * 0.7)
  const [calendarApi, setCalendarApi] = useState(null)
  const [show, setShow] = useState(false);
  const [Title, setTitle] = useState('')
  const [RightEvents, setRightEvents] = useState([])
  const [Details, setDetails] = useState([])
  const [DetailsTitle, setDetailsTitle] = useState("")
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [DateRange, setDateRange] = useState(getDateRange())
  const [AllEvents, setAllEvents] = useState([])
  const [CalendarEvents, setCalendarEvents] = useState([])
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [CurrentEvent, setCurrentEvent] = useState(null)

  const handleShow = () => setShow(true);

  const initCalendar = () => {
    // @ts-ignore
    if (!CalendarEl?.current) return
    let api = CalendarEl.current.getApi()
    setCalendarApi(api)
    setTitle(api.currentDataManager.data.viewTitle)
    setRightEvents(event_list)
  }

  const handleDateClick = (arg) => { // bind with an arrow function
    setDetails(event_list[0].events)
    let target = arg.el.closest(".fc-daygrid-day")
    let selectedDay = ''
    selectedDay = target.querySelector('.fc-daygrid-day-number').firstChild.textContent
    setDetails(CalendarEvents.filter((value)=> moment(value.date).format('D') === selectedDay))
    setShowDetailModal(true)
  }

  const next = () => {
    setCalendarEvents([])
    setRightEvents([])
    setAllEvents([])
    // @ts-ignore
    calendarApi.next()
    // @ts-ignore
    let current = calendarApi.currentDataManager.data.dateProfile.currentRange
    setDateRange(current)
    // @ts-ignore
    setTitle(calendarApi.currentDataManager.data.viewTitle)
  }

  const previous = () => {
    setCalendarEvents([])
    // @ts-ignore
    calendarApi.prev()
    // @ts-ignore
    let current = calendarApi.currentDataManager.data.dateProfile.currentRange
    setDateRange(current)
    // @ts-ignore
    setTitle(calendarApi.currentDataManager.data.viewTitle)
  }

  const groupEvents = (eventList) => {
    let data = {}
    let allEvents = []
    let calendarEvents = []
    for (const event of eventList) {
      let newEvent = {
        title: event.title,
        description: event.description,
        id: event.id,
        link: event.link,
        location: event.location,
        date: event.start_date,
        img: event.image,
        eventType: event.event_type,
        startTime: event.start_date,
        endTime: event.end_date,
        startDate: event.start_date,
        endDate: event.end_date
      }
      allEvents.push(newEvent)
      let aux_date = moment(event.start_date).format('YYYY-MM-DD')
      if (Object.keys(data).indexOf(aux_date) === -1) {
        // @ts-ignore
        data[aux_date] = { title: event.start_date, events: [newEvent] }
      } else {
        // @ts-ignore
        data[aux_date].events.push(newEvent)
      }
    }

    let rightEvents = []
    for (let k of Object.keys(data)) {
      // @ts-ignore
      if (data[k].events.length > 1) {
        // @ts-ignore
        for (let event of data[k].events) {
          event.isOverlapping = true
          calendarEvents.push(event)
        }
      } else {
        // @ts-ignore
        data[k].events[0].isOverlapping = false
        // @ts-ignore
        calendarEvents.push(data[k].events[0])
      }
      // @ts-ignore
      rightEvents.push(data[k])

    }
    setAllEvents(allEvents)
    setRightEvents(rightEvents)
    setCalendarEvents(calendarEvents)
    setLoading(false)
  }

  const getEventsRequest = () => {
    setLoading(true)
    api.getEvents(getDateRange(DateRange)).then((result) => {
      if (result.kind === "ok") {
        groupEvents(result.data.results)
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  const deleteEvent = (id)=>{
    setLoading(true)
    api.deleteEvent(id).then((response) => {
      if (response.kind === "not-found") {
        console.log("error deleting event", response)
        showMessage("Object not found");
      } else {
        setLoading(false)
        getEventsRequest()
        showMessage('Deleted successfully');
        setDetails(Details.filter(value => value.id !== id))
        setShowStoryModal(false)
      }
    }).catch(err => showMessage())
  }

  const editEvent = (event)=>{
    console.log("edit event", event)
    setCurrentEvent(event)
    // setShowDetailModal(false)
    if(event.eventType === 'story'){
      setShowStoryModal(true)
    }else{
      setShowEventModal(true)
    }
  }

  const patchEvent = (event:any)=>{
    api.editEvent(event.id, event).then((result: any) => {
      console.log(" api.editEvent", result)
      if (result.kind === "ok") {

        showMessage("Created successfully.");
        setDetails(Details.map(value => value.id === event.id?event:value))
        getEventsRequest()
        setShowStoryModal(false)
      } else {
        // showMessage(getErrorMessages(result.errors), {
        //   position: toast.POSITION.TOP_CENTER
        // });
      }
    }).catch(err => showMessage())
  }

  const createEvent = (event:any)=>{
    api.createEvent(event).then((result: any) => {
      console.log(" api.createEvent", result)
      if (result.kind === "ok") {
        showMessage("Saved successfully.");
        getEventsRequest()
        setShowStoryModal(false)
      } else {
        // showMessage(getErrorMessages(result.errors), {
        //   position: toast.POSITION.TOP_CENTER
        // });
      }
    }).catch(err => showMessage())
  }

  const saveEvent = (data)=>{
    console.log("saveEvent", data)
    setCurrentEvent(null)
    let event = {
      id: data.id,
      title: data.title,
      description: data.description,
      event_type: data.eventType,
      start_date: data.startDate,
      location: data.location,
      end_date: data.endDate,
      image: null,
      link:data.link
    }
    console.log(data)
    if(data.id){
      patchEvent(event)
    }else{
      createEvent(event)
    }
    setShowEventModal(false)
  }

  const saveStory = (data:any)=>{
    setCurrentEvent(null)
    let event = {
      id: data.id,
      title: data.title,
      link: data.link,
      description: data.description,
      event_type: data.eventType,
      start_date: data.date,
      image: null
    }
    console.log(data)
    if(data.id){
      patchEvent(event)
    }else{
      createEvent(event)
    }
  }
  
  useEffect(() => {
    getEventsRequest()
    initCalendar()
  }, [])

  const onFakeScrollChange = (scrollRatio) => {
    // console.log("scroll ratio", scrollRatio)
  }

  const getHourFormatted = (date) => {
    return moment(date).format('HH a').toUpperCase()
  }

  const renderEventContent = (eventInfo) => {
    const eventType =  eventInfo.event._def.extendedProps.eventType
    const eventHour =  moment(eventInfo.event._def.extendedProps.startDate).format("hh:mm A")

    const isOverlaping =  eventInfo.event._def.extendedProps.isOverlapping

    const Overlapping = (event)=> (<div className={'dot my-event-overlapped my-event-overlapped-'+eventType} />)
    return (
      <>
        {isOverlaping 
        ?<Overlapping event={eventInfo.event} />
        : <div className={'my-event my-event-'+eventType} >
            <h5 className={'my-event-title'}>{eventInfo.event.title.slice(0,12) }</h5>
            <h5 className={'my-event-subtitle'}>{eventHour}</h5>
          </div>
        }
      </>
    )
  }

  const renderDayContent = (value, index) => {
    return (
      <div
        key={'day-content-' + index}
        onClick={() => {
          setDetails(value.events)
          setDetailsTitle(getTitleFormat(value.title))
          setShowDetailModal(true)
          console.log(value)
        }}>
        <div className={'text-gray'} style={{ fontSize: 12, marginLeft: 20 }}>{getTitleFormat(value.title)}</div>
        <div style={{ marginBottom: 20 }}>
          {value.events.map((data, index) => {
            return (
              <div key={index}>
                <HourLine hour={getHourFormatted(data.date)} />
                <ContentEventCard event={data} />
                <HourLine hour={getHourFormatted(data.date)} />
              </div>)
          })}
        </div>
      </div>
    )
  }

  const CalendarHeader = () => {
    return (
      <div className={'calendar-header'}>
        <MDBox style={{ width: 280, justifyContent: 'space-between', display: 'flex'}}>
          <button type="button"
            title="Previous month"
            aria-pressed="true"
            onClick={previous}
            className="fc-button">
            <span className="fc-icon fc-icon-chevron-left" /></button>
          <span className="fc-toolbar-title" >{Title}</span>
          <button type="button"
            title="Next month"
            aria-pressed="true"
            onClick={next}
            className="fc-button">
            <span className="fc-icon fc-icon-chevron-right" /></button>
        </MDBox>
        <MDBox className={'col-4 calendar-header'}>
          <div className={'dot my-event-overlapped-story'} />
          <div style={{ marginLeft: 15, fontSize: 15 }} className={'text-gray'}>EVENTS</div>
          <div style={{ marginLeft: 35 }} className={'dot my-event-overlapped-event'} />
          <div style={{ marginLeft: 15, fontSize: 15 }} className={'text-gray'}>STORIES </div>
        </MDBox>
        <MDBox className={'col-4'}>
          <MDButton className={'create-btn'} onClick={handleShow}>
            Create
          </MDButton>
        </MDBox>
      </div>
    )
  }

  const createModal = <ConfirmDialogInputModal
    title={'Create'}
    description={'Lorem ipsum dolor sit amet '}
    open={show}
    width={800}
    hideButtons
    handleClose={() => setShow(false)}
  >
    <MDBox display={'flex'}>
      <MDBox style={{ width: '50%', marginRight: '10px' }}>
        <div className={'col-modal-create col-modal-left'}
          onClick={event => {
            setShow(false)
            setShowStoryModal(true)
          }}>
          <div>
            <StoriesIcon />
          </div>
          <div className={'text-blue'} style={{ fontSize: 34, marginLeft: 10, fontWeight: 500 }}>
            Story
          </div>
        </div>
      </MDBox>
      <MDBox style={{ width: '50%', marginLeft: '10px' }}>
        <div className={'col-modal-create col-modal-right'}
          onClick={event => {
            setShow(false)
            setShowEventModal(true)
          }}
        >
          <div>
            <CalendarIcon />
          </div>
          <div className={'text-blue'} style={{ fontSize: 34, marginLeft: 10, fontWeight: 500 }}>
            Event
          </div>
        </div>
      </MDBox>
    </MDBox>
  </ConfirmDialogInputModal>

  const eventDetailModal = <ConfirmDialogInputModal
    title={'Details'}
    description={DetailsTitle}
    open={showDetailModal}
    width={800}
    hideButtons
    handleClose={() => setShowDetailModal(false)}
  >
    <div>
      {Details.map((value, index) => {
        return <ContentEventDetail delete={deleteEvent} key={"detail-" + index} edit={editEvent} event={value} />
      })}
    </div>
  </ConfirmDialogInputModal>

  const eventModal = <ConfirmDialogInputModal
    title={CurrentEvent && CurrentEvent.id !== null ? 'Edit Event': 'Add New Event'}
    description={'Lorem ipsum dolor sit amet'}
    open={showEventModal}
    width={800}
    hideButtons
    handleClose={() => setShowEventModal(false)}
  >
    <AddEventForm event={CurrentEvent} save={(data) => saveEvent(data)} />
  </ConfirmDialogInputModal>

  const storyModal = <ConfirmDialogInputModal
    title={CurrentEvent ? "Edit Story" : "Add New Story"}
    description={'Lorem ipsum dolor sit amet'}
    open={showStoryModal}
    width={800}
    hideButtons
    handleClose={() => {
      setCurrentEvent(null)
      setShowStoryModal(false)
    }}
  >
    <AddStoryForm event={CurrentEvent} save={(data) => saveStory(data)} />
  </ConfirmDialogInputModal>


  return (
    <DashboardLayout
      loginRequired
      loading={loading}
      searchFunc={getEventsRequest}
    >
      <MDBox display={'flex'} mt={5}>
        <div className={'calendar-left-column'}>
          <CalendarHeader />
          <FullCalendar
            ref={CalendarEl}

            headerToolbar={{
              // start: 'title', // will normally be on the left. if RTL, will be on the right
              end: '',
              start: '',
              center: '',
              // start: 'prev, title,next' // will normally be on the right. if RTL, will be on the left
            }}
            eventColor={"transparent"}
            eventContent={renderEventContent}
            height={CalendarHeight}
            dayHeaderFormat={{
              weekday: 'long'
            }}
            selectable={false}

            dateClick={(arg) => {
              console.log("select", arg)
            }}
            //@ts-ignore
            plugins={[dayGridPlugin, interactionPlugin]}
            eventClick={(arg)=>{
              handleDateClick(arg)
            }}
            events={CalendarEvents}
            initialView="dayGridMonth"
          />
        </div>
        <div className={'calendar-right-column'} >
          <p className={'text-blue all-in-month-title'}>All in {Title}</p>
          <FakeScroll className="scroll-container" track={false} onChange={onFakeScrollChange}>
            {RightEvents.map((value, index) => {
              return renderDayContent(value, index)
            })}
          </FakeScroll>``
        </div>
      </MDBox>
      {createModal}
      {eventDetailModal}
      {eventModal}
      {storyModal}
    </DashboardLayout>
  )
}

export default BlockchainTransactions
