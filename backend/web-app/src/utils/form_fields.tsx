import * as Yup from "yup";
import {ValidationErrorMsg} from "./messages";


type FormFieldProp = {
  required:boolean

};


const charField = ({required}:FormFieldProp)=>{
  let field = Yup.string()
  if(required){
    field = field.required(ValidationErrorMsg.required)
  }
  return field
}

charField.defaultProps = {
  required: false
}

export {charField}
