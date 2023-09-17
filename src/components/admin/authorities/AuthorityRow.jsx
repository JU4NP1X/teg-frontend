import { Delete, Edit, FitnessCenter, Sync } from '@mui/icons-material'
import { IconButton, TableCell, TableRow, Tooltip } from '@mui/material'
import { blue, red } from '@mui/material/colors'
import moment from 'moment/moment'
import React, { useEffect, useState } from 'react'
import { Doughnut } from 'react-chartjs-2'
import CountUp from 'react-countup'
import TrainStep from './TrainStep'
import useAuthorities from '../../../hooks/useAuthorities'

const data = {
  datasets: [
    {
      borderWidth: 1,
      backgroundColor: [blue[400], red[300]],
      hoverBackgroundColor: [blue[400], red[300]],
    },
  ],
}
const options = {
  plugins: {
    tooltip: {
      titleFont: {
        size: 7,
      },
      bodyFont: {
        size: 10,
      },
      footerFont: {
        size: 5, // there is no footer by default
      },
    },
  },
}

const AuthorityRow = ({
  authority,
  handleDeleteAuthority,
  handleSyncAuthority,
  handleTrainAuthority,
  handleUpdateAuthority,
  loadingAction,
}) => {
  const { systemInfo } = useAuthorities()
  const [ramAvailable, setRamAvailable] = useState(0)
  const [vramAvailable, setVramAvailable] = useState(0)

  useEffect(() => {
    const calculateRamAvailable = () => {
      const available =
        systemInfo.ram.total - systemInfo.ram.percent * systemInfo.ram.total /100
      setRamAvailable(available)
    }

    const calculateVramAvailable = () => {
      const available = systemInfo.gpu.memoryTotal - systemInfo.gpu.memoryUsed
      setVramAvailable(available)
    }

    calculateRamAvailable()
    calculateVramAvailable()
  }, [systemInfo])

  const isTrainingEnabled =
    ramAvailable >= 8 * 1024 * 1024 * 1024  &&
    vramAvailable >= 8 * 1024 * 1024 * 1024

  let trainingDisabledReason = ''
  if (!isTrainingEnabled) {
    if (ramAvailable < 8 * 1024 * 1024 * 1024 ) {
      const ramAvailableGB = ramAvailable / (1024 * 1024 * 1024 )
      trainingDisabledReason += ` No hay suficiente RAM disponible. Disponible: ${ramAvailableGB.toFixed(
        2
      )} GB, Necesario: 8 GB.`
    }
    if (vramAvailable < 8 * 1024 * 1024 * 1024 ) {
      const vramAvailableGB = vramAvailable / (1024 * 1024 * 1024 )
      trainingDisabledReason += ` No hay suficiente VRAM disponible. Disponible: ${vramAvailableGB.toFixed(
        2
      )}GB, Necesario: 8 GB.`
    }
  }

  return (
    <TableRow key={authority.id}>
      <TableCell>
        <div style={{ display: 'flex' }}>
          <span
            className={'dot'}
            style={{ backgroundColor: authority.color, marginTop: 1 }}
          />
          <b>{authority.name}</b>
        </div>
      </TableCell>
      <TableCell>
        {moment(authority.lastTrainingDate).locale('ve').format('LL hh:mm A')}
      </TableCell>
      <TableCell align={'center'}>
        <CountUp
          separator=" "
          end={authority.resume.datasetsCount}
          preserveValue={true}
        />
      </TableCell>
      <TableCell sx={{ textAlign: '-webkit-center' }}>
        <div style={{ height: '100px', width: '100px' }}>
          <Doughnut
            style={{ height: '100px', width: '100px' }}
            options={options}
            data={{
              ...data,
              labels: ['Categorías con datos', 'Categorías sin datos'],
              datasets: [
                {
                  ...data.datasets[0],
                  data: [
                    authority.resume.representatedCategoryCount,
                    authority.resume.notRepresentatedCategoryCount,
                  ],
                },
              ],
            }}
          />
        </div>
      </TableCell>
      <TableCell align={'center'}>
        <CountUp
          separator=" "
          end={authority.resume.categoryTrainedCount}
          preserveValue={true}
        />
      </TableCell>
      <TableCell align={'center'}>
        <CountUp
          separator=" "
          end={authority.resume.deprecatedCategoryTrainedCount}
          preserveValue={true}
        />
      </TableCell>
      <TableCell align={'center'}>
        <CountUp
          separator=" "
          end={authority.resume.categoryNotTrainedCount}
          preserveValue={true}
        />
      </TableCell>
      <TableCell sx={{ textAlign: '-webkit-center' }}>
        <div style={{ height: '100px', width: '100px' }}>
          <Doughnut
            style={{ height: '100px', width: '100px' }}
            options={options}
            data={{
              ...data,
              labels: ['Porcentaje de éxito', 'Porcentaje de fracaso'],
              datasets: [
                {
                  ...data.datasets[0],
                  data: [
                    authority.theoreticalPrecision,
                    100 - authority.theoreticalPrecision,
                  ],
                },
              ],
            }}
          />
        </div>
      </TableCell>
      <TableCell sx={{ textAlign: '-webkit-center' }}>
        <div style={{ height: '100px', width: '100px' }}>
          <Doughnut
            style={{ height: '100px', width: '100px' }}
            options={options}
            data={{
              ...data,
              labels: ['Porcentaje de éxito', 'Porcentaje de fracaso'],
              datasets: [
                {
                  ...data.datasets[0],
                  data: [
                    authority.resume.practicalPrecision ?? 0,
                    100 - (authority.resume.practicalPrecision ?? 0),
                  ],
                },
              ],
            }}
          />
        </div>
      </TableCell>
      <TableCell align={'center'}>
        <TrainStep
          progress={authority.percentage}
          status={authority.status}
          active={authority.active}
          disabled={authority.disabled}
        />
      </TableCell>
      <TableCell>
        <div
          style={{
            display: 'flex',
            flexFlow: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}
          >
            <Tooltip title="Buscar datos de entrenamiento">
              <IconButton
                variant={'outlined'}
                color={'secondary'}
                onClick={() => handleSyncAuthority(authority)}
                disabled={
                  authority.status === 'GETTING_DATA' ||
                  authority.status === 'TRAINING' ||
                  loadingAction
                }
              >
                <Sync />
              </IconButton>
            </Tooltip>
            <Tooltip title="Editar autoridad">
              <IconButton
                variant={'outlined'}
                color={'success'}
                onClick={() => handleUpdateAuthority(authority)}
                disabled={loadingAction}
              >
                <Edit />
              </IconButton>
            </Tooltip>
          </div>{' '}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Tooltip title={trainingDisabledReason || 'Entrenar red neuronal'}>
              <span>
                <IconButton
                  variant={'outlined'}
                  color={'info'}
                  onClick={() => handleTrainAuthority(authority)}
                  disabled={
                    !isTrainingEnabled ||
                    authority.status === 'GETTING_DATA' ||
                    authority.status === 'TRAINING' ||
                    loadingAction
                  }
                >
                  <FitnessCenter />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={'Eliminar autoridad'}>
              <IconButton
                disabled={
                  authority.native ||
                  authority.status === 'GETTING_DATA' ||
                  authority.status === 'TRAINING' ||
                  loadingAction
                }
                variant={'outlined'}
                color={'error'}
                onClick={() => handleDeleteAuthority(authority)}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </TableCell>
    </TableRow>
  )
}

export default AuthorityRow
