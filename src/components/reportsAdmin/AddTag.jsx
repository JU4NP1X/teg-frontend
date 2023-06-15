import { Button, TextField } from '@mui/material'
import { Box } from '@mui/system'
import SearchIcon from '@mui/icons-material/Search'
import { useState } from 'react'
import useReports from '../../hooks/useReports'


const AddTag = ({showButtonTags,showModalTags,setReportToEdit}) => {


    const [txtValue, setTextValue] = useState('')

    const handleClickAddtag = (e) => {
        e.preventDefault()
        console.log('agg tag', e.target.value)
        showModalTags(false)
        showButtonTags(true)
    }

    const { setColumn } = useReports()
    const handleSubmit = (event) => {
      event.preventDefault()
  
      setColumn(column)
      setValue(txtValue)
    }
  
  
    const clean = () => {
      setTextValue('')
      setColumn('')
      setValue('')
    }
  
    return (
      <Box component='form' onSubmit={handleClickAddtag} noValidate>
        <TextField
          id='textoFiltro'
          name='textoFiltro'
          value={txtValue}
          label={`Buscar ${name}`}
          variant='outlined'
          style={{ width: '100%', marginBottom: 8, display: 'block' }}
          onChange={(event) => setTextValue(event.target.value)}
        />
       
          <Button
           type='submit' 
            /* onClick={handleClickAddtag} */
            className='btn-ok'
            size='small'
            style={{ width: 100 }}
            variant='contained'
          >
            Agregar
          </Button>

      </Box >
    )
};

export default AddTag;
