import { Card, CardContent, CardMedia, IconButton, Typography, Grid, Pagination, Paper, Divider, InputBase, Stack, Tooltip, Slider, MenuItem, Menu, List, ListItem, ListItemIcon, ListItemButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import DirectionsIcon from '@mui/icons-material/Directions'
import '../../styles/farm/searchCard.css'
import SearchProportionBar from './SearchProportionBar'
import { useEffect, useState } from 'react'
import { SelectValidator, TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import { Dashboard, Fingerprint, ListAlt } from '@mui/icons-material'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import ZoomOutOutlinedIcon from '@mui/icons-material/ZoomOutOutlined'
import ZoomInOutlinedIcon from '@mui/icons-material/ZoomInOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined'
import CountUp from 'react-countup'

const styles = {
  overflow: 'visible',
  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
  mt: 1.5,
  '& .MuiAvatar-root': {
    width: 32,
    height: 32,
    ml: -0.5,
    mr: 1,
  },
  '&:before': {
    content: '""',
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

const SearchCard = ({ counts, setSearch, loading, paginationType, setPaginationType, setCardSize, cardSize, setPage }) => {
  const [searchValue, setSearchValue] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSubmit = () => {
   setSearch(searchValue)
   setPage(1)
  }

  const sizeLabel = (value) => {
    let size = 'SMALL'
    setPaginationType('CARD')
    switch (value) {
      case 1: size = 'MEDIUM'
        break
      case 2: size = 'LARGE'
        break
    }
    setCardSize(size)
  }
  

  return (
    <>
      <Card sx={{ p: 0, ml: -2, mr: -2, width: '100%', position: 'relative' }} className='farm-search-card'>
        <Grid container style={{ display: 'flex', marginTop: '5px', height: 60 }}>
          <Grid xs={12} md={4} sx={{ display: 'flex' }}>
            <Paper
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, height: 40, ml: 1, maxWidth: '95%', mt: '5px !important' }}
            >
              <ValidatorForm
                className='correct-form-size'
                style={{ display: 'flex', width: '100%' }}
                onSubmit={handleSubmit}
                onError={(errors) => console.log(errors)}>
                <TextValidator
                  className='hide-frame fixed-size'
                  sx={{ ml: 1, flex: 1, p: 0, m: 0, borderWith: '0', height: 40, width: '100%' }}
                  placeholder='Buscar'
                  value={searchValue}
                  onChange={({ target }) => setSearchValue(target.value)}
                />
                <IconButton type='submit' sx={{ p: '10px' }} aria-label='search'>
                  <SearchIcon />
                </IconButton>
              </ValidatorForm>

            </Paper>
          </Grid>
          {counts.map(({ key, value }, i) => {
            let name = ''
            switch (key) {
              case 'purchases': name = 'Compras'
                break
              case 'sells': name = 'Ventas'
                break
              case 'logistics': name = 'Logística'
                break
              case 'finances': name = 'Finanzas'
                break
              case 'humanDevelopment': name = 'Des. Humano'
                break
              case 'marketing': name = 'Mercadeo'
                break
              case 'reposition': name = 'Reposición'
                break
            }
            return i < 3 ? (
              <Grid item xs={0} md={2} className=' report-type-resume' sx={{ display: 'flex' }}>
                <Typography className='layout-not-select '
                  sx={i === 0 ? { fontWeight: 'bold', color: '#303030' } : i === 1 ? { fontWeight: 'bold', color: '#c3c3c3' } : { fontWeight: 'bold', color: '#6a6a6a' }}
                  component='h1'
                  variant='h3' >
                  <CountUp end={value} preserveValue useEasing={false} />
                </Typography>
                <Typography className='layout-not-select'
                  sx={i === 0 ? { fontWeight: 'bold', color: '#303030' } : i === 1 ? { fontWeight: 'bold', color: '#c3c3c3' } : { fontWeight: 'bold', color: '#6a6a6a' }}>
                  {name}
                </Typography>
              </Grid>
            ) : (<></>)
          })}
          <Grid item xs={0} md={2} className=' report-type-resume' sx={{ display: 'flex' }}>
            <Tooltip title={'Cambiar visualización de los reportes'}>
              <IconButton color="black" sx={{ height: 'min-content', my: 'auto', ml: 'auto', mr: 2 }}
                onClick={handleClick}>
                <VisibilityOutlinedIcon />
              </IconButton>
            </Tooltip>
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
                sx={{ p: 0 }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <List sx={{ p: 0 }}>
                  <ListItem sx={{ p: 0 }} >
                    <ListItemButton onClick={() => sizeLabel(0)} selected={cardSize === 'SMALL' && paginationType === 'CARD'}>
                      <ListItemIcon sx={{ minWidth: '35px' }}>
                        <ZoomOutOutlinedIcon style={{ minWidth: '20px' }} />
                      </ListItemIcon>
                      Tarjetas Pequeñas
                    </ListItemButton>
                  </ListItem>
                  <ListItem sx={{ p: 0 }} >
                    <ListItemButton onClick={() => sizeLabel(1)} selected={cardSize === 'MEDIUM' && paginationType === 'CARD'}>
                      <ListItemIcon sx={{ minWidth: '35px' }}>
                        <SearchOutlinedIcon style={{ minWidth: '20px' }} />
                      </ListItemIcon>
                      Tarjetas Medianas
                    </ListItemButton>
                  </ListItem>
                  <ListItem sx={{ p: 0 }} >
                    <ListItemButton onClick={() => sizeLabel(2)} selected={cardSize === 'LARGE' && paginationType === 'CARD'}>
                      <ListItemIcon sx={{ minWidth: '35px' }}>
                        <ZoomInOutlinedIcon style={{ minWidth: '20px' }} />
                      </ListItemIcon>
                      Tarjetas Grandes
                    </ListItemButton>
                  </ListItem>
                  <ListItem sx={{ p: 0 }} >
                    <ListItemButton onClick={() => setPaginationType('LIST')} selected={paginationType === 'LIST'}>
                      <ListItemIcon sx={{ minWidth: '35px' }}>
                        <MenuOutlinedIcon />
                      </ListItemIcon>
                      Lista
                    </ListItemButton>
                  </ListItem>
                </List>
              </Menu>
            ) : null}
          </Grid>
        </Grid>
        <SearchProportionBar counts={counts} loading={loading} />
      </Card>
    </>)
}
export default SearchCard