import React, {useState} from 'react';
import {observer} from "mobx-react-lite";
import {PageWeb} from "../../components";
import logo from '../../assets/images/logo.png';
import "./Login.css"
import {FORM_CONTENT} from "./constants";
import FormContent from "../../components/FormContent/FormContent";
import {LoginForm} from "./components";


export const LoginPage: React.FC = observer(() => {
    const [content, setContent] = useState(FORM_CONTENT.Login)

   const updateContent = (newContent:FORM_CONTENT)=>{
      setContent(newContent)
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


