import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material'
import React, { useState } from 'react'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import useAuth from '../../hooks/useAuth'
import useNotification from '../../hooks/useNotification'
import ApiConnection from '../../utils/apiConnection'
import LoginWithGoogle from './LoginWithGoogle'

const LoginDialog = ({ open, handleClose }) => {
  const { setUser } = useAuth()
  const { setErrorMessage, setSuccessMessage } = useNotification()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isRequesting, setIsRequesting] = useState(false)

  const handleLogin = async () => {
    setIsRequesting(true)

    const api = ApiConnection()

    const data = await api.post('users/login/', { username, password })
    if (api.status < 400) {
      setUser(data)
      handleClose()
      setSuccessMessage('Sesión iniciada exitosamente')
    } else setErrorMessage('Credenciales inválidas')
    setIsRequesting(false)
  }

  const closeValidate = () => {
    if (!isRequesting) handleClose()
  }

  const responseGoogle = async (response) => {
    if (response && response.credential) {
      const api = ApiConnection()
      const data = await api.post('/users/google-login/', {
        idToken: response.credential,
      })

      if (api.status < 400) {
        setUser(data)
        handleClose()
        setSuccessMessage('Sesión iniciada exitosamente')
      } else setErrorMessage('Credenciales inválidas')
      setIsRequesting(false)
    }
  }

  return (
    <Dialog open={open} onClose={closeValidate}>
      <ValidatorForm onSubmit={handleLogin}>
        <DialogTitle style={{ textAlign: '-webkit-center' }}>
          <Avatar style={{ marginRight: '0.5rem' }} />
          Iniciar sesión
        </DialogTitle>
        <DialogContent>
          <Grid container justifyContent="center">
            <LoginWithGoogle responseGoogle={responseGoogle} />
          </Grid>
          <TextValidator
            fullWidth
            label={'Nombre de usuario'}
            onChange={(e) => setUsername(e.target.value)}
            name={'username'}
            value={username}
            validators={['required']}
            errorMessages={['El nombre de usuario es requerido']}
          />
          <TextValidator
            fullWidth
            label={'Contraseña'}
            onChange={(e) => setPassword(e.target.value)}
            name={'password'}
            type={'password'}
            value={password}
            validators={['required']}
            errorMessages={['La contraseña es requerida']}
          />
        </DialogContent>
        <DialogActions>
          <Grid container justifyContent="space-between">
            <Button onClick={closeValidate} disabled={isRequesting}>
              Cancelar
            </Button>
            <Button type={'submit'} disabled={isRequesting}>
              Iniciar sesión
            </Button>
          </Grid>
        </DialogActions>
      </ValidatorForm>
    </Dialog>
  )
}

export default LoginDialog
