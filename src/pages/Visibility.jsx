import { useEffect, useState } from 'react'
import ApiConnection from '../utils/apiConnection'
import Box from '@mui/material/Box'
import ReportListPagination from '../components/__common/ReportListPagination'
import UserSelector from '../components/__common/UserSelector'
import { Grid, Paper, Tooltip, Typography } from '@mui/material'

const Visibility = () => {
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [numOfPages, setNumOfPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    fillData()
  }, [page])
  useEffect(() => {
    if (page !== 1)
      setPage(1)
    else
      fillData()
  }, [user])

  const fillData = async () => {
    setLoading(true)
    const Api = ApiConnection()
    const resultReports = await Api.post('reports/per-role', {
      page: page, rows: 10, roles: user ? user.roles.map(({ rolId }) => rolId) : []
    });
    if (Api.status === 200) {
      setList(resultReports.reports)
      setNumOfPages(Math.ceil(resultReports.totalRows / 10))

    } else {
      //   // setConnErr(true);
    }
    setLoading(false)
  }

  return (<>
    <Box sx={{ width: '100%' }}>
      <Tooltip title={
        <>
          Visualizador de los reportes por cada usuario. Si un usuario no es capaz de ver un reporte, puede significar:
          <br />1. El usuario no posee el rol apropiado para ver el reporte
          <br />2. El reporte no tiene categorías asociadas
          <br />3. El reporte está inactivo.
        </>}>
        <Typography variant={'h5'} component={'h2'} sx={{ textAlign: 'center', my: 4 }}>
          <b>Visibilidad de reportes por usuario</b>
        </Typography>
      </Tooltip>
      <Paper sx={{ m: 2, p: 2, pt: 0 }}>
        <Grid container>
          <Grid item md={10} xs={0} />
          <Grid item md={2} xs={12} >
            <UserSelector onChange={(user) => {
              setPage(1)
              setUser(user)
            }} />

          </Grid>
          <Grid item xs={12}>
            <ReportListPagination list={list} numOfPages={numOfPages} pageChange={(page) => setPage(page)} defaultPage={page} page={page} loading={loading} showFav={false} />
          </Grid>
        </Grid>

      </Paper>
    </Box>
  </>);
}

export default Visibility