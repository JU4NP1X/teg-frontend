import { Dialog, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { useState } from 'react'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import useNotification from '../../hooks/useNotification'
import ApiConnection from '../../utils/apiConnection'

const RecoverPassword = ({
  openRecoverPassDialog,
  setOpenRecoverPassDialog,
}) => {
  const { setSuccessMessage, setErrorMessage } = useNotification()
  const [openLoading, setOpenLoading] = useState(false)
  const [usrEmail, setEmail] = useState('')
  const [success, setSuccess] = useState(false)

  const setFormValue = (e) => {
    const { value } = e.target
    setEmail(value)
  }

  const handleClose = () => {
    setOpenRecoverPassDialog(false)
  }

  const handleSubmit = async () => {
    setOpenLoading(true)
    const Api = ApiConnection()
    await Api.put('users/recover-password', { usrEmail: usrEmail })
    setOpenRecoverPassDialog(false)
    if (Api.status === 200) {
      setSuccessMessage(Api.message)
      setOpenLoading(false)
    } else {
      setErrorMessage(Api.message)
    }
  }

  return (
    <>
      <Dialog
        open={openRecoverPassDialog}
        fullWidth={true}
        maxWidth={'sm'}
        sx={{ height: 680 }}
      >
        <DialogTitle id={'alert-dialog-title'}>
          Recuperar Contraseña
        </DialogTitle>
        <DialogContent>
          <Typography component={'p'} variant={'h5'} sx={{ fontSize: 15 }}>
            Ingrese su correo electrónico con el que se registró en la página,
            en el mismo recibirá una nueva contraseña para ingresar.
          </Typography>
          <ValidatorForm
            onSubmit={() => handleSubmit()}
            onError={(errors) => console.log(errors)}
          >
            {/* email */}
            <TextValidator
              margin={'dense'}
              name={'usrEmail'}
              label={'Email'}
              fullWidth
              value={usrEmail}
              onChange={setFormValue}
              validators={['isEmail', 'required']}
              errorMessages={['Ingrese un Email valido', 'Ingrese un Email']}
            />
            <DialogActions>
              <Button
                className={'btn-primary'}
                variant={'contained'}
                color={'success'}
                type={'submit'}
                //disabled={openLoading ? false : true}
              >
                {openLoading ? 'Cargando' : 'Recuperar contraseña'}
              </Button>
              <Button
                className={'btn-primary'}
                variant={'contained'}
                onClick={handleClose}
                autoFocus
              >
                Cancelar
              </Button>
            </DialogActions>
          </ValidatorForm>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default RecoverPassword
