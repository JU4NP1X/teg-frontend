import { useEffect, useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff'
import { green, grey } from '@mui/material/colors'
import { Filters } from './Filters'
import { Drawer } from './Drawer'
import { AppBar } from './AppBar'
import { Outlet, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import Session from '../../utils/session'
import LogoutIcon from '@mui/icons-material/Logout'
import '../../styles/layout/layout.css'
import ApiConnection from '../../utils/apiConnection'
import useNotification from '../../hooks/useNotification'
import WidgetsIcon from '@mui/icons-material/Widgets'
import { ButtonBase, Tooltip } from '@mui/material'
import { Beforeunload } from 'react-beforeunload'
import useSearch from '../../hooks/useSearch'
import moment from 'moment/moment'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { isMobile } from '../../utils/utils'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import Swipe from '../__common/Swipe'

const mdTheme = createTheme({
  palette: {
    primary: {
      main: grey[100],
    },
    secondary: {
      main: green[500],
    },
  },
})

const Layout = ({ children }) => {

  const { auth, setAuth } = useAuth()
  const { setSuccessMessage, setErrorMessage } = useNotification()
  const { setRefreshAll, setSearch } = useSearch()
  const [filterAction, setFilterAction] = useState(false)
  const [resetFilters, setResetFilters] = useState(false)
  const [open, setOpen] = useState(false)
  const [user] = useState(Session.getAll())
  const [companiesList, setCompaniesList] = useState([])
  const filterProps = { companiesList, setCompaniesList, isOpen: open, resetFilters, setResetFilters, setOpen, user }
  const [time, setTime] = useState(moment().format('DD/MM/YYYY hh:mm A'))



  const Navigate = useNavigate()

  const toggleDrawer = () => {
    setOpen(!open)
  }
  const closeSession = async () => {
    const Api = ApiConnection()
    await Api.post('/users/logout')
    if (Api.status === 200)
      setSuccessMessage(Api.message)
    else
      setErrorMessage(Api.message)
    Session.unset()
    setAuth(false)
    Navigate('/')
  }


  const goToHomePage = async () => {
    setSearch('')
    setRefreshAll(true)
    Navigate('/farm')
  }

  const registerAction = async (props) => {
    const Api = ApiConnection()
    await Api.post(`/users/session/${props}`)
  }

  useEffect(() => {
    registerAction('start')
    setInterval(() => {
      setTime(moment().format('DD/MM/YYYY hh:mm A'))
    }, 1000)
  }, [])
  return (
    <>
      {auth ? (
        <ThemeProvider theme={mdTheme}>
          <Beforeunload onBeforeunload={() => registerAction('end')} />
          <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position='absolute' open={open} sx={{ boxShadow: 'none', border: '1px', borderBottom: 'inset', borderBottomWidth: 'thin', display: open && isMobile() ? 'none' : 'flex' }} className='appbar-background'>
              <Toolbar
                sx={{
                  pr: '24px', // keep right padding when drawer closed
                }}
                className='layout-header'
              >
                <Grid container>
                  <Grid item>
                    <Tooltip title='Ir al menú de inicio' >
                      <ButtonBase onClick={goToHomePage}>
                        <img className='layout-logo' src={'/img/mayoreo-category.png'} alt='logo oic' style={{ height: '50px' }} />
                        <Typography
                          component='h1'
                          variant='h5'
                          color='inherit'
                          noWrap
                          sx={{ flexGrow: 1 }}
                        >
                        </Typography>
                      </ButtonBase>
                    </Tooltip>

                  </Grid>
                  <Grid item style={{ marginLeft: 'auto' }}>
                    <Grid container style={{ height: '100%' }}>
                      <Grid item style={{ marginTop: 'auto' }}>
                        <Typography
                          className='layout-user-information layout-not-select'
                          component='h5'
                          color='inherit'
                          noWrap
                          sx={{ flexGrow: 1, mb: 0 }}
                        >
                          <b>Bienvenido:</b> {`${user.usrName} ${user.usrLastName}`}
                        </Typography>
                        <Typography
                          className='layout-user-information layout-not-select'
                          component='h5'
                          color='inherit'
                          noWrap
                          sx={{ flexGrow: 1, mb: 0, mt: 0 }}
                        >
                          {`${time}`}
                        </Typography>
                      </Grid>
                      <Grid item style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                        <Tooltip title='Cerrar sesión'>
                          <IconButton
                            className='layout-icon-exit'
                            edge='start'
                            color='inherit'
                            aria-label='open drawer'
                            onClick={closeSession}
                          >
                            <LogoutIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </Grid>

                </Grid>
              </Toolbar>
            </AppBar>
            <Drawer variant='permanent' open={open}>
              <Toolbar
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography className='layout-not-select'
                  component='h1'
                  variant='h6'
                  color='inherit'
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {
                    window.location.pathname === '/farm' ? <>
                      <Tooltip title='Limpiar los filtros'>
                        <IconButton
                          onPointerEnter={() => setFilterAction(true)} onPointerLeave={() => setFilterAction(false)}
                          onClick={() => { setResetFilters(true) }}
                        >
                          {filterAction ? <FilterAltOffIcon /> : <FilterAltIcon />}
                        </IconButton>
                      </Tooltip>
                      <strong>Filtros</strong>
                    </> :
                      <Tooltip title='Administración de usuarios'>
                        <>

                          <IconButton disabled={true}>
                            <WidgetsIcon />
                          </IconButton>
                          <strong>Menú</strong>
                        </>
                      </Tooltip>
                  }
                </Typography>
                {isMobile() ?
                  <IconButton onClick={toggleDrawer}>
                    <ChevronLeftIcon />
                  </IconButton>
                  : <></>}
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
                  component='main'
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'light'
                        ? theme.palette.white
                        : theme.palette.grey[900],
                    flexGrow: 1,
                    mt: '0px',
                    height: 'inherit'
                  }}
                >
                  <Filters {...filterProps} />
                </Box>
              </SimpleBar>
            </Drawer>
            {(!isMobile() || !open) ?
              <IconButton
                edge='start'
                color='inherit'
                aria-label='open drawer'
                onClick={toggleDrawer}
                sx={{ m: 'auto', zIndex: 10 }}
              >
                {!open ?
                  <ArrowForwardIosIcon /> :
                  <ArrowBackIosNewIcon />
                }
              </IconButton> : <></>}
            <Box
              className='layout-content-main'
              component='main'
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                    ? theme.palette.grey[50]
                    : theme.palette.grey[900],
                flexGrow: 1,
                mt: '65px',
                ml: '-40px'
              }}
            >
              <Container style={{ padding: '0', maxWidth: '100%' }}>
                <Grid container alignContent={'center'} alignItems={'center'}>
                  <SimpleBar
                    style={{
                      height: 'calc(100vh - 65px)',
                      overflow: 'auto',
                      display: 'grid',
                      width: '100%'
                    }}
                  >
                    <Swipe onSwipeRight={() => { setOpen(true) }} onSwipeLeft={() => { setOpen(false) }}>
                      <Outlet context={{ open }} />
                    </Swipe>
                  </SimpleBar>
                </Grid>
              </Container>
            </Box>
          </Box>
        </ThemeProvider>
      ) : <Navigate to='/' />}
    </>


  )
}
export default Layout