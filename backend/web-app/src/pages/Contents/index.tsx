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
import {AddEventForm, ContentEventCard, FormExample, HourLine} from "./components";
import {event_list} from "./data";
import AdminPanelContainer from "../../containers";
import {CalendarIcon, StoriesIcon} from "../../components/icons";


const ContentsPage: React.FC = observer(() => {
  const name  = "NAMEEE"
  const { innerWidth: width, innerHeight: height } = window;
  const [CalendarHeight, setCalendarHeight] = useState(height * 0.68)
  const CalendarEl = useRef(null);
  const [Title, setTitle] = useState('')
  const [calendarApi, setCalendarApi] = useState(null)
  const [CalendarEvents, setCalendarEvents] = useState([])
  const [RightEvents, setRightEvents] = useState<any[]>([])
  const [show, setShow] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect( () => {
    // @ts-ignore
    let api = CalendarEl.current.getApi()
    setCalendarApi(api)
    setTitle(api.currentDataManager.data.viewTitle)
    setRightEvents(event_list)
    let eventList:any[]=[]
    for(const data of event_list){
      for (const event of data.events){
        console.log("event", event)
        eventList.push(event)
      }
    }
    console.log(eventList)
    // @ts-ignore
    setCalendarEvents(eventList)

  },[])
  const handleDateClick = (arg:any) => { // bind with an arrow function
    console.log("handledateclick", arg)
  }


  const renderEventContent = (eventInfo:any) => {
    const eventType =  eventInfo.event._def.extendedProps.eventType
    const eventHour =  eventInfo.event._def.extendedProps.hour
    const isOverlaping =  eventInfo.event._def.extendedProps.isOverlapping

    const Overlapping = (event:any)=> (<div className={'dot my-event-overlapped my-event-overlapped-'+eventType} />)
    return (
      <>
        {isOverlaping && (
          <Overlapping event={eventInfo.event} />
        )||(
          <div className={'my-event my-event-'+eventType} >
            <p className={'my-event-title'}>{eventInfo.event.title}</p>
            <p className={'my-event-subtitle'}>{eventHour}</p>
          </div>
        )}
      </>
    )
  }
  const onFakeScrollChange = (scrollRatio:any)=>{
    // console.log("scroll ratio", scrollRatio)
  }

  const next = ()=>{
    // @ts-ignore
    calendarApi.next()
    // @ts-ignore
    setTitle(calendarApi.currentDataManager.data.viewTitle)
  }

  const previous = ()=>{

    // @ts-ignore
    calendarApi.prev()
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
          <Button variant="primary" size="lg" className={'create-btn'}  onClick={handleShow}>
            Create
          </Button>
        </Col>
      </div>
    )
  }

  const PageHeader = ()=>{
    return (<header>
      <Row className={'header-row'}>
        <Col className={'col-9'}>
          <h4 className='title-h4'>Calendar - Events</h4>
        </Col>
        <Col className={'col-3'}>
          <Button variant="primary" className={'btn-connect-social'}
                  size={'lg'} style={{borderRadius:50}}> Connect Social Media </Button>{' '}

          {/*<Button variant="outline-primary" size="lg" className={'create-btn'}>*/}
          {/*  Create*/}
          {/*</Button>*/}
        </Col>
      </Row>
    </header>)
  }

  const renderDayContent = (value:any)=>{
    return (
      <div>
        <div className={'text-gray'} style={{fontSize:12, marginLeft:20}}>{value.title}</div>
        <div style={{marginBottom:20}}>
          {value.events.map((data:any)=>{
            return (
              <div>
                <HourLine hour={data.hour} />
                <ContentEventCard event={data}/>
                <HourLine hour={data.hour} />
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
              selectable={true}

              dateClick={(arg:any)=>{
                console.log("select", arg)
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
            <FakeScroll className="scroll-container" track={false} onChange={onFakeScrollChange}>
              {RightEvents.map(value => {
                return renderDayContent(value)
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
              <div className={'col-modal-create col-modal-left'} >
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
                   }}>
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
              Add New Event
            </div>
            <div className={'create-modal-subtitle text-gray'}>
              Lorem ipsum dolor sit amet
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <Row>
           <AddEventForm/>
          </Row>
        </Modal.Body>
      </Modal>
    </AdminPanelContainer>

  )
})
export default ContentsPage;
