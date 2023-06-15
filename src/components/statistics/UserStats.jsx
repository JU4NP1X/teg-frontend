import { Typography, Grid, Box, Tooltip, Card, CardContent, Select, InputLabel, MenuItem, FormControl, TextField, } from '@mui/material'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css' // theme css file
import UserSelector from '../__common/UserSelector'
import UserCharts from './UserCharts'
import AgrupationSelector from './AgrupationSelector'
import LoginTypeSelector from './LoginTypeSelector'
const UserStats = () => {
  const [user, setUser] = useState(undefined)
  const [agrupation, setAgrupation] = useState(null)
  const [loginType, setLoginType] = useState(null)


  return (<>
    <Grid container style={{marginBottom: '20px'}}>
      <Typography
        variant='h6' >
        <b>Visualización de estadísticas de usuarios</b>

      </Typography>
    </Grid>
    <Grid container
      justifyContent="flex-end">
      <Grid item style={{ marginTop: 'auto', width: '100%', maxWidth: 300 }}>
        <AgrupationSelector onChange={(agrupation) => {
          setAgrupation(agrupation.value)
        }} />
      </Grid>
      <Grid item style={{ marginTop: 'auto', width: '100%', maxWidth: 300 }}>
        <UserSelector disabled={!(agrupation)} onChange={(user) => {
          setUser(user)
        }} />
      </Grid>
      <Grid item style={{ marginTop: 'auto', width: '100%', maxWidth: 200 }}>
        <LoginTypeSelector onChange={(loginType) => {
          setLoginType(loginType.value)
        }} />
      </Grid>
    </Grid>
    <Grid container style={{minHeight: 300}}>
      <UserCharts user={user} agrupation={agrupation} loginType={loginType} />
    </Grid>
  </>
  )
}
export default UserStats