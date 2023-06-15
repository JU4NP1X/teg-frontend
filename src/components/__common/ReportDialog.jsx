import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { CircularProgress, Dialog, Grid } from '@mui/material'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { useEffect, useState } from 'react'
import ApiConnection from '../../utils/apiConnection'
import useNotification from '../../hooks/useNotification'
import Iframe from 'react-iframe'
import useSearch from '../../hooks/useSearch'
import { PowerBIEmbed } from 'powerbi-client-react'
import { models } from 'powerbi-client'
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser'
import { isMobile } from '../../utils/utils'



function BootstrapDialogTitle(props) {
  const { children, onFullScreen, onClose, loading, onNewWindow, ...other } = props

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onFullScreen && onClose ? (<>
        {!isMobile() ?
          <IconButton
            aria-label='new-window'
            onClick={onNewWindow}
            sx={{
              position: 'absolute',
              right: 100,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
            disabled={loading}
          >
            <OpenInBrowserIcon />
          </IconButton>
          :
          <></>}

        <IconButton
          aria-label='full-screen'
          onClick={onFullScreen}
          sx={{
            position: 'absolute',
            right: 50,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          disabled={loading}
        >
          <FullscreenIcon />
        </IconButton>
        <IconButton
          aria-label='full-screen'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </>
      ) : null}
    </DialogTitle>
  )
}


export default function ReportDialog({ title, repType, repId, open, setOpen }) {
  const handle = useFullScreenHandle()
  const [fullScreen, setFullscreen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [repUrl, setRepUrl] = useState('')
  const { setRefresh } = useSearch()
  const { setErrorMessage, setSuccessMessage } = useNotification()


  const [embedConfig, setEmbedConfig] = useState({
    type: 'report', // Supported types: report, dashboard, tile, visual, and qna.
    permissions: models.Permissions.Read,
    tokenType: models.TokenType.Embed, // Use models.TokenType.Aad if you're embedding for your organization.
  })

  const handleClose = async () => {
    const Api = ApiConnection()
    await Api.put('/reports/close', { repId })
    setRepUrl('')
    setOpen(false)
  }

  const handleFullScreen = (value) => {
    handle.enter(value)
    setFullscreen(!value)
  }
  const getReportUrl = async () => {
    setLoading(true)
    const Api = ApiConnection()

    const reponse = await Api.get('/reports/url', { params: { repId } })

    if (Api.status === 200) {
      setRepUrl(reponse.url.ruaUrl)
      setLoading(false)
    } else
      setErrorMessage(Api.message)

  }
  const getReportToken = async () => {
    setLoading(true)
    const Api = ApiConnection()

    const reponse = await Api.get('/reports/token', { params: { repId } })

    if (Api.status === 200) {
      setEmbedConfig({ ...embedConfig, embedUrl: reponse.embedUrl, accessToken: reponse.azureToken })
      setLoading(false)
    } else {
      setOpen(false)
      setErrorMessage(Api.message)
    }
  }
  const getContent = async () => {
    if (repType === 'URL')
      await getReportUrl()
    else
      await getReportToken()

    setRefresh(true)

  }

  const handleNewWindow = async () => {
    window.open(`/reports/${repType.toLowerCase()}/${repId}`, '_blank',
      `toolbar=no,
     location=no,
     status=no,
     menubar=no,
     scrollbars=yes,
     resizable=yes`
    )
    setOpen(false)
  }
  useEffect(() => {
    if (open)
      getContent()
  }, [open])
  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={open}
        fullWidth={true}
        maxWidth={'xl'}

      >
        <BootstrapDialogTitle id='customized-dialog-title' onFullScreen={handleFullScreen} onClose={handleClose} loading={loading} style={{ maxWidth: 'calc(100% - 76px)' }} onNewWindow={handleNewWindow}>
          {title}
        </BootstrapDialogTitle>
        <FullScreen handle={handle} onChange={(value) => {
          setFullscreen(value)
        }}>
          {
            loading ?
              <>
                <Grid container sx={{ display: 'flex', minHeight: '80vh', minWidth: '80vh', height: '100%' }} xs={12}>
                  <CircularProgress sx={{ color: 'black', mx: 'auto', my: 'auto' }} />
                </Grid>
              </> :
              repType === 'URL' ?
                <Iframe
                  display={'initial'}
                  url={repUrl}
                  width='100%'
                  styles={{ minHeight: '80vh', height: '100%' }}
                  frameBorder='0'
                  allow='fullscreen'
                /> :
                <PowerBIEmbed embedConfig={embedConfig}
                  cssClassName={'power-bi-embed'}
                  frameBorder="0"
                  allow="fullscreen"
                />
          }
        </FullScreen>

      </Dialog>
    </div>
  )
}