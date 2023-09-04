import { Delete, Edit, FitnessCenter, Sync } from '@mui/icons-material'
import { IconButton, TableCell, TableRow, Tooltip } from '@mui/material'
import { blue, red } from '@mui/material/colors'
import moment from 'moment/moment'
import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import CountUp from 'react-countup'
import TrainStep from './TrainStep'
const esMoment = moment.locale('es')

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
  handleUpdateAuthority,
  loadingAction,
}) => {
  return (
    <TableRow key={authority.id}>
      <TableCell sx={{ textAlign: '-webkit-center' }}>
        <div style={{ display: 'flex', placeContent: 'center' }}>
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
        <TrainStep progress={authority.percentage} status={authority.status} />
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
            <Tooltip title="Entrenar red neuronal">
              <IconButton
                variant={'outlined'}
                color={'info'}
                onClick={() => handleTrainAuthority(authority)}
                disabled={
                  authority.status === 'GETTING_DATA' ||
                  authority.status === 'TRAINING' ||
                  loadingAction
                }
              >
                <FitnessCenter />
              </IconButton>
            </Tooltip>
            <Tooltip title={'Eliminar autoridad'}>
              <IconButton
                disabled={authority.native || loadingAction}
                variant={'outlined'}
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
