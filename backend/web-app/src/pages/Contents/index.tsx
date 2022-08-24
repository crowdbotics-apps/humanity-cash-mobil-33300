import React, {Fragment, useState} from "react";
import {observer} from "mobx-react-lite";
import {Col, Row} from "react-bootstrap";
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import './Content.css';
import moment from 'moment'




const ContentsPage: React.FC = observer(() => {
  // const navigate = useNavigate();
  // const rootStore = useStores()

  const [LeftOpen, setLeftOpen] = useState<any>(true);
  const [RightOpen, setRightOpen] = useState<any>(true);

  const handleDateClick = (arg:any) => { // bind with an arrow function
    console.log("handledateclick", arg)
    alert(arg.dateStr)
  }



  const renderEventContent = (eventInfo:any) => {
    console.log("eveninfo", eventInfo)
    console.log("evennt", eventInfo.event._def.extendedProps.eventType)
    const eventType =  eventInfo.event._def.extendedProps.eventType
    const eventHour =  eventInfo.event._def.extendedProps.hour
    const isOverlaping =  eventInfo.event._def.extendedProps.isOverlaping

    const Overlapping = (event:any)=>{
      return (
        <div className={'my-event-overlapped my-event-overlapped-'+eventType}>

        </div>
      )
    }

    return (
      <>
        {isOverlaping === true && (
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


  return (
    <Row className={'main-row'}>

      <Col className={'col-9'}>

        <div id='layout' >
          <div className={'calendar-left-column'}>
            <FullCalendar
              headerToolbar={{
                // start: 'title', // will normally be on the left. if RTL, will be on the right
                end:'',
                center: 'title',
                start: 'prev, title,next' // will normally be on the right. if RTL, will be on the left
              }}
              height={"750px"}
              eventColor={"transparent"}
              eventContent={renderEventContent}
              plugins={[ dayGridPlugin ]}
              eventClick={(arg)=>{
                handleDateClick(arg)
              }}
              events={[
                { title: 'event 1', date: '2022-08-01', hour:'10:30AM' , eventType:'event', isOverlaping:false},
                { title: 'event 2', date: '2022-08-02', hour:'10:30AM', eventType:'event' , isOverlaping:true},
                { title: 'event 4', date: '2022-08-02', hour:'10:30AM', eventType:'story', isOverlaping:true},
              ]}
              initialView="dayGridMonth"
              selectable={true}
            />
          </div>
        </div>
      </Col>

      <Col className={'col-3'}>
        <div className={'calendar-right-column'}>
            <p className={'text-blue all-in-month-title'}>All in April 2022</p>
        </div>
      </Col>
    </Row>


  )
})
export default ContentsPage;
