import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import {
  SelectValidator,
  TextValidator,
  ValidatorForm,
} from 'react-material-ui-form-validator'
import useAuth from '../../../hooks/useAuth'

const UserDialog = ({
  open,
  onClose,
  onSave,
  formValues,
  handleChange,
  loadingEdition,
}) => {
  const { user } = useAuth()
  const [confirmPassword, setConfirmPassword] = useState('')

  ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
    return value == formValues.password
  })
  useEffect(() => setConfirmPassword(''), [user.id])
  return (
    <Dialog open={open} onClose={onClose} maxWidth={'md'}>
      <DialogTitle>
        {formValues.id ? 'Editar Usuario' : 'Agregar Usuario'}
      </DialogTitle>
      <ValidatorForm onSubmit={onSave} style={{ margin: 0 }}>
        <DialogContent>
          <DialogContentText width={500}>
            <TextValidator
              label={'Email'}
              name={'email'}
              value={formValues.email || ''}
              validators={['required', 'isEmail']}
              errorMessages={['Este campo es requerido', 'Email inválido']}
              onChange={handleChange}
              fullWidth
            />
            <TextValidator
              label={'Usuario'}
              name={'username'}
              value={formValues.username || ''}
              validators={['required']}
              errorMessages={['Este campo es requerido']}
              onChange={handleChange}
              fullWidth
            />
            <TextValidator
              label={'Nombre'}
              name={'firstName'}
              value={formValues.firstName || ''}
              validators={['required']}
              errorMessages={['Este campo es requerido']}
              onChange={handleChange}
              fullWidth
            />
            <TextValidator
              label={'Apellido'}
              name={'lastName'}
              value={formValues.lastName || ''}
              validators={['required']}
              errorMessages={['Este campo es requerido']}
              onChange={handleChange}
              fullWidth
            />
            {!formValues.id && (
              <TextValidator
                label={'Contraseña'}
                type={'password'}
                name={'password'}
                value={formValues.password || ''}
                validators={['required']}
                errorMessages={['Este campo es requerido']}
                onChange={handleChange}
                fullWidth
              />
            )}
            {!formValues.id && (
              <TextValidator
                label={'Confirmar contraseña'}
                type={'password'}
                name={'confirmPassword'}
                validators={['required', 'isPasswordMatch']}
                value={confirmPassword}
                errorMessages={[
                  'Este campo es requerido',
                  'Las contraseñas no coinciden',
                ]}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
              />
            )}
            <SelectValidator
              label={'¿Es administrador?'}
              labelid={'admin-label'}
              id={'admin-select'}
              name={'isAdmin'}
              value={formValues.isAdmin}
              onChange={handleChange}
              fullWidth
              disabled={formValues.id === user.id}
            >
              <MenuItem value={true}>Sí</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </SelectValidator>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button type={'submit'} disabled={loadingEdition}>
            {loadingEdition ? <CircularProgress size={24} /> : 'Guardar'}
          </Button>
        </DialogActions>
      </ValidatorForm>
    </Dialog>
  )
}

export default UserDialog
