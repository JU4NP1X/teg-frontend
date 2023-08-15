import {
  Description,
  ExpandLess,
  ExpandMore,
  LibraryBooks,
  ListAlt,
  Logout,
  PermIdentity,
  Person,
  Search,
  Settings,
} from '@mui/icons-material'
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/layout/sideBar.css'
import { isMobile } from '../../utils/utils'
import Swipe from '../__common/Swipe'

export const SideBar = ({ isOpen }) => {
  const Navigate = useNavigate()
  const [openAdministration, setOpenAdministration] = useState(false)

  useEffect(() => {
    if (!isOpen) setOpenAdministration(false)
  }, [isOpen])

  return (
    <Swipe
      onSwipeLeft={() => {
        setOpenAdministration(false)
      }}
      style={{ height: 'inherit' }}
    >
      <List className={'sidebar-list'}>
        {/* Biblioteca */}
        <ListItemButton
          onClick={() => {
            if (isMobile()) setOpenAdministration(false)
            Navigate('/library')
          }}
          selected={window.location.pathname === '/library'}
        >
          <ListItemIcon sx={{ color: 'white' }}>
            <LibraryBooks />
          </ListItemIcon>
          <ListItemText primary={'Biblioteca'} />
        </ListItemButton>

        {/* Classify */}
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

        {/* Salir */}
        <ListItemButton
          onClick={() => {
            if (isMobile()) setOpenAdministration(false)
            // Agrega aquí la lógica para desloguearse
          }}
          style={{ marginTop: 'auto' }}
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
