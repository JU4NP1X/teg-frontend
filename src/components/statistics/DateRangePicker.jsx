
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { es } from 'react-date-range/dist/locale'
import { useEffect, useState } from 'react'
import { DateRange } from 'react-date-range'
import { Grid, TextField } from '@mui/material'

function addToDate(date, days = 0, months = 0, years = 0) {
  date.setDate(date.getDate() + days)
  date.setMonth(date.getMonth() + months)
  date.setFullYear(date.getFullYear() + years)
  return date
}

const DateRangePicker = ({ onDateChange, style }) => {
  const [startDate, setStartDate] = useState(addToDate(new Date(), -7))
  const [endDate, setEndDate] = useState(new Date())


  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
    if (startDate && endDate)
      onDateChange({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      })
  }
  useEffect(() => {
    onDateChange({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    })
  }, [])
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }} style={style}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              id="filled-search"
              label="Fecha de inicio"
              variant="standard"
              onClick={handleClick}
              value={startDate.toISOString().split('T')[0]}

            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="filled-search"
              label="Fecha fin"
              variant="standard"
              onClick={handleClick}
              value={endDate.toISOString().split('T')[0]}
            />
          </Grid>
        </Grid>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
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
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Grid container>

          <DateRange
            ranges={[{
              startDate,
              endDate
            }]}
            showSelectionPreview={false}
            onChange={({ range1 }) => {
              setStartDate(range1.startDate)
              setEndDate(range1.endDate)
            }}
            locale={es}
            moveRangeOnFirstSelection={false}
            editableDateInputs={true}
          />
        </Grid>
      </Menu>
    </>
  )
}


export default DateRangePicker