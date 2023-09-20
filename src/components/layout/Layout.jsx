import { Tooltip } from '@mui/material'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { grey, red } from '@mui/material/colors'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import moment from 'moment/moment'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import '../../styles/layout/layout.css'
import { isMobile } from '../../utils/utils'
import Swipe from '../common/Swipe'
import { Drawer } from './Drawer'
import { SideBar } from './SideBar'

const theme = createTheme({
  palette: {
    primary: {
      main: red[900],
    },
    secondary: {
      main: red[500],
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h6: {
      fontWeight: 'bold',
      fontSize: '1.2rem',
    },
  },
})

const Layout = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const filterProps = {
    isOpen: open,
    setOpen,
    loginHandler: (value) => {
      setLoginModalOpen(value)
    },
  }
  const [time, setTime] = useState(moment().format('DD/MM/YYYY hh:mm A'))

  const toggleDrawer = () => {
    setOpen(!open)
  }

  useEffect(() => {
    setInterval(() => {
      setTime(moment().format('DD/MM/YYYY hh:mm A'))
    }, 1000)
  }, [])

  return (
    <>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex' }}>
          <Drawer
            variant={'permanent'}
            open={open && !loginModalOpen}
            onMouseEnter={() => {
              setOpen(true)
            }}
            onMouseLeave={() => {
              setOpen(false)
            }}
          >
            <Toolbar
              className={'title-site'}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: red[900],
                color: 'white',
              }}
            >
              <Typography
                className={'layout-not-select'}
                component={'h1'}
                variant={'h6'}
                color={'inherit'}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Tooltip
                  title={
                    'Sistema de clasificación y control del vocabulario controlado de la Universidad de Carabobo'
                  }
                >
                  <img
                    src={'/img/uc-logo.png'}
                    style={{ marginLeft: isMobile() ? 5 : -5, height: 50 }}
                  />
                </Tooltip>
                <Tooltip
                  title={
                    'Sistema de clasificación y control del vocabulario controlado de la Universidad de Carabobo'
                  }
                >
                  <p
                    style={{
                      marginTop: 0,
                      marginBottom: 0,
                      marginLeft: 45,
                      fontSize: '1.8rem',
                      fontWeight: 'lighter',
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    <strong>UC V</strong>oc
                  </p>
                </Tooltip>
              </Typography>
            </Toolbar>
            <Divider />

            <SimpleBar
              style={{
                height: 'calc(100vh - 65px)',
                overflowX: 'hidden',
                overflowY: 'auto',
              }}
            >
              <Box
                component={'main'}
                sx={{
                  flexGrow: 1,
                  mt: '0px',
                  height: 'inherit',
                }}
              >
                <SideBar {...filterProps} />
              </Box>
            </SimpleBar>
          </Drawer>
          <Box
            className={'layout-content-main'}
            component={'main'}
            sx={{
              backgroundColor: grey[50],
              flexGrow: 1,
            }}
          >
            <Container style={{ padding: '0', maxWidth: '100%' }}>
              <Grid
                container
                alignContent={'center'}
                alignItems={'center'}
                sx={{
                  p: 4,
                }}
              >
                <SimpleBar
                  style={{
                    height: 'calc(100vh - 65px)',
                    overflow: 'auto',
                    display: 'grid',
                    width: '100%',
                  }}
                >
                  <Swipe
                    onSwipeRight={() => {
                      setOpen(true)
                    }}
                    onSwipeLeft={() => {
                      setOpen(false)
                    }}
                  >
                    <Outlet context={{ open }} />
                  </Swipe>
                </SimpleBar>
              </Grid>
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  )
}

export default Layout
