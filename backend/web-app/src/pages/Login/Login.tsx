import React, { useState } from 'react';
import { observer } from "mobx-react-lite";
import './Login.css';
import { PageWeb } from "../../components";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useStores } from "../../models/root-store/root-store-context";
import { genericApiError } from "../../helpers";
import logo from '../../assets/images/logo.png';
import { ROUTES } from '../../constants';
import Button from 'react-bootstrap/Button';
///grid
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Eyes } from '../../components/icons'

export const Login: React.FC = observer(() => {
    const navigate = useNavigate();
    const rootStore = useStores()

    const [Loading, setLoading] = useState<boolean>(false)

    const [email, setEmail] = useState<any>('');
    const [password, setPassword] = useState<any>('');

    const [Content, setContent] = useState<any>('login');



    const handleSubmit = async () => {
        setLoading(true)
        rootStore.environment.api.login({ email, password }).then((result: any) => {
            setLoading(false)
            if (result.kind === "ok") {
                console.log(' LOGIN SUCESS')
            } else {
                console.log(' ===>>>> ', result)
                toast.warn("LOGIN FAIL", {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        }).catch((error: any) => {
            setLoading(false)
            genericApiError()
        })
    }

    const resetPassword = async () => {
        navigate(ROUTES.DASHBOARD)
    }

    type Props = {
        children: React.ReactNode;
    };

    const FormContent: React.FC<Props> = ({ children }) => (

        <Container>
            <Row className="justify-content-md-center">
                <Col xs md="6" className='background-paper'>
                    <Col xs md="12">
                        {children}
                    </Col>
                </Col>
            </Row >
        </Container>
    )


    const LoginContent = () => (
        <FormContent>
            <Form>
                <Form.Group >
                    <h2 className='title-start-form-primary '>Log In</h2>
                </Form.Group>
                <Form.Group >
                    <h4 className='title-start-form-secondary mb-3'>Welcome back</h4>
                </Form.Group>
                <Form.Group className="mb-3" >
                    <Form.Label className='form-label'>EMAIL ADDRESS OR USER NAME</Form.Label>
                    <Form.Control className='input-large' name="username" onChange={e => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" >
                    <Form.Label className='form-label'>CONFIRM PASSWORD</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control
                            type="password" name="password" className='input-large' onChange={e => setPassword(e.target.value)}
                        />
                        <Button variant="outline-secondary" id="button-addon2" className='eyes-buttons'>
                            <Eyes />
                        </Button>
                    </InputGroup>

                    {/*
                                    < /> */}
                </Form.Group>
                <Form.Group className="mb-3" >
                    <div className="forgot-password">
                        <a href="#" onClick={() => setContent('forgot')} className='link-primary'>Forgot password?</a>
                    </div>

                    {/*  */}
                </Form.Group>
                <Form.Group
                    className="mb-3 text-center"
                    onClick={() => handleSubmit()}
                >

                    {Loading && <><Spinner animation="border" variant="light" size="sm" /><span
                        className={"ms-1"}> Loading...</span></>}
                    {!Loading &&

                        <Button variant="primary" className='button-larg' >Log in</Button>
                    }

                </Form.Group>
            </Form>
        </FormContent>

    )

    const ForgotContent = () => (
        <FormContent>
            <Form>
                <Form.Group >
                    <h2 className='title-start-form-primary '>Forgot password</h2>
                </Form.Group >
                <Form.Group >
                    <h4 className='title-start-form-secondary mb-3'>Input email to recive a password reset link</h4>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label className='form-label'>EMAIL ADDRESS</Form.Label>
                    <Form.Control className='input-large' type="text" name="username" onChange={e => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group
                    className="mb-3 text-center"
                    onClick={() => setContent('reset')}
                >
                    {Loading && <><Spinner animation="border" variant="light" size="sm" /><span
                        className={"ms-1"}> Loading...</span></>}
                    {!Loading && <Button variant="primary" className='button-larg' >Reset</Button>}

                </Form.Group>
            </Form>
        </FormContent>
    )

    const ResetContent = () => (
        <FormContent>
            <Form>
                <Form.Group >
                    <h2 className='title-start-form-primary '>Reset password</h2>
                </Form.Group>
                <Form.Group >
                    <h4 className='title-start-form-secondary mb-3'>Create new password</h4>
                </Form.Group>
                <Form.Group className="mb-3" >
                    <Form.Label className='form-label'>NEW PASSWORD</Form.Label>
                    <Form.Control className='input-large' type="password" name="password" onChange={e => setPassword(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" >
                    <Form.Label className='form-label'>CONFIRM NEW PASSWORD</Form.Label>
                    <Form.Control className='input-large' type="password" name="password" onChange={e => setPassword(e.target.value)} />


                </Form.Group>
                <Form.Group className="mt-5 mb-3">
                    <Container>
                        <Row>
                            <Col> <Button variant="secondary" className='button-larg' >Back</Button></Col>
                            <Col>  {Loading && <><Spinner animation="border" variant="light" size="sm" /><span
                                className={"ms-1"}> Loading...</span></>}
                                {!Loading && <Button variant="primary" className='button-larg' >Reset</Button>}
                            </Col>
                        </Row>
                    </Container>
                </Form.Group>

            </Form>
        </FormContent>
    )


    return (
        <PageWeb header={false} >
            <div >
                <div >
                    <div>
                        <img src={logo} alt={"logo"} className={"logo img-fluid"} />
                    </div>

                    <div >
                        <div>
                            <div >
                                {Content === 'login' && LoginContent()}
                                {Content === 'forgot' && ForgotContent()}
                                {Content === 'reset' && ResetContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageWeb>
    );
});

export default Login;

