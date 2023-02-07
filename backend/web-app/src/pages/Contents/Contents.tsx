import React, {Fragment, useEffect, useRef, useState} from "react";
import {observer} from "mobx-react-lite";
import {Button, Col, Row} from "react-bootstrap";
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction'
import Modal from 'react-bootstrap/Modal';

import moment from 'moment'
import '../../assets/fakescroll/fakescroll.css'
import FakeScroll from '../../assets/fakescroll/react.fakescroll.js'
import './Content.css';
import {ContentEventCard, ContentEventDetail, getTitleFormat, HourLine} from "./components";
import {event_list} from "./data";
import AdminPanelContainer from "../../containers";
import {CalendarIcon, StoriesIcon} from "../../components/icons";
import {AddEventForm, AddStoryForm} from "./forms";
import {ContentEvent, EVENT_TYPE} from "./models";
import {useApi} from "../../utils";
import {ROUTES} from "../../constants";
import {toast} from "react-toastify";
import {getErrorMessages} from "../../utils/functions";
import {genericApiError} from "../../helpers";
import {useNavigate} from "react-router-dom";

const getHourFormatted = (date:string)=>{
  return moment(date).format('HH a').toUpperCase()
}

const getDateRange = (dateRange?:{start:string, end:string}|null)=>{
  if(dateRange === null || dateRange === undefined){
    return {
      start:moment().startOf('month').format(),
      end: moment().endOf('month').format()
    }
  }
  return {
    start:moment(dateRange.start).add(1, 'days').startOf('month').format(),
    end: moment(dateRange.end).endOf('month').format()
  }
}

