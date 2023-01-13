/**
 =========================================================

 Example for a field named "team"

 ### VALIDATION ###
 Yup.object().shape({
    team: Yup.object().nullable().shape({
      title: Yup.string().required("The team is required")
    })

### PARAMS ###
- initialValue
 initialValue = { title: "", id: null }

- options: [
    {id:1, title:"Team 1"},
    { id:2, title:"Team 2"}
  ]

#### GET DATA FROM BACKEND ###
if you want to search dynamically from backend, yo need to debounce your api call.

import {debounce, Grid, Modal} from "@mui/material";

  const getTeams = (input, q)=>{
    api.getTeams(q).then(response => {
      if(response.kind === "ok"){
        setTeamOptions(response.data.results)
      }
    }).catch(err=>console.log(err))
  }

  const searchTeamDelayed = useMemo(
    () => debounce(getTeams, 500 ),
    [getTeams]
  );


### FIELD ###

 <Field name="team">
    {({field}) => (
          <AutocompleteFormik
            options={TeamOptions}
            labelFieldName={"title"}
            field={field}
            setFieldValue={setFieldValue}
            initialValue={initialValues.team}
            touched={touched}
            errors={errors}
              onInputChange={searchTeamDelayed} // only if you want to get data from backend
            label={"Team"}
          />
        )}
 </Field>

 */

import MDBox from "../MDBox";
import Autocomplete from "@mui/material/Autocomplete";
import MDInput from "../MDInput";
import React from "react";
import TextField from "@mui/material/TextField";
import MDInputAutocomplete from "../MDInputAutocomplete";

export const AutocompleteFormik = (opts) => {
  const {
    onChange,
    options,
    renderInput,
    labelFieldName,
    setFieldValue,
    initialValue,
    isOptionEqualToValue,
    touched,
    field,
    label,
    errors,
    ...params
  } = opts

  return (
    <MDBox>
      <Autocomplete
        {...params}
        id={field.name}
        name={field.name}
        options={options}
        onChange={(e, value) => {
          setFieldValue(field.name, value !== null ? value : initialValue)
          if (onChange) {
            onChange(e, value)
          }
        }}
        defaultValue={initialValue}
        getOptionLabel={option => option[labelFieldName] ?? ""}
        isOptionEqualToValue={isOptionEqualToValue || ((option, value) => true)}
        renderInput={(params) => (
          <MDInputAutocomplete
            type="text"
            label={label}
            variant="outlined"
            name={field.name}
            fullWidth
            onChange={(e) => {
              setFieldValue(field.name, e.target.value)
            }}
            error={touched[field.name] === true && errors[field.name] !== undefined}
            helperText={touched[field.name] === true && errors[field.name] && errors[field.name]}
            {...field}
            {...params}
          />
        )}
      />
    </MDBox>
  )
}

