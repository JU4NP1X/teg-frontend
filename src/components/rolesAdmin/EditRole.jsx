import Dialog from '@mui/material/Dialog'
import Checkbox from '@mui/material/Checkbox'
import { useState, useEffect, useReducer } from 'react'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import TextareaAutosize from '@mui/base/TextareaAutosize'
import FormControl from '@mui/material/FormControl'
import Input from '@mui/material/Input'
import Button from '@mui/material/Button'
import ApiConnection from '../../utils/apiConnection'
import Backdrop from '@mui/material/Backdrop'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import useNotification from '../../hooks/useNotification'
import OutlinedInput from '@mui/material/OutlinedInput'
import ListItemText from '@mui/material/ListItemText'
import {
  TextValidator,
  SelectValidator,
  ValidatorForm,
} from 'react-material-ui-form-validator'
import Autocomplete from '@mui/material/Autocomplete'
import { red } from '@mui/material/colors'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import useRoles from '../../hooks/useRoles'
import { FormControlLabel, Grid } from '@mui/material'
import SimpleBar from 'simplebar-react'



function EditRole({ handleCloseModal, modal, setModal }) {
  const { role, loadingRole, getRoles } = useRoles()
  const { setErrorMessage, setSuccessMessage } = useNotification()

  const [roleToEdit, setRoleToEdit] = useState(role)


  const hanldeChangeValue = (event, field) => {
    const value = event.target.value
    console.log({
      [field]: value,
    })
    setRoleToEdit((prevData) => {
      return {
        ...prevData,
        [field]: value,
      }
    })
  }

  const handleSubmit = async () => {

    const Api = ApiConnection()

    const data = {
      ...roleToEdit,
    }

    if (!roleToEdit.isNewRole)
      await Api.put('roles', data)
    else {
      await Api.post('roles', data)
    }
    if (Api.status === 200) {
      setModal(false)
      setSuccessMessage(Api.message)

      setRoleToEdit(false)
    } else {
      setErrorMessage(Api.message)
    }
    getRoles()
  }

  useEffect(() => {
    setRoleToEdit(role)
  }, [role])

  return (
    !loadingRole &&
    roleToEdit && (
      <>
        <Dialog
          open={modal}
          onClose={handleCloseModal}
          fullWidth={true}
          maxWidth='sm'
        >
          <DialogTitle id='alert-dialog-title'>
            {roleToEdit.isNewRole ? 'Crear Rol' : 'Editar Rol'}
          </DialogTitle>

          <DialogContent>
            <ValidatorForm
              className='formValidator'
              onSubmit={() => handleSubmit()}
              onError={(errors) => console.log(errors)}
            >
              <SimpleBar style={{ maxHeight: '70vh', overflow: 'auto', width: '100%' }} onTouchEnd={(e) => {e.stopPropagation()}}>
                {/* rolName */}
                <TextValidator
                  margin='dense'
                  name='rolName'
                  label='Nombre'
                  fullWidth
                  value={roleToEdit.rolName}
                  onChange={(event) => hanldeChangeValue(event, 'rolName')}
                  validators={['required']}
                  errorMessages={['Ingrese un Nombre']}
                />

                {/* estatus */}
                <SelectValidator
                  className='selectValidator'
                  labelId='statusLabel'
                  label='Estatus'
                  name='rolStatus'
                  value={roleToEdit.rolStatus}
                  defaultValue={roleToEdit.rolStatus}
                  onChange={(event) => hanldeChangeValue(event, 'rolStatus')}
                  validators={['required']}
                  errorMessages={['Seleccione un estatus']}
                >
                  <MenuItem value={1}>Activo</MenuItem>
                  <MenuItem value={0}>Inactivo</MenuItem>
                </SelectValidator>

              </SimpleBar>

              <DialogActions>
                <Button id='btn-ok' type='submit'>
                  Guardar
                </Button>
                <Button id='btn-cancel' onClick={handleCloseModal} autoFocus>
                  Cancelar
                </Button>
              </DialogActions>
            </ValidatorForm>
          </DialogContent>
        </Dialog>
      </>
    ))
}

//export const modal
export default EditRole