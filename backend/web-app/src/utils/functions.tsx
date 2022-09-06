

export const getErrorMessages = (err:any)=>{
  let message = ""
  for (let k of Object.keys(err)){
    message +=  err[k].join(". ")
  }
  return message
}
