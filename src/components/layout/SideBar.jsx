import {
  Category,
  Description,
  ExpandLess,
  ExpandMore,
  ListAlt,
  LocalLibrary,
  Login,
  Logout,
  PermIdentity,
  Person,
  Settings,
} from '@mui/icons-material'
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useNotification from '../../hooks/useNotification'
import '../../styles/layout/sideBar.css'
import { isMobile } from '../../utils/utils'
import Swipe from '../common/Swipe'
import LoginDialog from './LoginDialog'

export const SideBar = ({ isOpen, loginHandler, setOpen }) => {
  const Navigate = useNavigate()
  const { auth, setUser } = useAuth()
  const { setSuccessMessage } = useNotification()
  const [openAdministration, setOpenAdministration] = useState(false)
  const [openLogin, setOpenLogin] = useState(false)

  useEffect(() => {
    if (!isOpen) setOpenAdministration(false)
  }, [isOpen])

  useEffect(() => {
    loginHandler(openLogin)
  }, [openLogin])

  return (
    <Swipe
      onSwipeLeft={() => {
        setOpen(false)
      }}
      style={{ height: 'inherit' }}
    >
      <List className={'sidebar-list'}>
        {/* Biblioteca */}
        <ListItemButton
          onClick={() => {
            if (isMobile()) {
              setOpenAdministration(false)
              setOpen(false)
            }
            Navigate('/')
          }}
          selected={window.location.pathname === '/'}
        >
          <ListItemIcon sx={{ color: 'white' }}>
            <LocalLibrary />
          </ListItemIcon>
          <ListItemText primary={'Biblioteca'} />
        </ListItemButton>
        {auth ? (
          <>
            {/* Classify */}
            <ListItemButton
              onClick={() => {
                if (isMobile()) {
                  setOpenAdministration(false)
                  setOpen(false)
                }
                Navigate('/classify')
              }}
              selected={window.location.pathname === '/classify'}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <Category />
              </ListItemIcon>
              <ListItemText primary={'Clasificador'} />
            </ListItemButton>

            {/* change password */}
            <ListItemButton
              onClick={() => {
                if (isMobile()) {
                  setOpenAdministration(false)
                  setOpen(false)
                }
                Navigate('/admin/profile')
              }}
              selected={window.location.pathname === '/admin/profile'}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <Person />
              </ListItemIcon>
              <ListItemText primary={'Perfil'} />
            </ListItemButton>

            {/* Desplegable Administración */}
            <ListItemButton
              onClick={() => setOpenAdministration(!openAdministration)}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <Settings />
              </ListItemIcon>
              <ListItemText primary={'Administración'} />
              {openAdministration ? (
                <ExpandLess sx={{ color: 'white' }} />
              ) : (
                <ExpandMore sx={{ color: 'white' }} />
              )}
            </ListItemButton>

            <List
              className={`administration-list ${
                openAdministration && isOpen ? 'open' : ''
              } `}
              sx={{
                paddingLeft: '16px',
                display: 'flex',
                flexDirection: 'column',
                height: '30vh',
              }}
            >
              <ListItemButton
                onClick={() => {
                  if (isMobile()) {
                    setOpenAdministration(false)
                    setOpen(false)
                  }
                  Navigate('/admin/users')
                }}
                selected={window.location.pathname === '/admin/users'}
              >
                <ListItemIcon sx={{ color: 'white' }}>
                  <PermIdentity />
                </ListItemIcon>
                <ListItemText primary={'Usuarios'} />
              </ListItemButton>
              <ListItemButton
                onClick={() => {
                  if (isMobile()) {
                    setOpenAdministration(false)
                    setOpen(false)
                  }
                  Navigate('/admin/authorities')
                }}
                selected={window.location.pathname === '/admin/authorities'}
              >
                <ListItemIcon sx={{ color: 'white' }}>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText primary={'Listas de autoridad'} />
              </ListItemButton>
              <ListItemButton
                onClick={() => {
                  if (isMobile()) {
                    setOpenAdministration(false)
                    setOpen(false)
                  }
                  Navigate('/admin/documents')
                }}
                selected={window.location.pathname === '/admin/documents'}
              >
                <ListItemIcon sx={{ color: 'white' }}>
                  <Description />
                </ListItemIcon>
                <ListItemText primary={'Documentos'} />
              </ListItemButton>
            </List>

            {/* Salir */}
            <ListItemButton
              onClick={() => {
                if (isMobile()) {
                  setOpenAdministration(false)
                  setOpen(false)
                }
                setUser({})
                Navigate('/')
                setSuccessMessage('Sesión cerrada exitosamente')

                // Agrega aquí la lógica para desloguearse
              }}
              style={{ marginTop: 'auto' }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <Logout />
              </ListItemIcon>
              <ListItemText primary={'Salir'} />
            </ListItemButton>
          </>
        ) : (
          <ListItemButton
            onClick={() => {
              if (isMobile()) {
                setOpenAdministration(false)
                setOpen(false)
              }
              setOpenLogin(true)
            }}
            style={{ marginTop: 'auto' }}
          >
            <ListItemIcon sx={{ color: 'white' }}>
              <Login />
            </ListItemIcon>
            <ListItemText primary={'Iniciar Sesión'} />
          </ListItemButton>
        )}
      </List>
      <LoginDialog open={openLogin} handleClose={() => setOpenLogin(false)} />
    </Swipe>
  )
}
