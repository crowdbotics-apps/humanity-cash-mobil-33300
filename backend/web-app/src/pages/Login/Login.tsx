import React from 'react';
import {observer} from "mobx-react-lite";
import {PageWeb} from "../../components";
import logo from '../../assets/images/logo.png';
import "./Login.css"
import FormContent from "../../components/FormContent/FormContent";
import {LoginForm} from "./components";


export const LoginPage: React.FC = observer(() => {


    return (
      <PageWeb header={false}  >
          <div style={{marginTop:30, marginBottom:20}}>
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


