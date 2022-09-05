import React, {useState} from 'react';
import {observer} from "mobx-react-lite";
import {PageWeb} from "../../components";
import {useNavigate} from "react-router-dom";
import logo from '../../assets/images/logo.png';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import {useApi} from "../../utils";
import {FormContent, LoginForm} from "./components";
import {useFormik} from "formik";
import * as Yup from "yup";
import "./Login.css"
import {AddStoryForm} from "../Contents/forms";


export const Login: React.FC = observer(() => {
    const [Validated, setValidated] = useState<boolean>(false)

    const formik = useFormik({
        initialValues: {
            title:"",
            password:"",
        },
        validationSchema: Yup.object({
            title: Yup.string()
              .required("This field is required"),
            password: Yup.string()
              .required("This field is required"),
        }),
        onSubmit: values => {

            console.log("DATA", values)
            // setFormState(values);
            // setFormState(values);
        }
    });


    const handleSubmitFormik = (event:any)=>{
        formik.handleSubmit(event)
        console.log(formik.errors)
    }




    return (
      <PageWeb header={false}  >
          <div style={{marginTop:50, marginBottom:20}}>
              <img src={logo} alt={"logo"} className={"logo img-fluid"} />
          </div>
          <FormContent>
              <div>
                  <LoginForm />
              </div>
          </FormContent>

      </PageWeb>
    )
})


