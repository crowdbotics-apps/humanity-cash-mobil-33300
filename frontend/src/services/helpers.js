import {useStores} from "../models/root-store/root-store-context";
import {useEffect, useState} from "react";
import Toast from "../components/Toast";
import moment from "moment";
import numeral from "numeral";
import MDBox from "../components/MDBox";
import CheckCircle from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import {createTheme} from "@mui/material/styles";


export function formatDuration(period, maxgroups = 10) {
  let parts = [];
  const duration = moment.duration(period);

  // return nothing when the duration is falsy or not correctly parsed (P0D)
  if (!duration || duration.toISOString() === "P0D") return;

  if (duration.years() >= 1) {
    const years = Math.floor(duration.years());
    parts.push(years + " " + (years > 1 ? "años" : "año"));
  }

  if (duration.months() >= 1) {
    const months = Math.floor(duration.months());
    parts.push(months + " " + (months > 1 ? "meses" : "mes"));
  }

  if (duration.days() >= 1) {
    const days = Math.floor(duration.days());
    parts.push(days + " " + (days > 1 ? "dias" : "dia"));
  }

  if (duration.hours() >= 1) {
    const hours = Math.floor(duration.hours());
    parts.push(hours + " " + (hours > 1 ? "horas" : "hora"));
  }

  if (duration.minutes() >= 1) {
    const minutes = Math.floor(duration.minutes());
    parts.push(minutes + " " + (minutes > 1 ? "minutos" : "minuto"));
  }

  if (duration.seconds() >= 1) {
    const seconds = Math.floor(duration.seconds());
    parts.push(seconds + " " + (seconds > 1 ? "segundos" : "segundo"));
  }

  return parts.slice(0, maxgroups).join(", ");
}

export function formatDurationShort(period, maxgroups = 10, units = undefined) {
  let parts = [];
  const duration = moment.duration(period, units);

  // return nothing when the duration is falsy or not correctly parsed (P0D)
  if (!duration || duration.toISOString() === "P0D") return '-';

  if (duration.years() >= 1) {
    const years = Math.floor(duration.years());
    parts.push(years + "a");
  }

  if (duration.months() >= 1) {
    const months = Math.floor(duration.months());
    parts.push(months + "m");
  }

  if (duration.days() >= 1) {
    const days = Math.floor(duration.days());
    parts.push(days + "d");
  }

  if (duration.hours() >= 1) {
    const hours = Math.floor(duration.hours());
    parts.push(hours + "h");
  }

  if (duration.minutes() >= 1) {
    const minutes = Math.floor(duration.minutes());
    parts.push(minutes + "m");
  }

  if (duration.seconds() >= 1) {
    const seconds = Math.floor(duration.seconds());
    parts.push(seconds + "s");
  }

  return parts.slice(0, maxgroups).join(", ");
}


export const timeout = (prom, time, error = 'Timeout') =>
  Promise.race([prom, new Promise((_r, rej) => setTimeout(rej, time, error))]);


export function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}


export const useMqttApi = () => {
  const rootStore = useStores()

  return rootStore.environment.mqttapi
}

export const useTicker = (interval_ms) => {
  const [ticker, setTicker] = useState(+new Date())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTicker(+new Date())
    }, interval_ms)
    return () => clearInterval(intervalId); //This is important
  }, [])

  return ticker
}

export const showMessage = (error = 'An error occurred while communicating with the server, please try again in a few moments', type = 'error') => {
  Toast.fire({
    icon: type,
    title: error
  })
}

export const APISuccessMessage = (title) => {
  Toast.fire({
    icon: 'success',
    title: title ? title : 'Done.'
  })
}

export const APIErrorMessage = () => {
  Toast.fire({
    icon: 'error',
    title: 'Ocurrió un error.'
  })
}

export const money_fmt = (monto) => {
  return numeral(monto).format('$0,0.00')
}

export const count_fmt = (monto) => {
  return numeral(monto).format('0,0')
}

export const date_fmt = (fecha, formato_opcional) => {
  const mm = moment(fecha);
  return mm.format(formato_opcional ? formato_opcional : 'DD/MM/YYYY - HH:mm')
}

export const useApi = () => {
  const rootStore = useStores()
  return rootStore.environment.api
}

export const useLoginStore = () => {
  const rootStore = useStores()
  return rootStore.loginStore
}

export const renderBooleanIcon = (obj) => {
  if (obj) {
    return (
      <MDBox circular={'true'} variant="gradient" color="success"
             sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <CheckCircle fontSize={'small'}/>
      </MDBox>
    )
  } else {
    return (
      <MDBox circular={'true'} variant="gradient" color="error"
             sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <CancelIcon fontSize={'small'}/>
      </MDBox>
    )
  }
}


export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const truncate = (input, size) => input && input.length > size ? `${input.substring(0, size)}...` : input;

export const getErrorMessages = (err)=>{
  console.log("error", err)
  let message = ""
  for (let k of Object.keys(err)){
    message +=  err[k].join(". ")
  }
  return message
}

export const wrapHash = (txt) =>{
  txt  = truncate(txt, 16)
  const  middle = Math.round(txt.length/2) - 1
  return txt.slice(0, middle) + txt.slice(middle, txt.length)
}

export  const createdColumn = (opts) => {
  return (
    <div>
      <span>{moment(opts.created).format('MMMM DD, YYYY')}</span>
      <br/>
      <span>{moment(opts.created).format('H:mm a').toUpperCase()}</span>
    </div>
  )
}
