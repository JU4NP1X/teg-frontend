import { Card, CardContent, CardMedia, IconButton, Typography, Grid, Pagination, CircularProgress, Box, Tooltip } from '@mui/material'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import GradeIcon from '@mui/icons-material/Grade'
import '../../styles/farm/cardPagination.css'
import ApiConnection from '../../utils/apiConnection'
import useNotification from '../../hooks/useNotification'
import ReportDialog from './ReportDialog'
import { useState } from 'react'
import Session from '../../utils/session'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import SimpleBar from 'simplebar-react'



const ReportListPagination = ({ list, numOfPages = 0, isFav = false, style, pageChange, loading, setRefreshAll, showFav = true, page }) => {
  const { setErrorMessage, setSuccessMessage } = useNotification()
  const { user } = useState(Session.getAll())
  const [title, setTitle] = useState('')
  const [repType, setRepType] = useState('')
  const [open, setOpen] = useState(false)
  const [repId, setRepId] = useState(false)
  const addOrRemoveFavoriteReport = async (repId) => {
    const Api = ApiConnection()
    await Api.put('/users/report/fav', { repId })
    if (Api.status === 200) {
      setSuccessMessage(Api.message)
      setRefreshAll(true)
    } else
      setErrorMessage(Api.message)

  }
  return (
    <Grid container
      justifyContent='center'
      alignItems='center'
      sx={{ minHeight: '490px', maxWidth: 1800, mx: 'auto', p: 2 }}
    >
      <TableContainer component={Paper}>
        <SimpleBar style={{ height: 393, overflow: 'auto' }}>
          <Table aria-label='simple table' stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align='left'><b>Nombre</b></TableCell>
                <TableCell align='left'><b>Descripción</b></TableCell>
                <TableCell align='center'><b>Compañía</b></TableCell>
                <TableCell align='center'><b>Disponibilidad</b></TableCell>
                {showFav ?
                  <TableCell align='center'><b>Favorito</b></TableCell> : null}
              </TableRow>
            </TableHead>
            <TableBody >
              {!loading ?
                list && list.map((report, i) => (
                  <TableRow
                    key={report.repId}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      if (!report.repInMaintenance) {
                        setRepId(report.repId)
                        setRepType(report.repType)
                        setTitle(report.repName)
                        setOpen(true)
                      }
                    }}
                    hover
                  >
                    <TableCell align='left'>{report.repName} {report.repInConstruction ? '(En construcción)' : ''}</TableCell>
                    <TableCell align='left'>{report.repDescription}</TableCell>
                    <TableCell align='center'>

                      <img src={`/img/${report.company.cmpValue ?? 'mayoreo'}-category.png`} style={{ height: '25px', width: 'auto' }} />
                    </TableCell>
                    <TableCell align='center'>
                      {!report.repInMaintenance ?
                        (
                          <span
                            style={{
                              backgroundColor: "#f6ffed",
                              padding: "2px",
                              border: "1px solid ",
                              borderColor: "#52c41a",
                              color: "#52c41a",
                              height: "10px"
                            }}
                          >
                            {" "}
                            DISPONIBLE{" "}
                          </span>
                        ) : (
                          <span
                            style={{
                              backgroundColor: "#fff1f0",
                              padding: "2px",
                              border: "1px solid",
                              borderColor: "#ffa39e",
                              color: "#f5222d",
                            }}
                          >
                            {" "}
                            EN MANTENIMIENTO{" "}
                          </span>
                        )}
                    </TableCell>
                    {showFav ?
                      <TableCell align='center'>
                        <Typography className='layout-not-select'>
                          <IconButton
                            aria-label='Marcar como favorito'
                            id={'fav-button-' + (isFav ? 'fav-' : '') + report.repId}
                            onClick={(e) => {
                              e.stopPropagation()
                              addOrRemoveFavoriteReport(report.repId)
                              if (report.favoriteForUsers.length)
                                report.favoriteForUsers.pop()
                              else
                                report.favoriteForUsers.push(user)
                            }}
                          >
                            {report.favoriteForUsers.length ? <GradeIcon /> : <StarOutlineIcon />}
                          </IconButton>
                        </Typography>
                      </TableCell> : null}
                  </TableRow>
                ))
                :
                <TableRow>
                  <TableCell align='center' colSpan={8} sx={{ height: 340  }}>
                    <CircularProgress sx={{ color: 'black', mx: 'auto', my: 'auto' }} />
                  </TableCell>
                </TableRow>

              }


            </TableBody>
          </Table>
        </SimpleBar>

      </TableContainer>

      <Grid container sx={{ display: 'flex', mt: 'auto !important', }} xs={12}>
        <Pagination page={page} defaultPage={1}  sx={{ mx: 'auto' }} className='farm-card-pagination' count={numOfPages} onChange={(action, page) => pageChange(page)} disabled={loading} />
      </Grid>
      <ReportDialog setOpen={setOpen} open={open} title={title} repType={repType} repId={repId} />
    </Grid>)
}
export default ReportListPagination