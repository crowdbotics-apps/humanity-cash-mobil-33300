import React, { useEffect, useState } from 'react';
import { observer } from "mobx-react-lite";
import './Login.css';
import { PageWeb } from "../../components";
import { useNavigate } from "react-router-dom";
import { ROUTES } from '../../constants';
import Select from "react-select";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useStores } from "../../models/root-store/root-store-context";
import { formatData, genericApiError } from "../../helpers";
import logo from '../../assets/images/logo.png'

export const Login: React.FC = observer(() => {
  const navigate = useNavigate();
  const rootStore = useStores()
  const [SOSynthesisProblem, setSOSynthesisProblem] = useState<any>(null)

  const [Loading, setLoading] = useState<boolean>(false)
  const [SynthesisProblemOptions, setSynthesisProblemOptions] = useState<any[]>([])

  const [username, setUserName] = useState<any>('');
  const [password, setPassword] = useState<any>('');

  const handleSubmit = async () => {

    console.log(' TODO ')
  }


  return (
    <PageWeb header={false} >
      <div className="row mhvh100 align-items-center p-0 m-0">
        <div className={"col-12 col-md-8 mx-auto main-container"}>
          <img src={logo} alt={"logo"} className={"logo mt-5 mb-5"} />
          <div className={"card start-form-content-container "}>
            <div className={"card-body"}>
              <div className={"row"}>

                  <div className="login-wrapper">
                  <div className="form-group flex-row bg-none">
                    <h2 className='login-label mt-4'>Log In</h2>
                    <h4 className='login-sub'>Welcome back</h4>
                    </div>

                    <div className="form-group flex-row bg-none">
                      <label htmlFor='username'>Email address or user name</label>
                      <input className='col-12 input-field mb-3' type="text" name="username" onChange={e => setUserName(e.target.value)} />
                      <label htmlFor='password'>Confirm password</label>
                      <input className='col-12 input-field' type="text" name="password" onChange={e => setPassword(e.target.value)} />
                    </div>

                    <div
                      className={"start-problem-button d-flex justify-content-center align-items-center mx-auto mt-4"}
                      onClick={() => handleSubmit()}
                    >
                      {Loading && <><Spinner animation="border" variant="light" size="sm" /><span
                        className={"ms-1"}> Processing...</span></>}
                      {!Loading && <span>Log In</span>}

                    </div>
                  </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </PageWeb>
  );
});

export default Login;
