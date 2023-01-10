import React from "react";
import {observer} from "mobx-react-lite";
import '../../utils/theme.css'
import './components.css'
import {
  AttachmentIcon,
  CalendarIconBlue,
  ClockIcon,
  CloseActionIcon,
  DoneActionIcon,
  EditActionIcon,
  LocationIcon,
  StoryIconGreen
} from '../../assets/svg'
import moment from 'moment'

const getDateTimeFullName = (date)=>{
  return  moment(date).format('dddd, h:mm a  MMMM, YYYY')
}

export const getTitleFormat = (date)=>{
  return moment(date).format('MMMM D, dddd')
}

export  const HourLine = (data)=>{
  return (
    <div className={'hour-line'}>
      <div className={'hour-line-left'} />
      <div className={'text-gray hour-line-middle'}>
        {data.hour}
      </div>
      <div className={'hour-line-right'} />
      <div/>
    </div>

  )
}

export const ContentEventCard = observer((props) => {
  const {event} = props
  const color = (event.eventType === 'story'?'green':'blue')
  const extraClass = 'text-'+color

  return (
    <div className={'event-card border-'+color} >
      {event.img && (
        <img src={event.img} className={'event-card-img'} />
      )}
      <p className={'event-card-title '+extraClass}>{event.title}</p>
      <p className={'event-card-description '}>{event.description}</p>

      <div style={{display:'flex', flexDirection:'row'}} className={'event-card-footer'}>
        <div style={{width:'50%', display:"flex", flexDirection:'row', justifyContent:"center",alignItems:"center"}}>
          <div className={'event-card-footer-icon'}>
            <ClockIcon />
          </div>
          <div style={{marginLeft:10, width:"100%"}}>
            {getDateTimeFullName(event.date)}
          </div>
        </div>
        {event.location && (
          <div style={{width:'50%', display:"flex", flexDirection:'row', justifyContent:"center", alignItems:"center"}}>
            <div className={'event-card-footer-icon'}>
              <LocationIcon />
            </div>
            <div>
              {event.location}
            </div>
          </div>
        )}
      </div>

    </div>
  )
})


export const ContentEventDetail = observer((props) => {
  const {event} = props
  const color = (event.eventType === 'story'?'green':'blue')
  const extraClass = 'text-'+color

  return (
    <div className={' border-orange detail-event-card '}  >

      <div className={' detail-event-card-left'}>
        {event.eventType === "story"
          ? <StoryIconGreen />
          : <CalendarIconBlue />
        }
      </div>
      <div className={' detail-event-card-right'}>
        {event.img && (
          <div className={'detail-event-card-img-container'}>
            <img src={event.img} alt='img' className={'detail-event-card-img'} />
          </div>
        )}

        <div style={{ padding: "15px", width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <p className={'event-card-title '}>{event.title}</p>
            <div className={'action-buttons'}>
              <div className={'action-icon-container action-icon-container-pink'} onClick={() => {
                props.delete(event.id)
              }}>
                <CloseActionIcon />
                <div className={'action-icon-container-child text-pink'}>Delete</div>
              </div>
              {event.eventType === 'event' && (
                <div className={'action-icon-container action-icon-container-green'}>
                  <DoneActionIcon />
                  <div className={'action-icon-container-child text-green'}>Done</div>
                </div>
              )}

              <div className={'action-icon-container  action-icon-container-blue '} onClick={() => {
                props.edit(event)
              }}>
                <EditActionIcon />
                <div className={'action-icon-container-child text-blue'}>Edit</div>

              </div>

            </div>
          </div>
          <p className={'event-card-description '}>{event.description}</p>
          {event.eventType === "event" && (
            <div style={{display:'flex', flexDirection:'row'}} className={'event-card-footer'}>
              <div style={{width:'70%', display:"flex", flexDirection:'row', alignItems:"center"}}>
                <div className={'event-card-footer-icon'}>
                  <ClockIcon />
                </div>
                <div style={{marginLeft:10}}>
                  {getDateTimeFullName(event.date)}
                </div>
              </div>
              {event.location && (
                <div style={{width:'30%', display:"flex", flexDirection:'row', alignItems:"center"}}>
                  <div className={'event-card-footer-icon'}>
                    <LocationIcon />
                  </div>
                  <div>
                    {event.location}
                  </div>
                </div>
              )}

            </div>
          )}

          {event.link && (
            <div style={{display:'flex', flexDirection:'row', alignItems:"center"}} className={'event-card-footer'}>
              <AttachmentIcon />
              <a target={"_blank"} href={event.link} style={{fontSize:14, marginLeft:10}}>{event.link}</a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})




