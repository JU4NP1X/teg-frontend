
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import { Fragment, useEffect, useRef, useState } from 'react'
const agrupation1 = [
  { value: 'TO_DAY', label: 'Hoy' },
  { value: '7_DAYS', label: 'Últimos 7 días' },
  { value: 'LAST_30_DAYS', label: 'Últimos 30 días' },
  { value: 'LAST_12_MONTHS', label: 'Últimos 12 meses' },
  { value: 'ALL_YEARS', label: 'Todos los años' },
]
const agrupation2 = [
  { value: '7_DAYS', label: 'Últimos 7 días' },
  { value: 'LAST_30_DAYS', label: 'Últimos 30 días' },
  { value: 'LAST_12_MONTHS', label: 'Últimos 12 meses' },
  { value: 'ALL_YEARS', label: 'Todos los años' },
]
export default function AgrupationSelector({ disabled = false, onChange, withToday = true }) {
  const [agrupation, setAgrupatiion] = useState(withToday ? agrupation1 : agrupation2);
  useEffect(() => onChange(agrupation[0]), [])
  return (
    <Autocomplete
      disableClearable={true}
      sx={{ width: '100% !important', mt:'20px !important'  }}
      onChange={(event, agrupationToUse) => {
        onChange(agrupationToUse)
      }}
      defaultValue={agrupation[0]}
      isOptionEqualToValue={(group, value) => group.value === value.value}
      getOptionLabel={(group) => group.label}
      options={agrupation}
      disabled={disabled}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            variant='standard'
            label={'Agrupación'}
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