import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export function ValoresField({
                               name,
                               label,
                               placeholder,
                               options,
                               fieldValue,
                               displayLabelField,
                               alternativeDisplayLabelField,
                               isConfirmar,
                               setFieldValue,
                               multiple = false
                             }) {
  return (
    <Autocomplete
      multiple={multiple}
      disabled={isConfirmar}
      options={options}
      name={name}
      value={fieldValue}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      onChange={(evt, newValue) => setFieldValue(name, newValue)}
      getOptionLabel={(option) => {
        displayLabelField = option[displayLabelField] ? displayLabelField : alternativeDisplayLabelField
        return option[displayLabelField]
      }}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder}/>
      )}
    />
  );
}