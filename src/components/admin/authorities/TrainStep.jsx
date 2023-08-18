import { Chip } from '@mui/material'
import React from 'react'
import CircularProgressWithLabel from '../../__common/CircularProgressWithLabel'

const TrainStep = ({ stepNumber, progress, status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'orange'
      case 'IN_PROGRESS':
        return 'blue'
      case 'COMPLETE':
        return 'green'
      default:
        return 'black'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Pendiente'
      case 'IN_PROGRESS':
        return 'En progreso'
      case 'COMPLETE':
        return 'Completado'
      default:
        return ''
    }
  }

  return (
    <div>
      {status === 'IN_PROGRESS' && (
        <CircularProgressWithLabel value={progress} label={`${stepNumber}/5`} />
      )}
      {status !== 'IN_PROGRESS' && (
        <Chip
          label={getStatusText(status)}
          style={{
            backgroundColor: getStatusColor(status),
            color: 'white',
            minWidth: '100px',
          }}
        />
      )}
    </div>
  )
}

export default TrainStep
