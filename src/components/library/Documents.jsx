import { GetApp, Visibility } from '@mui/icons-material'
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import useLibrary from '../../hooks/useLibrary'
import DocumentViewer from './DocumentViewer'

const Documents = ({ paginatedData, style }) => {
  const { doc, setDoc, getDoc } = useLibrary()
  const [open, setOpen] = useState(false)
  const [loadingDownload, setLoadingDownload] = useState(false)
  const [loadingView, setLoadingView] = useState(false)
  const [loadingDocument, setLoadingDocument] = useState(0)
  const handleDownload = async (item) => {
    setLoadingDownload(true)
    setLoadingDocument(item.id)
    const { pdf } = await getDoc(item)
    // Decodificar el string base64 a un blob
    const byteCharacters = atob(pdf)
    const byteArrays = []
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512)
      const byteNumbers = new Array(slice.length)
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      byteArrays.push(byteArray)
    }
    const blob = new Blob(byteArrays, { type: 'application/pdf' })

    // Crear el enlace de descarga
    const downloadLink = document.createElement('a')
    downloadLink.href = URL.createObjectURL(blob)
    downloadLink.download = `${item.title}.pdf`
    downloadLink.click()

    setLoadingDownload(false)
    setLoadingDocument(0)
  }
  return (
    <Box style={style}>
      <Grid container spacing={0}>
        {paginatedData.map((item) => (
          <Grid item xs={12} key={item.id}>
            <Card
              sx={{
                marginBottom: '10px',
                display: 'flex',
                height: 120,
                boxShadow: 'none',
              }}
            >
              <CardContent
                sx={{
                  flex: '1 1 auto',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography
                  variant={'h6'}
                  component={'div'}
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant={'body2'}
                  color={'text.secondary'}
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {item.summary}
                </Typography>
                <Grid
                  container
                  style={{
                    marginTop: 'auto',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {item.category &&
                    item.category.map((category) => (
                      <Chip
                        key={category.id}
                        label={
                          <div
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <span
                              className={'dot'}
                              style={{
                                backgroundColor:
                                  category.translation.authority.color,
                                height: 4,
                                marginTop: 0,
                                borderRadius: '50%',
                              }}
                            />
                            {category.translation
                              ? category.translation.name
                              : category.name}
                          </div>
                        }
                        sx={{ marginRight: '5px' }}
                      />
                    ))}
                </Grid>
              </CardContent>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative', // Agregamos esta línea
                  mr: 1,
                }}
              >
                <CardMedia
                  component={'img'}
                  height={'50'}
                  src={`data:image/png;base64,${item.img}`}
                  alt={item.title}
                  sx={{ width: '140px', flexShrink: 0 }}
                />
                <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Tooltip title="Descargar">
                    <IconButton
                      disabled={loadingView || loadingDownload}
                      color={'primary'}
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: '10px',
                      }}
                      onClick={() => handleDownload(item)}
                    >
                      {loadingDownload && loadingDocument === item.id ? (
                        <CircularProgress size={24} />
                      ) : (
                        <GetApp />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Ver">
                    <IconButton
                      color={'primary'}
                      disabled={loadingView || loadingDownload}
                      onClick={async () => {
                        setLoadingView(true)
                        setLoadingDocument(item.id)
                        await getDoc(item)
                        setLoadingView(false)
                        setOpen(true)
                        setLoadingDocument(0)
                      }}
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {loadingView && loadingDocument === item.id ? (
                        <CircularProgress size={24} />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </Tooltip>
                </CardContent>
              </Box>
            </Card>
            <Divider sx={{ mb: 1, mt: -2 }} /> {/* Agregamos el divider */}
          </Grid>
        ))}
      </Grid>
      <DocumentViewer
        open={open}
        onClose={() => setOpen(false)}
        pdfBase64={doc.pdf}
        title={doc.title}
      />
    </Box>
  )
}

export default Documents
