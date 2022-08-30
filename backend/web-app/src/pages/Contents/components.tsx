import React, {useState} from "react";
import {observer} from "mobx-react-lite";
import '../../theme.css'
import './components.css'
import {ContentEvent} from "./models";
import {ClockIcon, LocationIcon} from '../../components/icons'
import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "react-bootstrap/Modal";
import {AddEventForm} from "./forms";

type ContentEventCardProps = {
  event: ContentEvent
}

export  const HourLine = (data: { hour:string })=>{
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

export const ContentEventCard: React.FC<ContentEventCardProps> = observer((props:ContentEventCardProps) => {
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
        <div style={{width:'70%', display:"flex", flexDirection:'row'}}>
          <div className={'event-card-footer-icon'}>
            <ClockIcon />
          </div>
          <div style={{marginLeft:10, width:100}}>
            {event.dateFullName}
          </div>
        </div>
        <div style={{width:'30%', display:"flex", flexDirection:'row'}}>
        <div className={'event-card-footer-icon'}>
            <LocationIcon />
          </div>
          <div>
            {event.location}
          </div>
        </div>
      </div>
    </div>
  )
})