const ContentsPage: React.FC = observer(() => {
  const { innerWidth: width, innerHeight: height } = window;
  const [CalendarHeight, setCalendarHeight] = useState(height * 0.7)
  const CalendarEl = useRef(null);
  const [Title, setTitle] = useState('')
  const [calendarApi, setCalendarApi] = useState(null)
  const [CalendarEvents, setCalendarEvents] = useState<any>([])
  const [RightEvents, setRightEvents] = useState<any[]>([])
  const [AllEvents, setAllEvents] = useState<any[]>([])
  const [show, setShow] = useState(false);
  const [Loading, setLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const  [Details, setDetails] = useState<any[]>([])
  const  [DetailsTitle, setDetailsTitle] = useState<string>("")
  const [CurrentEvent, setCurrentEvent] = useState<ContentEvent| null>(null)
  const [DateRange, setDateRange] = useState<{start:string, end:string}|null>(getDateRange())
  const api = useApi()
  const navigate = useNavigate()
  const handleShow = () => setShow(true);

  const initCalendar = ()=>{
    // @ts-ignore
    let api = CalendarEl.current.getApi()
    setCalendarApi(api)
    setTitle(api.currentDataManager.data.viewTitle)
    setRightEvents(event_list)
  }

  useEffect( () => {
    initCalendar()
  },[])

  useEffect(() => {
    getEvents()
  }, [DateRange])

  const handleDateClick = (arg:any) => { // bind with an arrow function
    setDetails(event_list[0].events)
    let target = arg.el.closest(".fc-daygrid-day")
    let selectedDay:string = ''
    selectedDay = target.querySelector('.fc-daygrid-day-number').firstChild.textContent
    setDetails(CalendarEvents.filter((value:any)=> moment(value.date).format('D') === selectedDay))
    setShowDetailModal(true)
  }

  const groupEvents = (eventList:any[])=>{
    let data = {}
    let allEvents = []
    let calendarEvents = []
    for (const event of eventList){
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
      if(Object.keys(data).indexOf(aux_date) === -1){
        // @ts-ignore
        data[aux_date] = {title:event.start_date, events:[newEvent] }
      }else{
        // @ts-ignore
        data[aux_date].events.push(newEvent)
      }
    }

    let rightEvents = []
    for(let k of Object.keys(data) ){
      // @ts-ignore
      if(data[k].events.length > 1){
        // @ts-ignore
        for(let event of data[k].events){
          event.isOverlapping = true
          calendarEvents.push(event)
        }
      }else{
        // @ts-ignore
        data[k].events[0].isOverlapping = false
        // @ts-ignore
        calendarEvents.push( data[k].events[0])
      }
      // @ts-ignore
      rightEvents.push(data[k])

    }
    setAllEvents(allEvents)
    setRightEvents(rightEvents)
    setCalendarEvents(calendarEvents)
    setLoading(false)
  }
  const getEvents = ()=>{
    setLoading(true)
    api.getEvents(getDateRange(DateRange)).then((response: any) => {
      if (response.kind === "ok") {
        groupEvents(response.data.results)
      }
    }).catch((error: any) => {
      genericApiError()
    })
  }


  const deleteEvent = (id: number)=>{
    setLoading(true)
    api.deleteEvent(id).then((response: any) => {
      if (response.kind === "not-found") {
        
        toast.error("Object not found", {
          position: toast.POSITION.TOP_CENTER
        });
      } else {
        setLoading(false)
        getEvents()
        toast.success('Deleted successfully', {
          position: toast.POSITION.TOP_CENTER
        });
        setDetails(Details.filter(value => value.id !== id))
        setShowStoryModal(false)
      }
    }).catch((error: any) => {
      genericApiError()
    })
  }




  const renderEventContent = (eventInfo:any) => {
    const eventType =  eventInfo.event._def.extendedProps.eventType
    const eventHour =  moment(eventInfo.event._def.extendedProps.startDate).format("hh:mm A")

    const isOverlaping =  eventInfo.event._def.extendedProps.isOverlapping

    const Overlapping = (event:any)=> (<div className={'dot my-event-overlapped my-event-overlapped-'+eventType} />)
    return (
      <>
        {isOverlaping && (
          <Overlapping event={eventInfo.event} />
        ) || (
          <div className={'my-event my-event-'+eventType} >
            <h5 className={'my-event-title'}>{eventInfo.event.title.slice(0,12) }</h5>
            <h5 className={'my-event-subtitle'}>{eventHour}</h5>
          </div>
        )}
      </>
    )
  }
  const onFakeScrollChange = (scrollRatio:any)=>{
    
  }

  const patchEvent = (event:any)=>{
    api.editEvent(event.id, event).then((result: any) => {
      
      if (result.kind === "ok") {

        toast.success("Created successfully.", {
          position: toast.POSITION.TOP_CENTER
        });
        setDetails(Details.map(value => value.id === event.id?event:value))
        getEvents()
        setShowStoryModal(false)
      } else {
        toast.error(getErrorMessages(result.errors), {
          position: toast.POSITION.TOP_CENTER
        });
      }
    }).catch((error: any) => {
      genericApiError()
    })
  }

  const createEvent = (event:any)=>{
    api.createEvent(event).then((result: any) => {
      
      if (result.kind === "ok") {
        toast.success("Saved successfully.", {
          position: toast.POSITION.TOP_CENTER
        });
        getEvents()
        setShowStoryModal(false)
      } else {
        toast.error(getErrorMessages(result.errors), {
          position: toast.POSITION.TOP_CENTER
        });
      }
    }).catch((error: any) => {
      genericApiError()
    })
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
    
    if(data.id){
      patchEvent(event)
    }else{
      createEvent(event)
    }
  }

  const saveEvent = (data:any)=>{
    
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
    
    if(data.id){
      patchEvent(event)
    }else{
      createEvent(event)
    }
    setShowEventModal(false)
  }


  const editEvent = (event:any)=>{
    
    setCurrentEvent(event)
    // setShowDetailModal(false)
    if(event.eventType === EVENT_TYPE.Story){
      setShowStoryModal(true)
    }else{
      setShowEventModal(true)
    }
  }



  const next = ()=>{
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

  const previous = ()=>{
    setCalendarEvents([])
    // @ts-ignore
    calendarApi.prev()
    // @ts-ignore
    let current = calendarApi.currentDataManager.data.dateProfile.currentRange
    setDateRange(current)
    // @ts-ignore
    setTitle(calendarApi.currentDataManager.data.viewTitle)
  }
  const CalendarHeader = ()=>{
    return (
      <div className={'calendar-header'}>
        <Col className={'col-4'}>
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
            <span className="fc-icon fc-icon-chevron-right"/></button>
        </Col>
        <Col className={'col-4 calendar-header'}>
          <div className={'dot my-event-overlapped-story'} />
          <div style={{marginLeft:15, fontSize:15}} className={'text-gray'}>EVENTS</div>
          <div  style={{marginLeft:35}} className={'dot my-event-overlapped-event'} />
          <div  style={{marginLeft:15, fontSize:15}}  className={'text-gray'}>STORIES </div>
        </Col>
        <Col className={'col-4'}>
          <Button variant="primary"  className={'create-btn'}  onClick={handleShow}>
            Create
          </Button>
        </Col>
      </div>
    )
  }

  const PageHeader = ()=>{
    return (<header>
      <div className={'header-row'}>
        <h4 className='title-h4 pt-3 mb-0  pb-3'>Calendar - Events</h4>
        <Button variant="primary" className={'btn-connect-social me-4'}
                onClick={()=>{
                  navigate(ROUTES.SOCIAL)
                }}
                style={{borderRadius:50}}> Connect Social Media </Button>{' '}
      </div>
    </header>)
  }

  const renderDayContent = (value:any, index:number)=>{
    return (
      <div
        key={'day-content-'+index}
        onClick={()=>{
          setDetails(value.events)
          setDetailsTitle(getTitleFormat(value.title))
          setShowDetailModal(true)
          
        }}>
        <div className={'text-gray'} style={{fontSize:12, marginLeft:20}}>{getTitleFormat(value.title)}</div>
        <div style={{marginBottom:20}}>
          {value.events.map((data:any, index:number)=>{
            return (
              <div key={index}>
                <HourLine hour={getHourFormatted(data.date)} />
                <ContentEventCard event={data}/>
                <HourLine  hour={getHourFormatted(data.date)} />
              </div>)
          })}
        </div>
      </div>
    )
  }

  // @ts-ignore
  // @ts-ignore
  return (
    <AdminPanelContainer title={"Calendar - Events"} header={<PageHeader />}>
      <Row className={'main-row'}>
        <Col className={'col-9 calendar-content'}>
          <div className={'calendar-left-column'}>
            <CalendarHeader/>
            <FullCalendar
              ref={CalendarEl}

              headerToolbar={{
                // start: 'title', // will normally be on the left. if RTL, will be on the right
                end:'',
                start:'',
                center: '',
                // start: 'prev, title,next' // will normally be on the right. if RTL, will be on the left
              }}
              eventColor={"transparent"}
              eventContent={renderEventContent}
              height={CalendarHeight}
              dayHeaderFormat={{
                weekday:'long'
              }}
              selectable={false}


              dateClick={(arg:any)=>{
                
              }}
              //@ts-ignore
              plugins={[  dayGridPlugin, interactionPlugin ]}
              eventClick={(arg)=>{
                handleDateClick(arg)
              }}
              events={CalendarEvents}
              initialView="dayGridMonth"
            />
          </div>
        </Col>

        <Col className={'col-3 '} style={{zIndex:0, marginLeft:-24}}>
          <div className={'calendar-right-column'} >
            <p className={'text-blue all-in-month-title'}>All in {Title}</p>
            <FakeScroll className="scroll-container"   track={false} onChange={onFakeScrollChange}>
              {RightEvents.map((value, index) => {
                return renderDayContent(value, index)
              })}
            </FakeScroll>
          </div>
        </Col>
      </Row>

      <Modal
        size="lg"
        show={show}
        centered
        onHide={() => setShow(false)}
      >
        <Modal.Header closeButton style={{paddingTop:30, paddingLeft:50, paddingRight:50}}>
          <Modal.Title>
            <div className={'create-modal-title'}>
              Create
            </div>
            <div className={'create-modal-subtitle text-gray'}>
              Lorem ipsum dolor sit amet
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <Row>
            <Col className={'col-6'}>
              <div className={'col-modal-create col-modal-left'}
                   onClick={event => {
                     setShow(false)
                     setShowStoryModal(true)
                   }}>
                <div>
                  <StoriesIcon />
                </div>
                <div  className={'text-blue'} style={{fontSize:34, marginLeft:10, fontWeight:500}}>
                  Story
                </div>
              </div>
            </Col>
            <Col className={'col-6'}>
              <div className={'col-modal-create col-modal-right'}
                   onClick={event => {
                     setShow(false)
                     setShowEventModal(true)
                   }}
              >
                <div>
                  <CalendarIcon />
                </div>
                <div  className={'text-blue'} style={{fontSize:34, marginLeft:10, fontWeight:500}}>
                  Event
                </div>
              </div>
            </Col>

          </Row>
        </Modal.Body>
      </Modal>


      <Modal
        size="lg"
        show={showEventModal}
        centered
        onHide={() => setShowEventModal(false)}
      >
        <Modal.Header closeButton style={{paddingTop:30, paddingLeft:50, paddingRight:50}}>
          <Modal.Title>
            <div className={'create-modal-title'}>
              {CurrentEvent && CurrentEvent.id !== null ? 'Edit Event': 'Add New Event'}
            </div>
            <div className={'create-modal-subtitle text-gray'}>
              Lorem ipsum dolor sit amet
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <Row>
            <AddEventForm event={CurrentEvent} save={(data:any)=>saveEvent(data)}/>
          </Row>
        </Modal.Body>
      </Modal>


      <Modal
        size="lg"
        show={showStoryModal}
        centered
        onHide={() => {
          setCurrentEvent(null)
          setShowStoryModal(false)
        }}
      >
        <Modal.Header closeButton style={{paddingTop:30, paddingLeft:50, paddingRight:50}}>
          <Modal.Title>
            <div className={'create-modal-title'}>
              {CurrentEvent?"Edit Story":"Add New Story"}

            </div>
            <div className={'create-modal-subtitle text-gray'}>
              Lorem ipsum dolor sit amet
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <Row>
            <AddStoryForm event={CurrentEvent} save={(data:any)=>saveStory(data)}/>
          </Row>
        </Modal.Body>
      </Modal>



      <Modal
        size="lg"
        show={showDetailModal}
        centered
        onHide={() => setShowDetailModal(false)}
      >
        <Modal.Header closeButton style={{paddingTop:30, paddingLeft:50, paddingRight:50}}>
          <Modal.Title>
            <div className={'create-modal-title'}>
              Details
            </div>
            <div className={'create-modal-subtitle text-gray'}>
              {DetailsTitle}
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <div>
            {Details.map((value:any, index:number) => {
              return <ContentEventDetail delete={deleteEvent} key={"detail-"+index} edit={editEvent}  event={value}/>
            })}

          </div>
        </Modal.Body>
      </Modal>
    </AdminPanelContainer>

  )
})
export default ContentsPage;
