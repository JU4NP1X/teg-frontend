import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import { useState } from 'react'
import RegisterForm from './ModalRegister'
import RecoverPassword from './ModalRecoverPassword'
import CircularProgress from '@mui/material/CircularProgress'



const Links = () => {
  const [openRecoverPassDialog, setOpenRecoverPassDialog] = useState(false);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  // const [openLoading,setOpenLoading] = useState(true)

  return (
    <Grid container style={{marginTop: 20}}>
      <Grid item xs={6} style={{textAlign: 'left'}}>
        <Link component='button' variant='body2' onClick={() => setOpenRecoverPassDialog(true)}>
          Recuperar Contraseña
        </Link>
      </Grid>
      <Grid item  xs={6}  style={{textAlign: 'right'}}>
        <Link  variant='body2' component='button' onClick={() => {setOpenRegisterDialog(true); console.log(openRegisterDialog)}}>
          {'Registrate'}
        </Link>
      </Grid>
      { openRecoverPassDialog ? <RecoverPassword openRecoverPassDialog={openRecoverPassDialog} setOpenRecoverPassDialog={setOpenRecoverPassDialog}  /> : null }
      { openRegisterDialog ? <RegisterForm openRegisterDialog={openRegisterDialog} setOpenRegisterDialog={setOpenRegisterDialog}  /> : null }
    </Grid>
  )
}

export default Links
