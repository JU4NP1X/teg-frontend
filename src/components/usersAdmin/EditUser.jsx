import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import { red } from '@mui/material/colors'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem'
import { useEffect, useState } from 'react'
import {
  SelectValidator,
  TextValidator,
  ValidatorForm,
} from 'react-material-ui-form-validator'
import SimpleBar from 'simplebar-react'
import useNotification from '../../hooks/useNotification'
import useUsers from '../../hooks/useUsers'
import ApiConnection from '../../utils/apiConnection'

function EditUser({ handleCloseModal, modal, setModal }) {
  const { listCompanies, user, rolesList, loadingUser, getUsers } = useUsers()
  const { setErrorMessage, setSuccessMessage } = useNotification()

  const [userToEdit, setUserToEdit] = useState(user)

  const icon = <CheckBoxOutlineBlankIcon fontSize={'small'} />
  const checkedIcon = <CheckBoxIcon fontSize={'small'} />

  const hanldeChangeValue = (event, field) => {
    const value = event.target.value
    console.log({
      [field]: value,
    })
    setUserToEdit((prevData) => {
      return {
        ...prevData,
        [field]: value,
      }
    })
  }

  const handleChangeRoles = (values) => {
    setUserToEdit((prevData) => {
      return {
        ...prevData,
        roles: values,
      }
    })
  }

  const handleSubmit = async () => {
    const Api = ApiConnection()

    //validacion para roles
    if (userToEdit.roles.length < 1) {
      return setErrorMessage('debe seleccionar al menos un rol para este Usere')
    }

    const data = {
      ...userToEdit,
      roles: userToEdit.roles.map((role) => role.rolId),
    }

    if (!userToEdit.isNewUser) await Api.put('users', data)
    else {
      await Api.post('users', data)
    }
    if (Api.status === 200) {
      setModal(false)
      setSuccessMessage(Api.message)

      setUserToEdit(false)
    } else {
      setErrorMessage(Api.message)
    }
    getUsers()
  }

  useEffect(() => {
    setUserToEdit(user)
  }, [user])

  return (
    !loadingUser &&
    userToEdit && (
      <>
        <Dialog
          open={modal}
          onClose={handleCloseModal}
          fullWidth={true}
          maxWidth={'sm'}
        >
          <DialogTitle id={'alert-dialog-title'}>
            {userToEdit.isNewUser ? 'Crear Usuario' : 'Editar Usuario'}
          </DialogTitle>

          <DialogContent>
            <ValidatorForm
              className={'formValidator'}
              onSubmit={() => handleSubmit()}
              onError={(errors) => console.log(errors)}
            >
              <SimpleBar
                style={{ maxHeight: '70vh', overflow: 'auto', width: '100%' }}
                onTouchEnd={(e) => {
                  e.stopPropagation()
                }}
              >
                {/* usrName */}
                <TextValidator
                  margin={'dense'}
                  name={'usrName'}
                  label={'Nombre'}
                  fullWidth
                  value={userToEdit.usrName}
                  onChange={(event) => hanldeChangeValue(event, 'usrName')}
                  validators={['required']}
                  errorMessages={['Ingrese un Nombre']}
                />
                {/* usrLastName */}
                <TextValidator
                  margin={'dense'}
                  name={'usrLastName'}
                  label={'Apellido'}
                  fullWidth
                  value={userToEdit.usrLastName}
                  onChange={(event) => hanldeChangeValue(event, 'usrLastName')}
                  validators={['required']}
                  errorMessages={['Ingrese un apellido']}
                />

                {/* Company */}
                <SelectValidator
                  className={'selectValidator'}
                  labelId={'cmpId'}
                  label={'Compañía'}
                  value={userToEdit.cmpId}
                  defaultValue={'Seleccione una compañia'}
                  onChange={(event) => hanldeChangeValue(event, 'cmpId')}
                  validators={['required']}
                  errorMessages={['Seleccione una compañia']}
                >
                  {listCompanies.map((val, index) => (
                    <MenuItem key={index} value={val.cmpId}>
                      {val.cmpName}
                    </MenuItem>
                  ))}
                </SelectValidator>

                {/* usrEmail */}
                <TextValidator
                  margin={'dense'}
                  name={'usrEmail'}
                  label={'Correo'}
                  fullWidth
                  value={userToEdit.usrEmail}
                  onChange={(event) => hanldeChangeValue(event, 'usrEmail')}
                  validators={['required', 'isEmail']}
                  errorMessages={[
                    'Ingrese un correo',
                    'Ingrese un correo válido',
                  ]}
                />

                {/* estatus */}
                <SelectValidator
                  className={'selectValidator'}
                  labelId={'statusLabel'}
                  label={'Estatus'}
                  name={'usrStatus'}
                  value={userToEdit.usrStatus}
                  defaultValue={userToEdit.usrStatus}
                  onChange={(event) => hanldeChangeValue(event, 'usrStatus')}
                  validators={['required']}
                  errorMessages={['Seleccione un estatus']}
                >
                  <MenuItem value={1}>Activo</MenuItem>
                  <MenuItem value={0}>Inactivo</MenuItem>
                </SelectValidator>
                <Autocomplete
                  value={userToEdit.roles ? userToEdit.roles : []}
                  sx={{ color: red }}
                  onChange={(event, value) => handleChangeRoles(value)}
                  multiple
                  id={'roles'}
                  options={rolesList}
                  disableCloseOnSelect
                  isOptionEqualToValue={(role, value) =>
                    role.rolId === value.rolId
                  }
                  getOptionLabel={(role) => role.rolName}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                        sx={{ color: 'rgba(0, 0, 0, 0.40) !important' }}
                      />
                      {props.key}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextValidator
                      {...params}
                      label={'Seleccione uno o varios roles'}
                      placeholder={'Roles'}
                      validators={userToEdit.roles.length ? [] : ['required']}
                      errorMessages={['Seleccione al menos un rol']}
                    />
                  )}
                />
              </SimpleBar>

              <DialogActions>
                <Button id={'btn-ok'} type={'submit'}>
                  Guardar
                </Button>
                <Button id={'btn-cancel'} onClick={handleCloseModal} autoFocus>
                  Cancelar
                </Button>
              </DialogActions>
            </ValidatorForm>
          </DialogContent>
        </Dialog>
      </>
    )
  )
}

//export const modal
export default EditUser
