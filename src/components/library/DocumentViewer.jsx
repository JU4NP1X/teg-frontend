import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material'
import React, { useCallback, useState } from 'react'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import Iframe from 'react-iframe'

const DocumentViewer = ({ open, onClose, pdfBase64, title }) => {
  const screen = useFullScreenHandle()
  const [isFullScreen, setIsFullScreen] = useState(false)

  const setFullScreen = () => {
    setIsFullScreen(true)
    screen.enter()
  }
  const fullScreenChange = useCallback(
    (state, handle) => {
      setIsFullScreen(state)
    },
    [screen]
  )
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle style={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <IconButton edge="end" onClick={setFullScreen}>
          {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ height: '80vh' }}>
        <FullScreen handle={screen} onChange={fullScreenChange}>
          <Iframe
            src={`data:application/pdf;headers=filename%3D${title};base64,${pdfBase64}`}
            width={'100%'}
            height={'100%'}
          />
        </FullScreen>
      </DialogContent>
    </Dialog>
  )
}

export default DocumentViewer
