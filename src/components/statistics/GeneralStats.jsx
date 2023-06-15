import { Typography, Grid, Box, Tooltip, Card, CardContent, Select, InputLabel, MenuItem, FormControl, TextField, } from '@mui/material'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css' // theme css file
import AgrupationSelector from './AgrupationSelector'
import LoginTypeSelector from './LoginTypeSelector'
import GeneralCharts from './GeneralCharts'
const GeneraLStats = () => {
  const [agrupation, setAgrupation] = useState(null)
  const [loginType, setLoginType] = useState(null)


  return (<>
    <Grid container style={{ marginBottom: '20px' }}>
      <Typography
        variant='h6' >
        <b>Visualización de estadísticas generales</b>

      </Typography>
    </Grid>
    <Grid container
      justifyContent="flex-end">
      <Grid item style={{ marginTop: 'auto', width: '100%', maxWidth: 300 }}>
        <AgrupationSelector withToday={false} onChange={(agrupation) => {
          setAgrupation(agrupation.value)
        }} />
      </Grid>
      <Grid item style={{ marginTop: 'auto', width: '100%', maxWidth: 200 }}>
        <LoginTypeSelector onChange={(loginType) => {
          setLoginType(loginType.value)
        }} />
      </Grid>
    </Grid>
    <Grid container style={{ minHeight: 300 }}>
      <GeneralCharts agrupation={agrupation} loginType={loginType} />
    </Grid>
  </>
  )
}
export default GeneraLStats