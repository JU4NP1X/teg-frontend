import { GetApp, Visibility } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Grid,
  Typography,
} from '@mui/material'
import React from 'react'

const Documents = ({ paginatedData, style }) => {
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
                        label={category.translation.name}
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
                  <Button
                    variant={'outlined'}
                    href={item.downloadUrl}
                    target={'_blank'}
                    rel={'noopener noreferrer'}
                    size={'small'}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: '10px',
                    }}
                  >
                    <GetApp />
                  </Button>
                  <Button
                    variant={'outlined'}
                    href={item.viewUrl}
                    target={'_blank'}
                    size={'small'}
                    rel={'noopener noreferrer'}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Visibility />
                  </Button>
                </CardContent>
              </Box>
            </Card>
            <Divider sx={{ mb: 1, mt: -2 }} /> {/* Agregamos el divider */}
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Documents
