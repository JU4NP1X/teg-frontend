import { Button, Card, CardContent, CardHeader, Grid } from '@mui/material'
import React, { useState } from 'react'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import useNotification from '../hooks/useNotification'
import ApiConnection from '../utils/apiConnection'
import Session from '../utils/session'

const Profile = () => {
  const [user, setUser] = useState(Session.getAll())
  const { setSuccessMessage, setErrorMessage } = useNotification()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleNameChange = (event) => {
    setUser({ ...user, firstName: event.target.value })
  }

  const handleLastNameChange = (event) => {
    setUser({ ...user, lastName: event.target.value })
  }

  const handleEmailChange = (event) => {
    setUser({ ...user, email: event.target.value })
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value)
  }

  console.log(user)
  const handleSave = async () => {
    const api = ApiConnection()
    console.log(user)
    const userUpdated = await api.patch(`/users/list/${user.id}/`, {
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
    })
    setUser(userUpdated)
    if (api.status === 200) setSuccessMessage('Usuario modificado exitosamente')
    else setErrorMessage('Error al modificar usuario, intente más tarde.')
  }

  const handleChangePassword = async () => {
    const api = ApiConnection()
    await api.patch(`/users/list/${user.id}/`, { password: user.password })
    if (api.status === 200) {
      setSuccessMessage('Contraseña cambiada exitosamente')
      setPassword('')
      setConfirmPassword('')
    } else setErrorMessage('Error al cambiar contraseña, intente más tarde.')
  }

  return (
    <Grid container>
      <Grid item xs={0} md={4} />
      <Grid item xs={12} md={4}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title={'Modificar datos'} />
              <CardContent>
                <ValidatorForm onSubmit={handleSave}>
                  <TextValidator
                    label="Nombre"
                    fullWidth
                    value={user.firstName}
                    onChange={handleNameChange}
                    validators={['required']}
                    errorMessages={['Este campo es requerido']}
                    InputLabelProps={{
                      shrink: user.firstName !== '',
                    }}
                  />
                  <TextValidator
                    label="Apellido"
                    fullWidth
                    value={user.lastName}
                    onChange={handleLastNameChange}
                    validators={['required']}
                    errorMessages={['Este campo es requerido']}
                    InputLabelProps={{
                      shrink: user.lastName !== '',
                    }}
                  />
                  <TextValidator
                    label="Correo"
                    fullWidth
                    value={user.email}
                    onChange={handleEmailChange}
                    validators={['required', 'isEmail']}
                    errorMessages={[
                      'Este campo es requerido',
                      'Correo inválido',
                    ]}
                    InputLabelProps={{
                      shrink: user.email !== '',
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    style={{ float: 'right', marginBottom: 14, marginTop: 10 }}
                  >
                    Guardar
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
                    label="Contraseña"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={handlePasswordChange}
                    validators={['required']}
                    errorMessages={['Este campo es requerido']}
                  />
                  <TextValidator
                    label="Confirmar contraseña"
                    type="password"
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
                    type="submit"
                    variant="contained"
                    disabled={password !== confirmPassword}
                    style={{ float: 'right', marginBottom: 14, marginTop: 10 }}
                  >
                    Guardar
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
