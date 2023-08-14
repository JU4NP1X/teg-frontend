import {
  Description,
  ExpandLess,
  ExpandMore,
  LibraryBooks,
  ListAlt,
  LockReset,
  Logout,
  PermIdentity,
  Search,
  Settings,
} from '@mui/icons-material'
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/layout/sideBar.css'
import { isMobile } from '../../utils/utils'
import Swipe from '../__common/Swipe'

export const SideBar = ({ isOpen }) => {
  const Navigate = useNavigate()
  const [openAdministration, setOpenAdministration] = useState(false)

  return (
    <Swipe
      onSwipeLeft={() => {
        setOpenAdministration(false)
      }}
    >
      <List style={{ height: '100%' }}>
        {/* change password */}
        <ListItemButton
          onClick={() => {
            if (isMobile()) setOpenAdministration(false)
            Navigate('/')
          }}
          selected={window.location.pathname === '/'}
        >
          <ListItemIcon sx={{ color: 'white' }}>
            <Search />
          </ListItemIcon>
          <ListItemText primary={'Clasificador'} />
        </ListItemButton>

        {/* change password */}
        <ListItemButton
          onClick={() => {
            if (isMobile()) setOpenAdministration(false)
            Navigate('/admin/config')
          }}
          selected={window.location.pathname === '/admin/config'}
        >
          <ListItemIcon sx={{ color: 'white' }}>
            <LockReset />
          </ListItemIcon>
          <ListItemText primary={'Cambiar Clave'} />
        </ListItemButton>

        {/* Biblioteca */}
        <ListItemButton
          onClick={() => {
            if (isMobile()) setOpenAdministration(false)
            Navigate('/admin/library')
          }}
          selected={window.location.pathname === '/admin/library'}
        >
          <ListItemIcon sx={{ color: 'white' }}>
            <LibraryBooks />
          </ListItemIcon>
          <ListItemText primary={'Biblioteca'} />
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

        {isOpen && openAdministration && (
          <List sx={{ paddingLeft: '16px' }}>
            <ListItemButton
              onClick={() => {
                if (isMobile()) setOpenAdministration(false)
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
                if (isMobile()) setOpenAdministration(false)
                Navigate('/admin/authority-lists')
              }}
              selected={window.location.pathname === '/admin/authority-lists'}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <ListAlt />
              </ListItemIcon>
              <ListItemText primary={'Listas de autoridad'} />
            </ListItemButton>
            <ListItemButton
              onClick={() => {
                if (isMobile()) setOpenAdministration(false)
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
        )}

        {/* Salir */}
        <ListItemButton
          onClick={() => {
            if (isMobile()) setOpenAdministration(false)
            // Agrega aquí la lógica para desloguearse
          }}
          sx={{ mt: 'auto' }}
        >
          <ListItemIcon sx={{ color: 'white' }}>
            <Logout />
          </ListItemIcon>
          <ListItemText primary={'Salir'} />
        </ListItemButton>
      </List>
    </Swipe>
  )
}
