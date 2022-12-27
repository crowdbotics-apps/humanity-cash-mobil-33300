import MDBox from "../../components/MDBox";
import MDInput from "../../components/MDInput";
import React, {memo, useEffect, useReducer, useState} from "react";
import * as Yup from "yup";
import {Checkbox, FormControlLabel, MenuItem, Radio, RadioGroup, Select, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {repeatEventInitialState, repeatEventReducer} from "./reducers";
import {Day, DAYS} from "./constants";
import {styles} from "./calendar.styles";
import moment from "moment";
import {DesktopTimePicker} from '@mui/x-date-pickers/DesktopTimePicker';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DesktopDatePicker} from '@mui/x-date-pickers';

export const AppointmentValidationSchema = Yup.object().shape({
  client_address: Yup.string().required('This field is a required.'),
  price: Yup.string().required('This field is a required.'),
  date: Yup.string().required('This field is a required.'),
  client_number: Yup.string().required('This field is a required.').min(8, 'Must be longer than 8 digits'),
  team: Yup.object().nullable().shape({
    title: Yup.string().required("The team is required")
  }),
  client: Yup.object().nullable().shape({
    name: Yup.string().required("This field is required")
  }),
  frequency: Yup.object().nullable().shape({
    title: Yup.string().required("This field is required")
  })

})


export const TimeRangeField = memo(({fromTime,
                                 setFromTime,
                                 toTime,
                                 setFieldValue,
                                 touched,
                                 errors,
                                 setToTime})=>{

  return (
    <MDBox style={{display:"flex", flexDirection:"row", alignItems:"center", marginTop:8}}>

      <LocalizationProvider dateAdapter={AdapterDayjs}>

        <DesktopTimePicker
          showToolbar={false}
          InputAdornmentProps={{ position: 'start' }}
          label="From Time"
          value={fromTime}
          onChange={(newValue) => {
            setFromTime(newValue?newValue.$d:null)
            setFieldValue('from_time',  newValue?moment(newValue.$d).format('HH:mm:ss'):null)
          }}
          renderInput={(params) => (
            <TextField style={{width:150, marginLeft:'2px'}}
                       variant={"standard"}
                       error={touched.from_time === true && errors.from_time !== undefined}
                       helperText={touched.from_time === true && errors.from_time && errors.from_time}
                       {...params} />
          )}

        />

        <Typography style={{marginLeft:30, marginRight:30}}>-</Typography>

        <DesktopTimePicker
          showToolbar={false}
          InputAdornmentProps={{ position: 'start' }}
          label="To Time"
          value={toTime}
          onChange={(newValue) => {
            setToTime(newValue?newValue.$d:null)
            setFieldValue('to_time',  newValue?moment(newValue.$d).format('HH:mm:ss'):null)
          }}
          renderInput={(params) => (
            <TextField style={{width:150}}
                       variant={"standard"}
                       error={touched.to_time === true && errors.to_time !== undefined}
                       helperText={touched.to_time === true && errors.to_time && errors.to_time}
                       {...params} />
          )}

        />
      </LocalizationProvider>



    </MDBox>
  )
})
const props2default = (props) => {
    if (! props.repeatConfig){
        return repeatEventInitialState
    }else {
        const c = props.repeatConfig
        const wkds = (c.weekly || c.biweekly)?.weekdays || []
        return {
            biWeekly: !!c.biweekly,
            weekly: !!c.weekly,
            monthly: !!c.monthly,
            daily: !!c.daily,
            monday: wkds.includes(0),
            tuesday: wkds.includes(1),
            wednesday: wkds.includes(2),
            thursday: wkds.includes(3),
            friday: wkds.includes(4),
            saturday: wkds.includes(5),
            sunday: wkds.includes(6),
            noEndCriteria: c.end == null,
            afterEndCriteria: Number.isInteger(c.end),
            endByCriteria: c.end !== null && !Number.isInteger(c.end),
            monthlyRepeat: !!c.monthly?.day,
            monthlyOn: !!c.monthly?.nth_weekday,
            workdays: !c.daily?.space_days,
        }
    }
}

const props2repeatEvery = (props) => {
    if (! props.repeatConfig){
        return 1
    } else {
        const c = props.repeatConfig
        return c.weekly?.space_weeks ||
            c.daily?.space_days ||
            (c.monthly?.nth_weekday ? c.monthly?.nth_weekday[0] : null) ||
            c.monthly?.day ||
            1
    }
}

