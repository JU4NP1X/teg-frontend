import { red } from '@mui/material/colors'
import MuiDrawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'
const drawerWidth = 240

export const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => {
  return {
    '& .MuiDrawer-paper': {
      backgroundColor: red[900],
      color: 'white',
      position: 'relative',
      whiteSpace: 'nowrap',
      width: '100vw',
      display: 'flex',
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
      },
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: '0vw',
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(7),
          display: 'flex',
        },
      }),
    },
  }
})
