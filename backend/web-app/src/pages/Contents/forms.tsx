import React, {useState} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import {Button, Col, Form, Row} from "react-bootstrap";


export const AddEventForm = ()=> {
  const [validated, setValidated] = useState(false);
  const formik = useFormik({
    initialValues: {
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      location: "",
      description: ""
    },
    validationSchema: Yup.object({
      startDate: Yup.string()
        .required("Please select a start date"),
      endDate: Yup.string()
        .required("Please select a end date"),
      startTime: Yup.string()
        .required("Please select a start time"),
      endTime: Yup.string()
        .required("Please select a end time"),
      description: Yup.string()
        .required("This field is required")
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
    <Form noValidate className={'ps-5 pe-5 pb-5'} validated={validated}
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
            lang={"us-US"}
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


        <Form.Group as={Col} md="6" className={'mt-4'}>
          <Form.Label>START TIME TIME</Form.Label>
          <Form.Control
            name="startTime"
            type="time"
            lang={"us-US"}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={!!formik.errors.startTime}
            value={formik.values.startTime}
          />

          <Form.Control.Feedback type="invalid">
            {formik.errors.startTime}
          </Form.Control.Feedback>
        </Form.Group>



        <Form.Group as={Col} md="6" className={'mt-4'}>
          <Form.Label>END TIME TIME</Form.Label>
          <Form.Control
            name="endTime"
            type="time"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={!!formik.errors.endTime}
            value={formik.values.endTime}
          />

          <Form.Control.Feedback type="invalid">
            {formik.errors.endTime}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md="12" className={'mt-4'}>
          <Form.Label>LOCATION (OPTIONAL)</Form.Label>
          <Form.Control
            name="location"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={!!formik.errors.location}
            value={formik.values.location}
          />
        </Form.Group>

        <Form.Group as={Col} md="12" className={'mt-4'}>
          <Form.Label>DESCRIPTION</Form.Label>
          <Form.Control
            name="description"
            type="text"
            as="textarea"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={!!formik.errors.description}
            value={formik.values.description}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.description}
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





export const AddStoryForm = ()=> {
  const [validated, setValidated] = useState(false);
  const formik = useFormik({
    initialValues: {
      title: "",
      link: "",
      description: ""
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required("This field is required"),
      description: Yup.string()
        .required("This field is required")
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
    <Form noValidate className={'ps-5 pe-5 pb-5'} validated={validated}
      // onSubmit={handleSubmit}
          onSubmit={((event:any) => {
            handleSubmitFormik(event)
          })}
    >
      <Row className="mb-3">

        <Form.Group as={Col} md="12">
          <Form.Label>START DATE</Form.Label>
          <Form.Control
            name="title"
            type="text"
            lang={"us-US"}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={!!formik.errors.title}
            value={formik.values.title}
          />

          <Form.Control.Feedback type="invalid">
            {formik.errors.title}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md="12">
          <Form.Label>LINK (OPTIONAL)</Form.Label>
          <Form.Control
            name="link"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={!!formik.errors.link}
            value={formik.values.link}
          />

          <Form.Control.Feedback type="invalid">
            {formik.errors.link}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md="12" className={'mt-4'}>
          <Form.Label>DESCRIPTION</Form.Label>
          <Form.Control
            name="description"
            type="text"
            as="textarea"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={!!formik.errors.description}
            value={formik.values.description}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.description}
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

