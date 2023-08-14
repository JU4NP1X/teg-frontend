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

const mdTheme = createTheme({
  palette: {
    primary: {
      main: red[900],
    },
    secondary: {
      main: red[500],
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
      <ThemeProvider theme={mdTheme}>
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
                    'Sistema de gestión del vocabulario controlado de la Universidad de Carabobo'
                  }
                >
                  <img src={'img/uc-logo.png'} style={{ height: 40 }} />
                </Tooltip>
                <Tooltip
                  title={
                    'Sistema de gestión del vocabulario controlado de la Universidad de Carabobo'
                  }
                >
                  <strong style={{ marginLeft: 15 }}>VoCo UC</strong>
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
