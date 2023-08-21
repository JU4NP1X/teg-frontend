import {
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
import ApiConnection from '../../utils/apiConnection'
import LoginWithGoogle from './LoginWithGoogle'

const LoginDialog = ({ open, handleClose }) => {
  const { setUser } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isRequesting, setIsRequesting] = useState(false)

  const handleLogin = async () => {
    setIsRequesting(true)

    const api = ApiConnection()

    const data = await api.post('users/login/', { username, password })
    setUser(data)
    setIsRequesting(false)
    handleClose()
  }

  const closeValidarte = () => {
    if (!isRequesting) handleClose()
  }

  const responseGoogle = async (response) => {
    if (response && response.credential) {
      const api = ApiConnection()
      const user = await api.post('/users/login/google/', {
        token: response.credential,
      })

      if (api.status === 200) setUser(user)
      else setErrorMessage('Error al autenticar')
    }
  }

  return (
    <Dialog open={open} onClose={closeValidarte}>
      <DialogTitle>Iniciar sesión</DialogTitle>
      <ValidatorForm onSubmit={handleLogin}>
        <DialogContent>
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

        <Grid container style={{ placeContent: 'center' }}>
          <LoginWithGoogle responseGoogle={responseGoogle} />
        </Grid>
        <DialogActions>
          <Button onClick={closeValidarte} disabled={isRequesting}>
            Cancelar
          </Button>
          <Button type={'submit'} disabled={isRequesting}>
            Iniciar sesión
          </Button>
        </DialogActions>
      </ValidatorForm>
    </Dialog>
  )
}

export default LoginDialog
