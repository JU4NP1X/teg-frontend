import { Chip, Grid } from '@mui/material'
import React from 'react'
import CircularProgressWithLabel from '../../common/CircularProgressWithLabel'

const TrainStep = ({ progress, status, active, disabled }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'NOT_TRAINED':
        return 'primary'
      case 'GETTING_DATA':
        return 'secondary'
      case 'TRAINING':
        return 'info'
      case 'COMPLETE':
        if (disabled) return 'error'
        if (!active) return 'warning'
        return 'success'
      default:
        return 'warning'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'NOT_TRAINED':
        return 'No entrenado'
      case 'GETTING_DATA':
        return 'Buscando datos'
      case 'TRAINING':
        return 'Entrenando'
      case 'COMPLETE':
        if (disabled) return 'Deshabilitado'
        if (!active) return 'Inactivo'
        return 'Activo'
      default:
        return ''
    }
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        {(status === 'TRAINING' || status === 'GETTING_DATA') && (
          <CircularProgressWithLabel
            value={70}
            label={progress}
            color={getStatusColor(status)}
            sx={{ mb: 2 }}
          />
        )}
      </Grid>
      <Grid item xs={12}>
        <Chip
          label={getStatusText(status)}
          color={getStatusColor(status)}
          style={{
            color: 'white',
            minWidth: '100px',
          }}
        />
      </Grid>
    </Grid>
  )
}

export default TrainStep
