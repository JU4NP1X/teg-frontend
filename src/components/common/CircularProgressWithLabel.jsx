import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import CountUp from 'react-countup'

const CircularProgressWithLabel = (props) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant={'determinate'} {...props} />
      <Box
        sx={{
          top: 2,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant={'caption'}
          component={'div'}
          color={'text.secondary'}
          sx={{ mb: 2 }}
        >
          <CountUp separator=" " end={props.label} preserveValue={true} /> %
        </Typography>
      </Box>
    </Box>
  )
}
export default CircularProgressWithLabel
