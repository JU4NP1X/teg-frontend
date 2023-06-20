
import '../../styles/layout/filters.css'
import { isMobile } from '../../utils/utils'
import Swipe from '../__common/Swipe'
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { PermIdentity, InsertDriveFile, BarChart, LockReset, Search, Visibility } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'


export const SideBar = () => {

	const Navigate = useNavigate()

	return (
		<Swipe onSwipeLeft={() => { setOpen(false) }}>
			<List style={{ height: '100%' }}>
				{/* change password */}
				<ListItemButton onClick={() => {
					if (isMobile())
						setOpen(false)
					Navigate('/')
				}} selected={window.location.pathname === '/'}>
					<ListItemIcon sx={{ color: 'white' }}>
						<Search />
					</ListItemIcon>
					<ListItemText primary='Buscador' />
				</ListItemButton>
				<ListItemButton onClick={() => {
					if (isMobile())
						setOpen(false)
					Navigate('/admin/users')
				}} selected={window.location.pathname === '/admin/users'}>
					<ListItemIcon sx={{ color: 'white' }}>
						<PermIdentity />
					</ListItemIcon>
					<ListItemText primary='Usuarios' />
				</ListItemButton>

				{/* change password */}
				<ListItemButton onClick={() => {
					if (isMobile())
						setOpen(false)
					Navigate('/admin/config')
				}} selected={window.location.pathname === '/admin/config'}>
					<ListItemIcon sx={{ color: 'white' }}>
						<LockReset />
					</ListItemIcon>
					<ListItemText primary='Cambiar Clave' />
				</ListItemButton>
			</List>
		</Swipe>
	)
}
