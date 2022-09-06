import React, {useState} from 'react';
import {observer} from "mobx-react-lite";
import {PageWeb} from "../../components";
import logo from '../../assets/images/logo.png';
import {ForgotPasswordForm, FormContent, LoginForm, ResetForm} from "./components";
import "./Login.css"
import {FORM_CONTENT} from "./constants";


export const LoginPage: React.FC = observer(() => {
    const [content, setContent] = useState(FORM_CONTENT.Login)

   const updateContent = (newContent:FORM_CONTENT)=>{
      setContent(newContent)
   }
    const Content = ()=>{
        if(content === FORM_CONTENT.Login){
            return <LoginForm updateContent={updateContent} />
        }else if(content === FORM_CONTENT.ForgotPassword){
           return <ForgotPasswordForm updateContent={updateContent} />
        }
        return <ResetForm updateContent={updateContent} />
    }

    return (
      <PageWeb header={false}  >
          <div style={{marginTop:50, marginBottom:20}}>
              <img src={logo} alt={"logo"} className={"logo img-fluid"} />
          </div>
          <FormContent>
              <div>
                  <Content />
              </div>
          </FormContent>
      </PageWeb>
    )
})


