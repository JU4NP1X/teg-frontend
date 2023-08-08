import Button from '@mui/material/Button';
import { useEffect, useState } from 'react'
import { Dialog, Typography } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import ApiConnection from '../../utils/apiConnection'
import useNotification from '../../hooks/useNotification'
import { TextValidator, SelectValidator, ValidatorForm } from 'react-material-ui-form-validator'
import SimpleBar from 'simplebar-react';

const RegisterForm = ({ openRegisterDialog, setOpenRegisterDialog }) => {
  const [companiesList, setCompaniesList] = useState([])
  const { setSuccessMessage, setErrorMessage } = useNotification()
  const [openLoading, setOpenLoading] = useState(false)


  const [form, setForm] = useState({
    usrName: '',
    usrLastName: '',
    usrEmail: '',
    company: { cmpId: '', cmpName: '' },
    usrPassword: '',
    confirmUsrPassword: ''
  })

  const setFormValue = (e) => {
    const { name, value } = e.target
    console.log({ name, value })
    setForm((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const changeCompany = (event) => {
    const {
      target: { value },
    } = event;
    console.log(value);

    const compObj = companiesList.find(({ cmpId }) => cmpId === value)

    setForm(prevData => ({
      ...prevData,
      company: {
        cmpId: compObj.cmpId,
        cmpName: compObj.cmpName
      },
      cmpId: compObj.cmpId
    }))
  }

  useEffect(() => {
    getCompanies()

  }, [])
  const getCompanies = async () => {
    const Api = ApiConnection()
    const listCompanies = await Api.get('/companies', { params: { onlyIndexed: false } })
    setCompaniesList(listCompanies)
    // console.log(companiesList);
  }

  const handleClose = () => {
    setOpenRegisterDialog(false);
  }

  const handleSubmit = async () => {
    setOpenLoading(true)
    const Api = ApiConnection()
    await Api.post('users/without-permissions', { ...form })

    if (Api.status === 200) {
      setOpenRegisterDialog(false);
      setSuccessMessage(Api.message)
    } else
      setErrorMessage(Api.message)

    setOpenLoading(false)
  }


  const validatePasswordMatch = (value) => value === form.usrPassword

  useEffect(() => {
    ValidatorForm.addValidationRule('isPasswordMatch', validatePasswordMatch)
  }, [form])
  return (<>
    <Dialog open={openRegisterDialog} maxWidth='sm' sx={{ height: 680 }}>
      <DialogTitle id='alert-dialog-title'>
        <b>Regístrate</b>
      </DialogTitle>
      <DialogContent>
        <Typography
          component='p'
          variant='h5'
          sx={{ fontSize: 15 }}
        >
          Ingrese sus datos de registro, los mismos serán validados por el administrador. Si los mismos resultan satisfactorios, este procederá a activar su cuenta para que pueda acceder a la página.
        </Typography>
        <ValidatorForm
          className='formValidator'
          onSubmit={() => handleSubmit()}
          onError={(errors) => console.log(errors)}
        >
          <SimpleBar style={{ maxHeight: '50vh', overflow: 'auto', width: '100%' }}>
            {/* usrName */}
            <TextValidator
              fullWidth
              sx={{ px: '0 !important' }}
              margin='dense'
              name='usrName'
              label='Nombre'
              value={form.usrName}
              onChange={setFormValue}
              validators={['required']}
              errorMessages={['Ingrese un Nombre']}

            />
            {/* usrLastName */}
            <TextValidator
              fullWidth
              sx={{ px: '0 !important' }}
              margin='dense'
              name='usrLastName'
              label='Apellido'
              value={form.usrLastName}
              onChange={setFormValue}
              validators={['required']}
              errorMessages={['Ingrese un Apellido']}
            />
            {/* usrEmail */}
            <TextValidator
              fullWidth
              sx={{ px: '0 !important' }}
              margin='dense'
              name='usrEmail'
              label='Email'
              value={form.usrEmail}
              onChange={setFormValue}
              validators={['isEmail', 'required']}
              errorMessages={['Ingrese un Email valido', 'Ingrese un Email',]}
            />
            {/* company */}
            <SelectValidator
              fullWidth
              sx={{ px: '0 !important' }}
              className='selectValidator'
              labelId='cmpId'
              label='Compañía'
              value={form.company.cmpId}
              defaultValue={form.company.cmpId}
              onChange={changeCompany}
              validators={['required']}
              errorMessages={['Seleccione una company',]}
            >
              {companiesList.map((val, index) => (
                <MenuItem key={index} value={val.cmpId}>
                  {val.cmpName}
                </MenuItem>
              ))}
            </SelectValidator>

            {/* usrPassword */}
            <TextValidator
              fullWidth
              sx={{ px: '0 !important' }}
              className='TextValidator'
              label='Contraseña'
              type='password'
              name='usrPassword'
              value={form.usrPassword}
              onChange={setFormValue}
              validators={['required', 'minStringLength:8']}
              errorMessages={['Este campo es requerido', 'La contraseña debe tener al menos 8 caracteres']}
            />

            <TextValidator
              fullWidth
              sx={{ px: '0 !important' }}
              label='Confirmar contraseña'
              onChange={setFormValue}
              name='confirmUsrPassword'
              value={form.confirmUsrPassword}
              validators={['required', 'isPasswordMatch']}
              errorMessages={['Este campo es requerido', 'Las contraseñas no coinciden']}
              margin='normal'
              type='password'
            />

          </SimpleBar>
          <DialogActions>
            {/* <Button color='success' onClick={guardar}>Guardar</Button> */}
            <Button
              variant='contained'
              type='submit'
              className='btn-primary'
              disabled={openLoading}
            >
              {openLoading ? 'Cargando...' : 'Crear cuenta'}

            </Button>
            <Button className='btn-primary'
              variant='contained' onClick={handleClose} autoFocus
              disabled={openLoading}>
              Cancelar
            </Button>
          </DialogActions>
        </ValidatorForm>
      </DialogContent>
    </Dialog>
  </>)
}

export default RegisterForm;