import React, {useState} from "react";
import {observer} from "mobx-react-lite";
import '../../theme.css'
import './components.css'
import {ContentEvent} from "./models";
import {ClockIcon, LocationIcon} from '../../components/icons'
import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";

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


export const FormExample = ()=> {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event:any) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>First name</Form.Label>
          < Form.Control
            required
            type="text"
            placeholder="First name"
            defaultValue="Mark"
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustom02">
          <Form.Label>Last name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Last name"
            defaultValue="Otto"
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustomUsername">
          <Form.Label>Username</Form.Label>
          <InputGroup hasValidation>
            <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Username"
              aria-describedby="inputGroupPrepend"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please choose a username.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="validationCustom03">
          <Form.Label>City</Form.Label>
          <Form.Control type="text" placeholder="City" required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid city.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="3" controlId="validationCustom04">
          <Form.Label>State</Form.Label>
          <Form.Control type="text" placeholder="State" required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid state.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="3" controlId="validationCustom05">
          <Form.Label>Zip</Form.Label>
          <Form.Control type="text" placeholder="Zip" required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid zip.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Form.Group className="mb-3">
        <Form.Check
          required
          label="Agree to terms and conditions"
          feedback="You must agree before submitting."
          feedbackType="invalid"
        />
      </Form.Group>
      <Button type="submit">Submit form</Button>
    </Form>
  );
}
