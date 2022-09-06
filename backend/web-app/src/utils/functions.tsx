

export const getErrorMessages = (err:any)=>{
  let message = ""
  if (err.non_field_errors){
    message += err.non_field_errors.join(". ")
  }
  for (let k of Object.keys(err)){
    message +=  err[k].join(". ")
  }
  return message
}
