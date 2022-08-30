import React, {useState} from "react";
import {observer} from "mobx-react-lite";
import '../../theme.css'
import './components.css'
import {ContentEvent} from "./models";
import {ClockIcon, LocationIcon} from '../../components/icons'
import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";

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

export const AddEventForm = ()=> {
  const [validated, setValidated] = useState(false);
  const formik = useFormik({
    initialValues: {
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
    },
    validationSchema: Yup.object({
      startDate: Yup.string()
        .required("Please select a start date"),
      endDate: Yup.string()
        .required("Please select a end date"),
      startTime: Yup.string()
        .required("Please select a start time"),
      endTime: Yup.string()
        .required("Please select a end time")
    }),
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
      // setFormState(values);
    }
  });

  const handleSubmitFormik = (event:any)=>{
    formik.handleSubmit(event)
    console.log(formik.errors)

  }
  const handleSubmit = (event:any) => {

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    console.log(form)

    setValidated(true);
  };

  return (
    <Form noValidate className={'ps-4 pe-4 pb-4'} validated={validated}
          // onSubmit={handleSubmit}
          onSubmit={((event:any) => {
            handleSubmitFormik(event)
          })}
    >
      <Row className="mb-3">

        <Form.Group as={Col} md="6">
          <Form.Label>START DATE</Form.Label>
          <Form.Control
            name="startDate"
            type="date"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={!!formik.errors.startDate}
            value={formik.values.startDate}
          />

          <Form.Control.Feedback type="invalid">
            {formik.errors.startDate}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md="6">
          <Form.Label>END DATE</Form.Label>
          <Form.Control
            name="endDate"
            type="date"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={!!formik.errors.startDate}
            value={formik.values.endDate}
          />

          <Form.Control.Feedback type="invalid">
            {formik.errors.startDate}
          </Form.Control.Feedback>
        </Form.Group>


        <Form.Group as={Col} md="6">
          <Form.Label>START TIME</Form.Label>
          <Form.Control
            name="startTime"
            type="time"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={!!formik.errors.startTime}
            value={formik.values.startTime}
          />

          <Form.Control.Feedback type="invalid">
            {formik.errors.startTime}
          </Form.Control.Feedback>
        </Form.Group>



        <Form.Group as={Col} md="6">
          <Form.Label>START TIME</Form.Label>
          <Form.Control
            name="startTime"
            type="time"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={!!formik.errors.startTime}
            value={formik.values.startTime}
          />

          <Form.Control.Feedback type="invalid">
            {formik.errors.startTime}
          </Form.Control.Feedback>
        </Form.Group>






      </Row>
      <Row className={'mt-5'}>
        <Col className={'md-6 d-flex flex-row  justify-content-center'}>
        <Button  variant="outline-primary" type="button" className={'btn-rounded'}>Add Attachment</Button>

        </Col>
        <Col className={'md-6 d-flex flex-row  justify-content-center'}>
          <Button  type="submit" className={'btn-save'} >Save</Button>
        </Col>

      </Row>

    </Form>
  );
}
