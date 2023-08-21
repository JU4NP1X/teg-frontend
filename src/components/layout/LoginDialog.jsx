import React, { useState } from 'react'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import ApiConnection from '../../utils/apiConnection'
import Session from '../../utils/session'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'

const LoginDialog = ({ open, handleClose, setUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isRequesting, setIsRequesting] = useState(false)

  const handleLogin = async () => {
    setIsRequesting(true)

    const api = ApiConnection()

    const data = await api.post('users/login/', { username, password })
    Session.set(data)
    setUser(data)
    setIsRequesting(false)
    handleClose()
  }

  const closeValidarte = () => {
    if (!isRequesting) handleClose()
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
