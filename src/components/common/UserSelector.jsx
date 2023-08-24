import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import { Fragment, useEffect, useState } from 'react'
import useNotification from '../../hooks/useNotification'
import ApiConnection from '../../utils/apiConnection'

export default function UserSelector({ disabled = false, onChange }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [searchName, setSearchName] = useState('')
  const { errorMessage } = useNotification()

  const getUsers = async () => {
    setLoading(true)
    const Api = ApiConnection()
    const users = await Api.get('users/search', {
      params: { search: searchName, limit: 10 },
    })

    if (Api.status !== 200) errorMessage(Api.message)
    else {
      setUsers(users)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!open) setUsers([])
    else getUsers()
  }, [open, searchName])

  return (
    <Autocomplete
      sx={{ width: '100% !important', mt: '20px !important' }}
      open={open}
      onChange={(event, userToSearch) => {
        onChange(userToSearch)
      }}
      onOpen={() => {
        setOpen(true)
      }}
      onClose={() => {
        setOpen(false)
      }}
      isOptionEqualToValue={(user, value) => user.usrEmail === value.usrEmail}
      getOptionLabel={(user) => user.usrEmail}
      options={users}
      loading={loading}
      disabled={disabled}
      onInputChange={(params, value) => {
        setSearchName(value)
      }}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            variant={'standard'}
            label={'Usuario'}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <Fragment>
                  {loading ? (
                    <CircularProgress color={'inherit'} size={20} />
                  ) : null}
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
