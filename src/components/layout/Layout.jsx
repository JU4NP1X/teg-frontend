import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { Tooltip } from '@mui/material'
import Box from '@mui/material/Box'
import { grey, red } from '@mui/material/colors'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import moment from 'moment/moment'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import '../../styles/layout/layout.css'
import Session from '../../utils/session'
import { isMobile } from '../../utils/utils'
import Swipe from '../__common/Swipe'
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
  const [user] = useState(Session.getAll())
  const filterProps = {
    isOpen: open,
    setOpen,
    user,
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
            open={open}
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
                    style={{ marginLeft: -5, height: 50 }}
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
                      marginLeft: 15,
                      fontSize: '1.8rem',
                      fontWeight: 'lighter',
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    ClaVo <strong>UC</strong>
                  </p>
                </Tooltip>
              </Typography>
              {isMobile() ? (
                <IconButton onClick={toggleDrawer}>
                  <ChevronLeftIcon />
                </IconButton>
              ) : (
                <></>
              )}
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
