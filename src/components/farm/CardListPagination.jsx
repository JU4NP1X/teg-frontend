import { Card, CardContent, CardMedia, IconButton, Typography, Grid, Pagination, CircularProgress, Box, Tooltip } from '@mui/material'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import GradeIcon from '@mui/icons-material/Grade'
import '../../styles/farm/cardPagination.css'
import ApiConnection from '../../utils/apiConnection'
import useNotification from '../../hooks/useNotification'
import ReportDialog from '../__common/ReportDialog'
import { useState } from 'react'
import Session from '../../utils/session'
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import SellIcon from '@mui/icons-material/Sell'
import HandymanIcon from '@mui/icons-material/Handyman'
import { isMobile } from '../../utils/utils'
import StoreIcon from '@mui/icons-material/Store'
import RepeatOnIcon from '@mui/icons-material/RepeatOn'
import GroupIcon from '@mui/icons-material/Group'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import SimpleBar from 'simplebar-react'
import Divider from '../__common/Divider'


const CardListPagination = ({ cardList, numOfPages = 0, isFav = false, isFreq = false, style, pageChange, loading, setRefreshAll, cardSize, page }) => {
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
      sx={{ maxWidth: 1800, mx: 'auto' }}
    >
      <SimpleBar style={{ height: cardSize === 'SMALL' ? '25vh' : '50vh', width: '100%', marginRight: '16px' }}>
        <Grid container
          justifyContent='center'
          alignItems='center'
          sx={{ minHeight: cardSize === 'SMALL' ? '25vh' : '50vh', mx: 'auto' }}
        >
          {!loading ?
            cardList && cardList.map((report, i) => (

              <Tooltip title={report.repInMaintenance ? 'No puedes acceder al reporte, se encuentra en mantenimiento.' : report.repInConstruction ? 'El reporte se encuentra en construcción, por lo que puede visualizar problemas en el mismo. Haga click para abrirlo.' : 'Haz click para abrir el reporte'}>
                <Card className='farm-card'
                  id={'report-' + (isFav ? 'fav-' : isFreq ? 'freq-' : '') + report.repId}
                  sx={{
                    minWidth: 130,
                    width: (cardSize === 'MEDIUM' ? 12 : cardSize === 'LARGE' ? 15 : 5) + '% !important',
                    height: (cardSize === 'MEDIUM' ? 160 : cardSize === 'LARGE' ? 200 : 125) + 'px !important',
                  }}
                  key={i} onClick={() => {
                    if (!report.repInMaintenance) {
                      setRepId(report.repId)
                      setRepType(report.repType)
                      setTitle(report.repName)
                      setOpen(true)
                    }
                  }}>
                  <CardContent className='farm-card-content farm-card-header'>
                    <Typography className='farm-card-title layout-not-select' sx={{ width: '80%', margin: 0, fontSize: cardSize === 'SMALL' ? '0.55rem' : cardSize === 'MEDIUM' ? '0.75rem' : '1rem', height: cardSize === 'SMALL' ? 25 : cardSize === 'MEDIUM' ? 35 : 50 }}>
                      <b>{report.repName} {report.repInConstruction ? '(En construcción)' : ''}</b>
                    </Typography>
                    <Typography className='layout-not-select'>
                      <IconButton
                        sx={{ p: cardSize === 'SMALL' ? '2px' : '8px' }}
                        aria-label='Marcar como favorito'
                        id={'fav-button-' + (isFav ? 'fav-' : isFreq ? 'freq-' : '') + report.repId}
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
                  </CardContent>
                  <CardMedia
                    sx={{
                      height: (cardSize === 'MEDIUM' ? 65 : cardSize === 'LARGE' ? 95 : 45) + 'px !important',
                      width:  report.repInMaintenance  || !report.repImg || report.repInConstruction ? (cardSize === 'MEDIUM' ? 87 : cardSize === 'LARGE' ? 95 : 80) + 'px !important' : undefined,
                      mx: 'auto'
                    }}
                    image={
                      report.repInMaintenance ? '/img/maintenance.png' :
                        report.repInConstruction ? '/img/construction.png' :
                          report.repImg ?
                            report.repImg
                            : '/img/no-available.jpg'
                    }
                    title='Vista previa del reporte'
                  />
                  <CardContent sx={{ p: 1, }}>
                    <Grid container >
                      <Grid item xs={6}>
                        <img src={`/img/${report.company.cmpValue ?? 'mayoreo'}-${isMobile() || cardSize !== 'LARGE' ? 'isotipo' : 'category'}.png`} style={{ height: '25px', width: 'auto' }} />
                      </Grid>
                      <Grid item xs={6} style={{ textAlign: 'right', }}>
                        {report.categories.find(({ catId }) => [1, 4, 5, 6].find(matchId => matchId === catId)) ? <ShoppingCartIcon sx={{ color: 'rgba(0, 0, 0, 0.54)' }} /> : null}
                        {report.categories.find(({ catId }) => [2, 7, 8, 9].find(matchId => matchId === catId)) ? <SellIcon sx={{ color: 'rgba(0, 0, 0, 0.54)' }} /> : null}
                        {report.categories.find(({ catId }) => [3, 10, 11, 12].find(matchId => matchId === catId)) ? <DirectionsCarFilledIcon sx={{ color: 'rgba(0, 0, 0, 0.54)' }} /> : null}
                        {report.categories.find(({ catId }) => [13, 17, 18, 19].find(matchId => matchId === catId)) ? <AccountBalanceIcon sx={{ color: 'rgba(0, 0, 0, 0.54)' }} /> : null}
                        {report.categories.find(({ catId }) => [14, 20, 21, 22].find(matchId => matchId === catId)) ? <GroupIcon sx={{ color: 'rgba(0, 0, 0, 0.54)' }} /> : null}
                        {report.categories.find(({ catId }) => [15, 23, 24, 25].find(matchId => matchId === catId)) ? <RepeatOnIcon sx={{ color: 'rgba(0, 0, 0, 0.54)' }} /> : null}
                        {report.categories.find(({ catId }) => [16, 26, 27, 28].find(matchId => matchId === catId)) ? <StoreIcon sx={{ color: 'rgba(0, 0, 0, 0.54)' }} /> : null}
                        {report.repInConstruction ?
                          <HandymanIcon sx={{ color: 'rgba(0, 0, 0, 0.54)' }} />
                          : null}
                      </Grid>
                    </Grid>
                  </CardContent>

                </Card>
              </Tooltip>
            )) :
            <Grid container sx={{ display: 'flex', minHeight: cardSize === 'SMALL' ? 210 : 510 }} xs={12}>
              <CircularProgress sx={{ color: 'black', mx: 'auto', my: 'auto' }} />
            </Grid>
          }
        </Grid>
      </SimpleBar >
      <Divider style={{ marginRight: 16 }} />
      <Grid container sx={{ display: 'flex', mt: '10px !important' }} xs={12}>
        <Pagination page={page} defaultPage={1} sx={{ mx: 'auto' }} className='farm-card-pagination' count={numOfPages} onChange={(action, page) => pageChange(page)} disabled={loading} />
      </Grid>
      <ReportDialog setOpen={setOpen} open={open} title={title} repType={repType} repId={repId} />
    </Grid >)
}
export default CardListPagination