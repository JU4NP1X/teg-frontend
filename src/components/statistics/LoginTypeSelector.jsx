
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import { Fragment, useEffect, useRef, useState } from 'react'
const type = [
  { value: 'all', label: 'Todos' },
  { value: 'desktop', label: 'Escritorio' },
  { value: 'mobile', label: 'Móvil' },
]
export default function LoginTypeSelector({ disabled = false, onChange }) {
  useEffect(() => onChange(type[0]), [])
  return (
    <Autocomplete
      disableClearable={true}
      sx={{ width: '100% !important', mt:'20px !important' }}
      onChange={(event, agrupationToUse) => {
        onChange(agrupationToUse)
      }}
      defaultValue={type[0]}
      isOptionEqualToValue={(group, value) => group.value === value.value}
      getOptionLabel={(group) => group.label}
      options={type}
      disabled={disabled}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            variant='standard'
            label={'Móvil o escritorio'}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <Fragment>
                  {params.InputProps.endAdornment}
                </Fragment>
              ),
            }}
          />
        )
      }}
    />
  )
}