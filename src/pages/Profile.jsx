import { Button, Card, CardContent, CardHeader, Grid } from '@mui/material'
import React, { useState } from 'react'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'

const Profile = () => {
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleNameChange = (event) => {
    setName(event.target.value)
  }

  const handleLastNameChange = (event) => {
    setLastName(event.target.value)
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value)
  }

  const handleSave = () => {
    // Lógica para guardar el nombre en la base de datos
    console.log('Nombre guardado:', name)
  }

  const handleChangePassword = () => {
    // Lógica para guardar la contraseña en la base de datos
    console.log('Contraseña guardada:', password)
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
                    value={name}
                    onChange={handleNameChange}
                    validators={['required']}
                    errorMessages={['Este campo es requerido']}
                  />
                  <TextValidator
                    label="Apellido"
                    fullWidth
                    value={lastName}
                    onChange={handleLastNameChange}
                    validators={['required']}
                    errorMessages={['Este campo es requerido']}
                  />
                  <TextValidator
                    label="Correo"
                    fullWidth
                    value={email}
                    onChange={handleEmailChange}
                    validators={['required', 'isEmail']}
                    errorMessages={[
                      'Este campo es requerido',
                      'Correo inválido',
                    ]}
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
                    validators={['required', 'isPasswordMatch']}
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
