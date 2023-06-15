import { Button, TextField } from '@mui/material'
import { Box } from '@mui/system'
import SearchIcon from '@mui/icons-material/Search'
import { useState } from 'react'
import useRoles from '../../hooks/useRoles'

const Search = ({ name, column }) => {
  const [txtValue, setTextValue] = useState('')

  const { setColumn, setValue, value } = useRoles()
  const handleSubmit = (event) => {
    event.preventDefault()
    console.log({ column, txtValue })
    setColumn(column)
    setValue(txtValue)
  }


  const clean = () => {
    setTextValue('')
    setColumn('')
    setValue('')
  }
  
  return (
    <Box component='form' onSubmit={handleSubmit} noValidate>
      <TextField
        name='filter'
        value={column === useRoles().column ? value : txtValue}
        label={`Buscars ${name}`}
        variant='outlined'
        style={{ width: '100%', marginBottom: 8, display: 'block' }}
        onChange={(event) => setTextValue(event.target.value)}
      />
      <div style={{ display: 'flex' }} >
        <Button
          type='submit'
          className='btn-ok'
          size='small'
          style={{ width: 90 }}
          variant='contained'
        >
          Buscar
        </Button>
        <Button
          style={{ marginLeft: 'auto', width: 90 }}
          size='small'
          variant='contained'
          onClick={clean}
        >
          Limpiar
        </Button>
      </div>
    </Box >
  )
}

export default Search