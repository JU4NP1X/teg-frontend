
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import { Fragment, useEffect, useRef, useState } from 'react'
import ApiConnection from '../../utils/apiConnection'
import useNotification from '../../hooks/useNotification'

export default function ReportSelector({disabled= false, onChange}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [reports, setReports] = useState([])
  const [searchName, setSearchName] = useState('')
  const {errorMessage} = useNotification()

  const getReports = async () => {
    setLoading(true)
    const Api = ApiConnection()
    const reports = await Api.get('reports/search', {params:{search: searchName, limit: 10}})

    if(Api.status !== 200)
      errorMessage(Api.message)
    else {
      setReports(reports)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!open)
      setReports([])
    else
        getReports()
  }, [open, searchName])

  return (
    <Autocomplete
      sx={{ width: '100% !important', mt:'20px !important'  }}
      open={open} 
      onChange={(event, reportToSearch) => {
        onChange(reportToSearch)
      }}
      onOpen={() => {
        setOpen(true)
      }}
      onClose={() => {
        setOpen(false)
      }}
      isOptionEqualToValue={(report, value) => report.repId === value.repId}
      getOptionLabel={(report) => report.repName}
      options={reports}
      loading={loading}
      disabled = {disabled}
      onInputChange={(params, value)=>{setSearchName(value)}}
      renderInput={(params) => {
        return (
        <TextField
          {...params}
          variant='standard'
          label={'Reporte'}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {loading ? <CircularProgress color='inherit' size={20} /> : null}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
        />
      )}}
    />
  )
}