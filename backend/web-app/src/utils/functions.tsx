import * as Yup from "yup";
import {ValidationErrorMsg} from "./messages";


export const getErrorMessages = (err:any)=>{
  console.log("error", err)
  let message = ""
  for (let k of Object.keys(err)){
    message +=  err[k].join(". ")
  }
  return message
}

