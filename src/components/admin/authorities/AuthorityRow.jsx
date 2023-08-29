import { Edit, FitnessCenter, Sync } from '@mui/icons-material'
import DeleteIcon from '@mui/icons-material/Delete'
import { Button, TableCell, TableRow } from '@mui/material'
import { blue, red } from '@mui/material/colors'
import moment from 'moment/moment'
import React from 'react'
import { Doughnut } from 'react-chartjs-2'
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
  handleReTrain,
  handleSyncAuthority,
  handleUpdateAuthority,
  loadingAction,
}) => {
  return (
    <TableRow key={authority.id}>
      <TableCell sx={{ textAlign: '-webkit-center' }}>
        <div
          style={{
            height: 20,
            width: 20,
            backgroundColor: authority.color,
            borderRadius: 3,
          }}
        ></div>
      </TableCell>
      <TableCell align={'center'}>
        <b>{authority.name}</b>
      </TableCell>
      <TableCell>
        {moment(authority.lastTrainingDate).locale('ve').format('LL hh:mm A')}
      </TableCell>
      <TableCell align={'center'}>{authority.resume.datasetsCount}</TableCell>
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
        {authority.resume.categoryTrainedCount}
      </TableCell>
      <TableCell align={'center'}>
        {authority.resume.deprecatedCategoryTrainedCount}
      </TableCell>
      <TableCell align={'center'}>
        {authority.resume.categoryNotTrainedCount}
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
            <Button
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
            </Button>
            <Button
              variant={'outlined'}
              color={'success'}
              disabled={loadingAction}
              onClick={() => handleUpdateAuthority(authority)}
              sx={{ ml: 1 }}
            >
              <Edit />
            </Button>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Button
              variant={'outlined'}
              color={'info'}
              onClick={handleReTrain}
              disabled={
                authority.status === 'GETTING_DATA' ||
                authority.status === 'TRAINING' ||
                loadingAction
              }
            >
              <FitnessCenter />
            </Button>
            <Button
              disabled={authority.native || loadingAction}
              variant={'outlined'}
              onClick={() => handleDeleteAuthority(authority)}
              sx={{ ml: 1 }}
            >
              <DeleteIcon />
            </Button>
          </div>
        </div>
      </TableCell>
    </TableRow>
  )
}

export default AuthorityRow
