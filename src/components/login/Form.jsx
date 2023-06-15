import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import { useState } from 'react'
import { Button } from '@mui/material'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'

const Form = ({ handleSubmit, loading = false }) => {
  const [usrEmail, setUsrEmail] = useState('')
  const [usrPassword, setUsrPassword] = useState('')


  return (
    <Box component='div' sx={{ mt: 1 }}>
      <ValidatorForm
        onSubmit={() => handleSubmit({ usrEmail, usrPassword })}
        onError={(errors) => console.log(errors)}
      >
        <TextValidator
          sx={{ mt: '20px !important', width: '100%' }}
          label='Email'
          name='usrEmail'
          onChange={({ target }) => setUsrEmail(target.value)}
          value={usrEmail}
          validators={['isEmail', 'required']}
          errorMessages={['Ingrese un Email valido', 'Ingrese un Email',]}
        />
        <TextValidator
          sx={{ mt: '20px !important', width: '100%' }}
          label='Contraseña'
          name='usrPassword'
          type='password'
          onChange={({ target }) => setUsrPassword(target.value)}
          value={usrPassword}
          validators={['required', 'minStringLength:8', 'maxStringLength: 20']}
          errorMessages={['Ingrese una contraseña', 'Contraseña muy corta', 'Contraseña muy larga']}
        />
        <Button
          className='btn-primary'
          type='submit'
          fullWidth
          variant='contained'
          disabled={loading}
          sx={{ mt: 2, mb: 2, width: '100%' }}
        >
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </Button>
      </ValidatorForm>
    </Box >
  )
}

export default Form
