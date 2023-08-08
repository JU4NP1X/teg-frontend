import { useState } from 'react'
import { ClickAwayListener, Menu } from '@mui/material'
import { Box } from '@mui/system'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Search from './Search'
import SearchIcon from '@mui/icons-material/Search'
import useUsers from '../../hooks/useUsers'

const styles = {
  overflow: 'visible',
  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
  mt: 1.5,
  px: 1.2,
  pb: 1.2,
  '& .MuiAvatar-root': {
    width: 32,
    height: 32,
    ml: -0.5,
    mr: 1,
  },
  '&:before': {
    content: '''',
    display: 'block',
    position: 'absolute',
    top: 0,
    right: 14,
    width: 10,
    height: 10,
    bgcolor: 'background.paper',
    transform: 'translateY(-50%) rotate(45deg)',
    zIndex: 0,
  },
}

const Filter = ({ headCell, setColumn, setValue }) => {

  const {columns, setColumns} = useUsers()

  const handleClickAway = () => {
    handleClose(false)
  }

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {


    
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  /** */

 // console.log(`la columna es: ${useUsers().column}`)

  if (headCell.headCell.filter) {
    return (
      <>
        <ClickAwayListener onClickAway={handleClickAway}>
          <Box sx={{ position: 'relative', ml: 'auto' }} >
            <IconButton sx={{ height: '100%' }} color={columns[headCell.headCell.id].length > 0 ? 'info' : 'default'}
              onClick={handleClick}>
              <Tooltip title='Filtrar'>
                <SearchIcon />
              </Tooltip>
            </IconButton>
            {open ? (
              <Menu
                anchorEl={anchorEl}
                id='account-menu'
                open={open}
                onClose={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: styles,
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Search
                  name={headCell.headCell.label}
                  column={headCell.headCell.id}
                  setColumn={setColumn}
                  setValue={setValue}
                />
              </Menu>
            ) : null}
          </Box>
        </ClickAwayListener>
      </>
    )
  }
}

export default Filter
