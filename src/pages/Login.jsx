import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import LoginWithGoogle from '../components/login/LoginWithGoogle'
import useAuth from '../hooks/useAuth'
import useNotification from '../hooks/useNotification'
import { useNavigate } from 'react-router-dom'
import Form from '../components/login/Form'
import Links from '../components/login/Links'
import Copyright from '../components/login/Copyright'
import { useEffect, useState } from 'react'
import ApiConnection from '../utils/apiConnection'
import { Box, Card, Grid } from '@mui/material'
import { createTheme } from '@mui/system'
import { ThemeProvider } from '@emotion/react'
import Session from '../utils/session'
import { green, grey } from '@mui/material/colors'
import '../styles/login/login.css'
import { Footer } from '../components/login/Footer'


export default function Login() {
  const { setAuth, auth, loading, setLoading } = useAuth()
  const [altert, setAltert] = useState(false)
  const [session, setSession] = useState(Session.getAll())


  const Navigate = useNavigate()
  const { setSuccessMessage, setErrorMessage } = useNotification()

  const handleSubmit = async ({ usrEmail, usrPassword }) => {
    setLoading(true)
    const Api = ApiConnection()
    const result = await Api.post('/users/login', { usrEmail, usrPassword })
    if (Api.status === 200) {
      Session.set(result)
      setSuccessMessage(Api.message)
      setAuth(true)
      Navigate('/farm')
    } else {
      setErrorMessage(Api.message)
    }
    setLoading(false)
  }
  const responseGoogle = async (response) => {
    if (response && response.credential) {
      const Api = ApiConnection()
      const user = await Api.post('/users/login/google', {
        token: response.credential,
      })

      if (Api.status === 200) {
        Session.set(user)
        setSuccessMessage(Api.message)
        setAuth(true)
        Navigate('/farm')
      } else setErrorMessage(Api.message)
    }
  }

  return (
    <>
      {!loading ? (
        <Box
          sx={{
            display: 'flex',
            backgroundColor: '#afb0af',
            minHeight: '100vh',
            width: '100vw',
            mt: '0px',
          }}
        >
          <Grid container>
            <Grid xs={12}>
              <Card
                sx={{
                  p: 4,
                  textAlign: 'center',
                  maxWidth: '300px',
                  minHeight: '480px',
                  mx: 'auto',
                  mt: 5,
                  mb: 5,
                }}
              >
                <img
                  src={'/img/mayoreo-category.png'}
                  style={{ height: 75, width: 'auto' }}
                  alt='logo oic'
                />
                <Typography component='h1' variant='h5' sx={{ pt: 4 }}>
                  Inicia sesión en tu cuenta
                </Typography>

                <Form handleSubmit={handleSubmit} loading={loading} />

                {altert ? (
                  <Typography mt={2} color='red'>
                    {' '}
                    {altert}
                  </Typography>
                ) : (
                  <></>
                )}
                <Typography
                  component='p'
                  variant='h5'
                  sx={{ fontSize: '1rem', my: 1 }}
                >
                  Tambien puedes usar:
                </Typography>
                <Grid container style={{ placeContent: 'center' }}>
                  <LoginWithGoogle responseGoogle={responseGoogle} />
                </Grid>

                <Links />
              </Card>
            </Grid>
            <Footer />
          </Grid>
        </Box>
      ) : (
        <></>
      )}
    </>
  )
}