const props2repeatOcurrences = (props) => Number.isInteger(props.repeatConfig?.end) ? props.repeatConfig?.end : 1
const props2repeatMonths = (props) => props.repeatConfig?.monthly?.space_months || 1
const props2endDate = (props) => (!!props.repeatConfig?.end && !Number.isInteger(props.repeatConfig?.end)) ?
    moment(props.repeatConfig?.end, 'YYYY-MM-DD') :
    moment(new Date()).add('1', 'year')
const props2dayValue = (props) => props.repeatConfig?.monthly?.nth_weekday ? props.repeatConfig?.monthly?.nth_weekday[1] : 0

export const RepeatedEvent = memo((props)=>{
  const [state, dispatchx] = useReducer(repeatEventReducer, props2default(props));
  const {
    weekly,
    biWeekly,
    monthly,
    daily,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
    noEndCriteria,
    afterEndCriteria,
    endByCriteria,
    monthlyRepeat,
    monthlyOn,
    workdays,
  } = state;
  const [RepeatEveryFirst, setRepeatEveryFirst] = useState(props2repeatEvery(props))
  const [RepeatEvery, setRepeatEvery] = useState(props2repeatEvery(props))
  const [RepeatOcurrences, setRepeatOcurrences] = useState(props2repeatOcurrences(props))
  const [RepeatMonths, setRepeatMonths] = useState(props2repeatMonths(props))
  const [EndDate, setEndDate] = useState(props2endDate(props))
  const [DayValue, setDayValue] = useState(DAYS[props2dayValue(props)])

    const dispatch = (x) => {
        dispatchx(x)
    }

  useEffect(() => {
      const config = {}
      if(weekly || biWeekly){
          const weekdays = [monday, tuesday, wednesday, thursday, friday, saturday, sunday].reduce((acc,v,i) => {
              if(v) acc.push(i)
              return acc
          },[])

          if(weekly){
              config.weekly = {space_weeks: parseInt(RepeatEvery), weekdays}
          }else{
              config.biweekly = { weekdays }
          }
      }
      if(daily){
          config.daily = workdays ? {} : {space_days: parseInt(RepeatEvery)}
      }
      if(monthly){
          config.monthly = {
              space_months:parseInt(RepeatMonths)
          }
          if (monthlyOn){
              config.monthly.nth_weekday = [parseInt(RepeatEvery), DAYS.indexOf(DayValue)]
          }else{
              config.monthly.day = parseInt(RepeatEveryFirst)
          }
      }

      config.end = null
      if (afterEndCriteria){
          config.end = parseInt(RepeatOcurrences)
      }
      if(endByCriteria){
          config.end = EndDate.format('YYYY-MM-DD')
      }

      if(props.onRepeatConfigChange){
          props.onRepeatConfigChange(config)
      }
  }, [state, RepeatEvery, RepeatEveryFirst, RepeatOcurrences, RepeatMonths, DayValue, EndDate])

  const RadioButton = ({label, checked, value, width=120})=>{
    return (
      <FormControlLabel
        value={value}
        control={<Radio checked={checked} />}
        style={{display:"flex", flexDirection:"row", width:width, padding:0}}
        label={label && (<Typography style={{fontSize:12, marginLeft:-6}}>{label}</Typography>)}
      />
    )
  }

  const DayCheckbox = ({label, checked, name})=>{
    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={checked} onChange={(e)=>{
            dispatch({ type: name, value:e.target.checked  })
          }} name={name} />
        }
        style={{display:"flex", flexDirection:"row"}}
        label={<Typography style={{fontSize:12}}>{label}</Typography>}
      />
    )
  }

  const handleChange = (e)=>{
    dispatch({ type: e.target.value })
  }

  const MonthlyConfig = (
      <MDBox >
        <MDBox style={styles.monthlyConfigContainer}>
          <Radio
            checked={monthlyRepeat}
            onChange={(e)=>dispatch({type: e.target.value})}

            value="MONTHLY_REPEAT"
            inputProps={{ 'aria-label': 'A' }}
          />
          <Typography style={{fontSize:14}}>Repeat</Typography>
          <MDBox mb={2}  mt={1} style={{width:40, margin:4, textAlign:"center"}}>
            <MDInput
              type="number"
              variant="standard"
              fullWidth
              min={1}
              max={20}
              style={{textAlign:"center", paddingLeft:5}}
              value={RepeatEvery}
              onChange={(e) => {
                const value = e.target.value
                setRepeatEvery(value > 0 ? value : 1)
              }}
            />
          </MDBox>
          <Typography style={{fontSize:14}}>day every </Typography>
          <MDBox mb={2}  mt={1} style={{width:40, margin:4, textAlign:"center"}}>
            <MDInput
              type="number"
              variant="standard"
              fullWidth
              min={1}
              max={20}
              style={{textAlign:"center", paddingLeft:5}}
              value={RepeatMonths}
              onChange={(e) => {
                const value = e.target.value
                setRepeatMonths(value > 0 ? (value < 12 ? value : 12): 1)
              }}
            />
          </MDBox>
          <Typography style={{fontSize:14}}>months </Typography>
        </MDBox>
        <MDBox style={styles.monthlyConfigContainer}>
          <Radio
            checked={monthlyOn}
            onChange={(e)=>dispatch({type: e.target.value})}
            value="MONTHLY_ON"
            inputProps={{ 'aria-label': 'A' }}
          />
          <Typography style={{fontSize:14}}>on</Typography>
          <MDBox mb={2}  mt={1} style={{width:40, margin:4, textAlign:"center"}}>
            <MDInput
              type="number"
              variant="standard"
              fullWidth
              min={1}
              max={20}
              style={{textAlign:"center", paddingLeft:5}}
              value={RepeatEveryFirst}
              onChange={(e) => {
                const value = e.target.value
                setRepeatEveryFirst(value > 0 ? (value < 4 ? value : 4): 1)
              }}
            />
          </MDBox>
          <MDBox mb={2}  mt={1} style={{width:110, margin:4, textAlign:"center"}}>
            <Select
              labelId="demo-simple-select-label"
              id="day-select"
              value={DayValue}
              label="Day"
              onChange={(e)=> setDayValue(e.target.value)}
            >
              {DAYS.map((value)=> <MenuItem value={value}>{value}</MenuItem>)}
            </Select>
          </MDBox>
          <MDBox mb={2}  mt={1} style={{width:40, margin:4, textAlign:"center"}}>
            <MDInput
              type="number"
              variant="standard"
              fullWidth
              min={1}
              max={20}
              style={{textAlign:"center", paddingLeft:5}}
              value={RepeatMonths}
              onChange={(e) => {
                const value = e.target.value
                setRepeatMonths(value > 0 ? value : 1)
              }}
            />
          </MDBox>
          <Typography style={{fontSize:14}}>months </Typography>
        </MDBox>
      </MDBox>
    )

  const EndCriteria = ()=>{
    return (
      <MDBox mb={2}  mt={1} style={styles.endCriteriaContainer}>
        <RadioGroup
          defaultValue={1}
          style={styles.flexRowStart}
          // row
          name="end-criteria-group"
          value={1}
          onChange={(e)=>{
            dispatch({ type: e.target.value })
          }}
        >
          <RadioButton  width={100} label={"No end date"} checked={noEndCriteria} value={'NO_END_CRITERIA'} />
          <RadioButton
            value={'AFTER_END_CRITERIA'}
            checked={afterEndCriteria}
            width={180}
            label={
              <MDBox mb={2}  mt={1} style={styles.noEndCriteria}>
                <Typography style={{fontSize:12}}>After</Typography>
                <MDBox style={{textAlign:"center", width:40}}>
                  <MDInput
                    type="number"
                    variant="standard"
                    fullWidth
                    min={1}
                    max={20}
                    style={{textAlign:"center", paddingLeft:5}}
                    value={RepeatOcurrences}
                    onChange={(e) => {
                      const value = e.target.value
                      setRepeatOcurrences(value > 0 ? value : 1)
                    }}
                  />
                </MDBox>
                <Typography style={{fontSize:12}}>ocurrences</Typography>
              </MDBox>}
          />

          <RadioButton
            checked={endByCriteria}
            value={'END_BY_CRITERIA'}
            label={
              <MDBox mb={2}  mt={1} style={styles.endByCriteria}>
                <Typography style={{fontSize:12}}>End by </Typography>
                <MDBox style={{textAlign:"center", marginLeft:10}}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      label=""
                      inputFormat="MM/DD/YYYY"
                      value={EndDate}
                      minDate={new Date()}
                      InputAdornmentProps={{ position: 'start' }}
                      onChange={(newValue)=>{
                          setEndDate(newValue)
                      }}
                      renderInput={(params) => <TextField style={{width:120, textAlign:"center"}} variant={"standard"} {...params} />}
                    />
                  </LocalizationProvider>
                </MDBox>
              </MDBox>}

          />
          {/*<RadioButton label={"End By"} checked={false} value={'END_BY_CRITERIA'} />*/}
        </RadioGroup>
      </MDBox>
    )
  }

  const WeeklyConfig = (
      <MDBox style={styles.weeklyConfigContainer}>
        <Typography style={{fontSize:14}}>Repeat every</Typography>
        <MDBox mb={2}  mt={1} style={{width:40, margin:4, textAlign:"center"}}>
          <MDInput
            type="number"
            variant="standard"
            fullWidth
            min={1}
            max={20}
            style={{textAlign:"center", paddingLeft:5}}
            value={RepeatEvery}
            onChange={(e) => {
              const value = e.target.value
              setRepeatEvery(value > 0 ? value : 1)
            }}
          />
        </MDBox>
        <Typography style={{fontSize:14}}>week(s) on the following day(s)</Typography>
      </MDBox>)


    const DailyConfig = (
            <MDBox style={styles.dailyConfigContainer}>
                    <RadioGroup
                        defaultValue={!workdays}
                        value={'WORKDAYS'}
                        onChange={handleChange}
                    >
                        <RadioButton
                            label={
                                <MDBox mb={2}  mt={1} style={styles.noEndCriteria}>
                                    <Typography style={{fontSize:12}}>Every</Typography>
                                    <MDBox style={{textAlign:"center", width:40}}>
                                        <MDInput
                                            type="number"
                                            variant="standard"
                                            fullWidth
                                            min={1}
                                            max={20}
                                            style={{textAlign:"center", paddingLeft:5}}
                                            value={RepeatEvery}
                                            onChange={(e) => {
                                                const value = e.target.value
                                                setRepeatEvery(value > 0 ? (value < 29 ? value : 29): 1)
                                            }}
                                        />
                                    </MDBox>
                                    <Typography style={{fontSize:12}}>days</Typography>
                                </MDBox>
                            }
                            value={'SPACE-DAYS'}
                           checked={!workdays}
                        />

                        <RadioButton
                            label={"Every workday"}
                            value={'WORKDAYS'}
                           checked={workdays}
                        />
                    </RadioGroup>
            </MDBox>)

  return (
    <MDBox style={{display:"flex", flexDirection:"column"}} >
      <MDBox style={styles.flexRowStart} >
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue={weekly}
          name="radio-buttons-group"
          value={'BI_WEEKLY'}
          onChange={handleChange}
        >
          <RadioButton
            label={"Weekly"}
            value={'WEEKLY'}
            checked={weekly}
          />

          <RadioButton
            label={"Bi-Weekly"}
            value={'BI_WEEKLY'}
            checked={biWeekly}
          />

          <RadioButton
            label={"Daily"}
            value={'DAILY'}
            checked={daily}
          />

          <RadioButton
            label={"Monthly"}
            value={'MONTHLY'}
            checked={monthly}
          />


        </RadioGroup>
        <MDBox >
          {weekly && WeeklyConfig}
          {monthly && MonthlyConfig}
          {daily && DailyConfig}
          <MDBox style={styles.daysCheckContainer} >
            {(weekly || biWeekly) && (
              <>
                <DayCheckbox checked={monday}
                             name={Day.MONDAY}
                             label={Day.MONDAY} />

                <DayCheckbox checked={tuesday}
                             name={Day.TUESDAY}
                             label={Day.TUESDAY} />

                <DayCheckbox checked={wednesday}
                             name={Day.WEDNESDAY}
                             label={Day.WEDNESDAY} />

                <DayCheckbox checked={thursday}
                             name={Day.THURSDAY}
                             label={Day.THURSDAY} />

                <DayCheckbox checked={friday}
                             name={Day.FRIDAY}
                             label={Day.FRIDAY} />

                <DayCheckbox checked={saturday}
                             name={Day.SATURDAY}
                             label={Day.SATURDAY} />

                <DayCheckbox checked={sunday}
                             name={Day.SUNDAY}
                             label={Day.SUNDAY} />
              </>
            )}

          </MDBox>
        </MDBox>
      </MDBox>
      <EndCriteria />

    </MDBox>
  )

})

