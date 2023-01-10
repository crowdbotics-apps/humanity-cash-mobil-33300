import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import {Button, Col, Form, Row} from "react-bootstrap";
import {charField} from "../../utils/form_fields";
import {UserGroup, UserRole} from "../../components/Table/constants";
import {ValidationErrorMsg} from "../../utils/messages";

type UserFormProps = {
  save(data:any): any
  user?:any
}


export const AddUserForm = (props:UserFormProps)=> {
  const {user} = props
  const [validated, setValidated] = useState(false);
  const [RoleOptions, setRoleOptions] = useState<any[]>([])

  const formik = useFormik({
    initialValues: {
      name: user?user.name:"",
      email:user?user.email:"",
      group: user?user.group:"",
      role: user?user.role:""
    },
    validationSchema: Yup.object({
      name: Yup.string().required(ValidationErrorMsg.required),
      email: charField({required:true}).email(),
      group: charField({required:true}),
      role: charField({required:true})
    }),
    onSubmit: (data:any) => {
      data['username'] = data.email
      props.save(data)
    }
  });

  useEffect(() => {
    formik.setFieldValue('group', UserGroup.BANK.code)
    setRoleOptions(UserGroup.BANK.roles)
    formik.setFieldValue('role',    UserRole.EMPLOYEE.code)
  },[])

  const handleSubmitFormik = (user:any)=>{
    console.log("user", user)
    formik.handleSubmit(user)
    console.log("errors",formik.errors)
    // setValidated(_.isEmpty(formik.errors));
  }

  const onChangeGroup = (event:any)=>{
    let code = event.target.value
    const group:any = UserGroup
    setRoleOptions(group[code].roles)
    formik.setFieldValue('role', group[code].roles[0].code)

  }
  const SelectOption = (option:{code:string|null, name:string, key: string}, index:number)=>{
    if(option.code){
      return <option value={option.code} key={option.key}>{option.name}</option>
    }
    return <option key={option.key}>{option.name}</option>
  }

  return (
    <Form noValidate className={'ps-5 pe-5 pb-5'}
          validated={validated}
          onSubmit={handleSubmitFormik} >
      <Row className="mb-3">
        <Form.Group as={Col} md="12">
          <Form.Label>USER FULL NAME</Form.Label>
          <Form.Control
            name="name"
            type="text"
            lang={"us-US"}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={!!formik.errors.name  && !!formik.touched.name}
            value={formik.values.name}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.name}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="12" className={'mt-4'}>
          <Form.Label>EMAIL</Form.Label>
          <Form.Control
            name="email"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={!!formik.errors.email  && !!formik.touched.email}
            value={formik.values.email}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.email}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6" className={'mt-4'}>
          <Form.Label>GROUP</Form.Label>
          <Form.Select className={'form-control'}
            // onChange={(event => onChangeGroup(event))}
                      name={'group'}
                       onChange={(event => {
                         onChangeGroup(event)
                         formik.handleChange(event)
                       })}
                       onBlur={formik.handleBlur}
                       isInvalid={!!formik.errors.group  && !!formik.touched.group}
                       value={formik.values.group}
          >
            <SelectOption code={UserGroup.BANK.code} name={UserGroup.BANK.name} key={'bank-option'} />
            <SelectOption code={UserGroup.MANAGER.code} name={UserGroup.MANAGER.name} key={'manager-option'} />
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {formik.errors.group}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6" className={'mt-4'}>
          <Form.Label>ROLE</Form.Label>
          <Form.Select className={'form-control'}
                       name={'role'}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                       isInvalid={!!formik.errors.role && !!formik.touched.role}
                       value={formik.values.role}>
            {RoleOptions.map((value, index) => <SelectOption key={'role-option-'+index} code={value.code} name={value.name}/>)}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {formik.errors.role}
          </Form.Control.Feedback>
        </Form.Group>
      </Row>

      <div className={'mt-5 d-flex flex-row justify-content-center'}>
          <Button  type="submit" className={'btn-save'} >Add</Button>
      </div>
    </Form>
  );
}
