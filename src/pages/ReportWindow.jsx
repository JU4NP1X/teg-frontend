import useNotification from '../hooks/useNotification'
import { useEffect, useState } from 'react'
import '../styles/login/login.css'
import { Box, CircularProgress, Dialog, Grid } from '@mui/material'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import ApiConnection from '../utils/apiConnection'
import Iframe from 'react-iframe'
import { PowerBIEmbed } from 'powerbi-client-react'
import { models } from 'powerbi-client'
import { Beforeunload } from 'react-beforeunload'
import { useParams } from 'react-router-dom'
import useSearch from '../hooks/useSearch'


export default function ReportWindow() {
  const handle = useFullScreenHandle()
  let { repId, repType } = useParams()
  const [fullScreen, setFullscreen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [repUrl, setRepUrl] = useState('')
  const { setErrorMessage, setSuccessMessage } = useNotification()


  const [embedConfig, setEmbedConfig] = useState({
    type: 'report', // Supported types: report, dashboard, tile, visual, and qna.
    permissions: models.Permissions.Read,
    tokenType: models.TokenType.Embed, // Use models.TokenType.Aad if you're embedding for your organization.
  })


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
    if (repType.toUpperCase() === 'URL')
      await getReportUrl()
    else
      await getReportToken()
  }

  const registerAction = async () => {
    const Api = ApiConnection()
    await Api.put('/reports/close', { repId })
  }

  useEffect(() => {
    getContent()
  }, [])

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid
        container

        sx={{
          display: 'flex',
          backgroundColor: 'white',
          minHeight: '100vh',
          minWidth: '100vw',
          mt: '0px',
        }}
      >

        <Beforeunload onBeforeunload={() => registerAction()} />
        <FullScreen style={{ width: '100vw' }} handle={handle} onChange={(value) => {
          setFullscreen(value)
        }}>
          {

            loading ?
              <>
                <Grid container sx={{ display: 'flex', minHeight: '100vh', minWidth: '100vh', height: '100%' }} xs={12}>
                  <CircularProgress sx={{ color: 'black', mx: 'auto', my: 'auto' }} />
                </Grid>
              </> :
              repType === 'url' ?
                <Iframe
                  display={'initial'}
                  url={repUrl}
                  width='100%'
                  styles={{ width: '100vw', height: '100vh' }}
                  frameBorder='0'
                  allow='fullscreen'
                /> :
                <PowerBIEmbed embedConfig={embedConfig}
                  cssClassName={'power-bi-embed'}
                  styles={{ width: '100vw', height: '100vh' }}
                  frameBorder="0"
                  allow="fullscreen"
                />
          }
        </FullScreen>

      </Grid>
    </Box>
  )
}

