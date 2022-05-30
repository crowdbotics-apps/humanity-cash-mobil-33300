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

  const LoginContent = () => (
    <div className="login-wrapper">
      <div className="form-group flex-row bg-none">
        <h2 className='login-label mt-4'>Log In</h2>
        <h4 className='login-sub'>Welcome back</h4>
      </div>
      <div className="form-group flex-row bg-none">
        <label className='inputlabel' htmlFor='username'>EMAIL ADDRESS OR USER NAME</label>
        <input className='col-12 input-field mb-3' type="text" name="username" onChange={e => setEmail(e.target.value)} />
        <label className='inputlabel' htmlFor='password'>CONFIRM PASSWORD</label>
        <input className='col-12 input-field' type="password" name="password" onChange={e => setPassword(e.target.value)} />
      <p onClick={() => setContent('forgot')} className="forgot-password">Forgot password?</p>
      </div>
      <div
        className={"submit-button d-flex justify-content-center align-items-center mx-auto mt-4"}
        onClick={() => handleSubmit()}
      >
        {Loading && <><Spinner animation="border" variant="light" size="sm" /><span
          className={"ms-1"}> Loading...</span></>}
        {!Loading && <span>Log In</span>}

      </div>
    </div>
  )

  const ForgotContent = () => (
    <div className="login-wrapper">
      <div className="form-group flex-row bg-none">
        <h2 className='login-label mt-4'>Forgot password</h2>
        <h4 className='login-sub'>Input email to recive a password reset link</h4>
      </div>
      <div className="form-group flex-row bg-none">
        <label className='inputlabel' htmlFor='username'>EMAIL ADDRESS</label>
        <input className='col-12 input-field mb-3' type="text" name="username" onChange={e => setEmail(e.target.value)} />
      </div>
      <div
        className={"submit-button d-flex justify-content-center align-items-center mx-auto mt-4"}
        onClick={() => setContent('reset')}
      >
        {Loading && <><Spinner animation="border" variant="light" size="sm" /><span
          className={"ms-1"}> Loading...</span></>}
        {!Loading && <span>Reset</span>}

      </div>
    </div>
  )

  const ResetContent = () => (
    <div className="login-wrapper">
      <div className="form-group flex-row bg-none">
        <h2 className='login-label mt-4'>Reset password</h2>
        <h4 className='login-sub'>Create new password</h4>
      </div>
      <div className="form-group flex-row bg-none">
        <label className='inputlabel' htmlFor='password'>NEW PASSWORD</label>
        <input className='col-12 input-field' type="password" name="password" onChange={e => setPassword(e.target.value)} />
        <label className='inputlabel' htmlFor='password'>CONFIRM NEW PASSWORD</label>
        <input className='col-12 input-field' type="password" name="password" onChange={e => setPassword(e.target.value)} />
      </div>
      <div
        className={"submit-button d-flex justify-content-center align-items-center mx-auto mt-4"}
        onClick={() => resetPassword()}
      >
        {Loading && <><Spinner animation="border" variant="light" size="sm" /><span
          className={"ms-1"}> Loading...</span></>}
        {!Loading && <span>Reset</span>}

      </div>
      <div
        className={"submit-button-outline d-flex justify-content-center align-items-center mx-auto mt-4"}
        onClick={() => setContent('forgot')}
      >
        <span>Back</span>
      </div>
    </div>
  )


  return (
    <PageWeb header={false} >
      <div className="row mhvh100 align-items-center p-0 m-0">
        <div className={"col-12 col-md-8 mx-auto main-container"}>
          <img src={logo} alt={"logo"} className={"logo mt-5 mb-5"} />
          <div className={"card start-form-content-container "}>
            <div className={"card-body"}>
              <div className={"row"}>
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
