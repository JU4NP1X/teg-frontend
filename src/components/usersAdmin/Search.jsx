import { Button, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react'
import useUsers from '../../hooks/useUsers'


const Search = ({ name, column }) => {
  
  const { setColumn, setValue, value, column:contextColumn, columns, setColumns, setPage, setNewFilter } = useUsers()
  const contextReports = useUsers()


  const [txtValue, setTextValue] = useState(columns[column].length > 0 ? columns[column] : '' )

  const handleSubmit = (event) => {

    event.preventDefault()

    setColumns ((prevData) => ({
      ...prevData,
      [column]: txtValue,
    }))

  }

  const handleChangeSearch = (event) => {
    setTextValue(event.target.value) 

  }


  const clean = () => {
    setColumns ((prevData) => ({
      ...prevData,
      [column]: '',
    }))
    setTextValue('')
    setColumn('')
    setValue('')

  }


  return (
    <Box component='form' onSubmit={handleSubmit} noValidate>
      <TextField
        id='textoFiltro'
        name='textoFiltro'
        value={ txtValue }
        label={`Buscar ${name}`}
        variant='outlined'
        style={{ width: '100%', marginBottom: 8, display: 'block' }}
        onChange={handleChangeSearch}
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