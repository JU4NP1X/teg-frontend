import { Component } from 'react'
import React from 'react'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import LockIcon from '@mui/icons-material/Lock'
import { CardActions } from '@mui/material'
import useNotification from '../../hooks/useNotification'
import ApiConnection from '../../utils/apiConnection'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useEffect } from 'react'
const passwordsTemplate = {
  usrPassword: '',
  newUsrPassword: '',
  confirmNewUsrPassword: '',
}
const ChangePasswordForm = () => {
  const { setSuccessMessage, setErrorMessage } = useNotification()
  const [usrPasswords, setUsrPasswords] = useState({ ...passwordsTemplate })

  const handleChange = (event) => {
    setUsrPasswords((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async () => {
    const Api = ApiConnection()
    await Api.patch('users', { ...usrPasswords })
    if (Api.status === 200) {
      setSuccessMessage(Api.message)
      setUsrPasswords({ ...passwordsTemplate })
    } else {
      setErrorMessage(Api.message)
    }
  }

  const validatePasswordMatch = (value) => value === usrPasswords.newUsrPassword

  useEffect(() => {
    ValidatorForm.addValidationRule('isPasswordMatch', validatePasswordMatch)
  }, [usrPasswords])


  useEffect(() =>
    console.log(usrPasswords), [usrPasswords])

  return (
    <Card sx={{ mx: 'auto', mt: '40px !important', width: 400 }}>
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>
          Cambiar contraseña
        </Typography>
        <ValidatorForm className='formValidator' onSubmit={handleSubmit}>
          <TextValidator
            fullWidth
            className='TextValidator'
            label='Introduce tu contraseña'
            type='password'
            name='usrPassword'
            value={usrPasswords.usrPassword}
            onChange={handleChange}
            validators={['required']}
            errorMessages={['Este campo es requerido']}
          />
          <TextValidator
            label='Nueva contraseña'
            onChange={handleChange}
            name='newUsrPassword'
            value={usrPasswords.newUsrPassword}
            validators={['required', 'minStringLength:8']}
            errorMessages={['Este campo es requerido', 'La contraseña debe tener al menos 8 caracteres']}
            fullWidth
            margin='normal'
            type='password'
          />
          <TextValidator
            label='Confirmar nueva contraseña'
            onChange={handleChange}
            name='confirmNewUsrPassword'
            value={usrPasswords.confirmNewUsrPassword}
            validators={['required', 'isPasswordMatch']}
            errorMessages={['Este campo es requerido', 'Las contraseñas no coinciden']}
            fullWidth
            margin='normal'
            type='password'
          />
          <CardActions>
            <Button className='btn-ok' sx={{ width: '100%' }} variant='contained' type='submit'>Cambiar la contraseña</Button>
          </CardActions>
        </ValidatorForm>
      </CardContent>
    </Card>
  )
}


export default ChangePasswordForm