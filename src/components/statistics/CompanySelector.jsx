
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import { Fragment, useEffect, useRef, useState } from 'react'
import ApiConnection from '../../utils/apiConnection'
import useNotification from '../../hooks/useNotification'

export default function CompanySelector({disabled= false, onChange}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [companies, setCompanies] = useState([])
  const [searchName, setSearchName] = useState('')
  const {errorMessage} = useNotification()

  const getCompanies = async () => {
    setLoading(true)
    const Api = ApiConnection()
    const companies = await Api.get('companies/search', {params:{search: searchName, limit: 10}})

    if(Api.status !== 200)
      errorMessage(Api.message)
    else {
      setCompanies(companies)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!open)
      setCompanies([])
    else
        getCompanies()
  }, [open, searchName])

  return (
    <Autocomplete
      sx={{ width: '100% !important', mt:'20px !important'  }}
      open={open} 
      onChange={(event, companyToSearch) => {
        onChange(companyToSearch)
      }}
      onOpen={() => {
        setOpen(true)
      }}
      onClose={() => {
        setOpen(false)
      }}
      isOptionEqualToValue={(company, value) => company.cmpId === value.cmpId}
      getOptionLabel={(company) => company.cmpName}
      options={companies}
      loading={loading}
      disabled = {disabled}
      onInputChange={(params, value)=>{setSearchName(value)}}
      renderInput={(params) => {
        return (
        <TextField
          {...params}
          variant='standard'
          label={'Compañía'}
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