import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import useAuth from '../hooks/useAuth'
import useNotification from '../hooks/useNotification'
import ApiConnection from '../utils/apiConnection'

const Profile = () => {
  const { user, setUser } = useAuth()
  const [userInfo, setUserInfo] = useState(user)
  const { setSuccessMessage, setErrorMessage } = useNotification()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleNameChange = (event) => {
    setUserInfo({ ...userInfo, firstName: event.target.value })
  }

  const handleLastNameChange = (event) => {
    setUserInfo({ ...userInfo, lastName: event.target.value })
  }

  const handleEmailChange = (event) => {
    setUserInfo({ ...userInfo, email: event.target.value })
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value)
  }

  const handleSave = async () => {
    setLoading(true)
    const api = ApiConnection()
    const userUpdated = await api.patch(`/users/list/${userInfo.id}/`, {
      email: userInfo.email,
      first_name: userInfo.firstName,
      last_name: userInfo.lastName,
    })
    setUserInfo(userUpdated)
    setUser({ ...userUpdated, token: user.token })
    if (api.status === 200) setSuccessMessage('Usuario modificado exitosamente')
    else setErrorMessage('Error al modificar usuario, intente más tarde.')
    setLoading(false)
  }

  const handleChangePassword = async () => {
    setLoading(true)
    const api = ApiConnection()
    await api.patch(`/users/list/${userInfo.id}/`, {
      password,
    })
    if (api.status === 200) {
      setSuccessMessage('Contraseña cambiada exitosamente')
      setPassword('')
      setConfirmPassword('')
    } else setErrorMessage('Error al cambiar contraseña, intente más tarde.')
    setLoading(false)
  }

  const handleGetUser = async () => {
    const api = ApiConnection()
    const currentUser = await api.get(`/users/list/${user.id}/`)
    if (api.status === 200) {
      setUser({ ...currentUser, token: user.token })
      setUserInfo(currentUser)
    } else setErrorMessage('Error al traer información del usuario.')
  }

  useEffect(() => {
    handleGetUser()
  }, [])

  return (
    <Grid container sx={{ height: 'calc(100vh - 70px)' }}>
      <Grid item xs={0} md={4} />
      <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
        <Grid container spacing={4} sx={{ marginTop: 'auto' }}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title={'Modificar datos'} />
              <CardContent>
                <ValidatorForm onSubmit={handleSave}>
                  <TextValidator
                    label={'Nombre'}
                    fullWidth
                    value={userInfo.firstName}
                    onChange={handleNameChange}
                    validators={['required']}
                    errorMessages={['Este campo es requerido']}
                    InputLabelProps={{
                      shrink: userInfo.firstName !== '',
                    }}
                  />
                  <TextValidator
                    label={'Apellido'}
                    fullWidth
                    value={userInfo.lastName}
                    onChange={handleLastNameChange}
                    validators={['required']}
                    errorMessages={['Este campo es requerido']}
                    InputLabelProps={{
                      shrink: userInfo.lastName !== '',
                    }}
                  />
                  <TextValidator
                    label={'Correo'}
                    fullWidth
                    value={userInfo.email}
                    onChange={handleEmailChange}
                    validators={['required', 'isEmail']}
                    errorMessages={[
                      'Este campo es requerido',
                      'Correo inválido',
                    ]}
                    InputLabelProps={{
                      shrink: userInfo.email !== '',
                    }}
                  />
                  <Button
                    type={'submit'}
                    variant={'contained'}
                    disabled={loading}
                    style={{ float: 'right', marginBottom: 14, marginTop: 10 }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color={'inherit'} />
                    ) : (
                      'Guardar'
                    )}
                  </Button>
                </ValidatorForm>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardHeader title={'Cambiar contraseña'} />
              <CardContent>
                <ValidatorForm onSubmit={handleChangePassword}>
                  <TextValidator
                    label={'Contraseña'}
                    type={'password'}
                    fullWidth
                    value={password}
                    onChange={handlePasswordChange}
                    validators={['required']}
                    errorMessages={['Este campo es requerido']}
                  />
                  <TextValidator
                    label={'Confirmar contraseña'}
                    type={'password'}
                    fullWidth
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    validators={['required']}
                    errorMessages={[
                      'Este campo es requerido',
                      'Las contraseñas no coinciden',
                    ]}
                  />
                  <Button
                    type={'submit'}
                    variant={'contained'}
                    disabled={loading || password !== confirmPassword}
                    style={{ float: 'right', marginBottom: 14, marginTop: 10 }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color={'inherit'} />
                    ) : (
                      'Guardar'
                    )}
                  </Button>
                </ValidatorForm>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Profile
