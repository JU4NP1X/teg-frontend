import { GetApp, Visibility } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Typography,
} from '@mui/material'
import React from 'react'

const Documents = ({ paginatedData }) => {
  return (
    <Box style={{ height: 'calc( 100vh - 270px)' }}>
      <Grid container spacing={2}>
        {paginatedData.map((item) => (
          <Grid item xs={12} key={item.id}>
            <Card sx={{ marginBottom: '10px', display: 'flex' }}>
              <CardContent
                sx={{
                  flex: '1 1 auto',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography variant="h6" component="div">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
                <Grid container style={{ marginTop: 'auto' }}>
                  {item.categories.map((category) => (
                    <Chip
                      key={category}
                      label={category}
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
                  component="img"
                  height="50"
                  image={item.imageUrl}
                  alt={item.title}
                  sx={{ width: '140px', flexShrink: 0 }}
                />
                <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="outlined"
                    href={item.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
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
                    variant="outlined"
                    href={item.viewUrl}
                    target="_blank"
                    size="small"
                    rel="noopener noreferrer"
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
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Documents
