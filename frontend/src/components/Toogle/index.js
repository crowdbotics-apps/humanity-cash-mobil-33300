import {useState} from "react";
import {Autocomplete, Box, ToggleButton, ToggleButtonGroup} from "@mui/material";
import FormField from "../FormField";

export const FilterToggleButton = (
  label,
  setFilters,
  filterName,
  color,
  data,
  mapping
) => {
  const [value, setValue] = useState('nullValue')

  const handleChange = (event, newValue) => {
    setValue(newValue)
    setFilters(f => ({...f, [filterName]: mapping[newValue]}))
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        columnGap: '5px'
      }}>
      <span style={{
        fontSize: "0.75rem",
        fontWeight: "400",
        color: "#7b809a",
        lineHeight: "0.9",
        margin: "4px"
      }}>{label}</span>
      <ToggleButtonGroup
        size={"small"}
        color={color}
        value={value}
        exclusive
        onChange={handleChange}
        aria-label="acked"
      >
        {data.map((e, i) => <ToggleButton key={i} value={e.value}>{e.label}</ToggleButton>)}
      </ToggleButtonGroup>
    </Box>
  );
}

export const RevisadoFilterToggleButton = ({setFilters}) => {
  return FilterToggleButton(
    'Estado de revisión',
    setFilters,
    'acked',
    'primary',
    [
      {value: "nullValue", label: 'Todos'},
      {value: "trueValue", label: 'Revisados'},
      {value: "falseValue", label: 'No revisados'},
    ],
    {
      nullValue: null,
      trueValue: "true",
      falseValue: "false"
    })
}

export const FilterAutocomplete = ({label, defaultValue, filterKey, setFilters, options}) => {
  const handleChange = (event, index) => {
    if (index !== null) {
      setFilters(f => ({...f, [filterKey]: index}))
    } else {
      setFilters(f => {
          const aux = {...f}
          delete aux[filterKey]
          return aux
        }
      )
    }
  };

  return (<Autocomplete
    onChange={handleChange}
    style={{width: "200px"}}
    defaultValue={defaultValue}
    options={options}
    renderInput={(params) => (
      <FormField {...params} label={label} InputLabelProps={{shrink: true}}/>
    )}
  />)
}

export const FilterEstacionesAutocomplete = ({label, defaultValue, filterKey, setFilters, options}) => {
  const handleChange = (event, label2display) => {
    if (label2display !== null) {
      const value = label2display.split("#")[1]
      setFilters(f => ({...f, [filterKey]: value}))
    } else {
      setFilters(f => {
          const aux = {...f}
          delete aux[filterKey]
          return aux
        }
      )
    }
  };

  const formatedOptions = options.map(opt => {
    const label2display = `${opt.nombre} #${opt.id}`
    return label2display
  })

  return (<Autocomplete
    onChange={handleChange}
    style={{width: "200px"}}
    defaultValue={defaultValue}
    options={formatedOptions}
    renderInput={(params) => (
      <FormField {...params} label={label} InputLabelProps={{shrink: true}}/>
    )}
  />)
}