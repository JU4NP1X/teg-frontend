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



export default function Divider({ style }) {

  return (
    <div style={{ width: '100%', height: 1, backgroundColor: '#c3c3c3', marginTop: 1, ...style }} />
  )
}

