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
import React from 'react'
import {
  SelectValidator,
  TextValidator,
  ValidatorForm,
} from 'react-material-ui-form-validator'

const UserDialog = ({
  open,
  onClose,
  onSave,
  formValues,
  handleChange,
  loadingEdition,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={'md'}>
      <DialogTitle>
        {formValues.id ? 'Editar Usuario' : 'Agregar Usuario'}
      </DialogTitle>
      <ValidatorForm onSubmit={onSave}>
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
            <SelectValidator
              label={'¿Es administrador?'}
              labelid={'admin-label'}
              id={'admin-select'}
              name={'isAdmin'}
              value={formValues.isAdmin}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value={true}>Sí</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </SelectValidator>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button type={'submit'} disabled={loadingEdition}>
            {loadingEdition ? <CircularProgress size={20} /> : 'Guardar'}
          </Button>
        </DialogActions>
      </ValidatorForm>
    </Dialog>
  )
}

export default UserDialog
