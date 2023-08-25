import { Edit, FitnessCenter, Sync } from '@mui/icons-material'
import DeleteIcon from '@mui/icons-material/Delete'
import { Button, TableCell, TableRow } from '@mui/material'
import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import TrainStep from './TrainStep'

const data = {
  labels: ['CategoríasSuficientes', 'CategoríasInsuficientes'],
  datasets: [
    {
      backgroundColor: ['#36A2EB', '#FF6384'],
      hoverBackgroundColor: ['#36A2EB', '#FF6384'],
    },
  ],
}

const AuthorityRow = ({
  authority,
  handleDeleteAuthority,
  handleReTrain,
  handleUpdateAuthority,
}) => {
  return (
    <TableRow key={authority.id}>
      <TableCell>
        <div
          style={{
            height: 20,
            width: 20,
            backgroundColor: authority.color,
            borderRadius: 3,
          }}
        ></div>
      </TableCell>
      <TableCell>
        <b>{authority.name}</b>
      </TableCell>
      <TableCell>{authority.lastTrainingDate}</TableCell>
      <TableCell>{authority.resume.datasetsCount}</TableCell>
      <TableCell>
        <div style={{ height: '100px', width: '100px' }}>
          <Doughnut
            style={{ height: '100px', width: '100px' }}
            data={{
              ...data,
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
      <TableCell>{authority.resume.categoryTrainedCount}</TableCell>
      <TableCell>{authority.resume.deprecatedCategoryTrainedCount}</TableCell>
      <TableCell>{authority.resume.categoryNotTrainedCount}</TableCell>
      <TableCell>
        <div style={{ height: '100px', width: '100px' }}>
          <Doughnut
            style={{ height: '100px', width: '100px' }}
            data={{
              ...data,
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
      <TableCell>
        <div style={{ height: '100px', width: '100px' }}>
          <Doughnut
            style={{ height: '100px', width: '100px' }}
            data={{
              ...data,
              datasets: [
                {
                  ...data.datasets[0],
                  data: [
                    authority.resume.categoryTrainedCount,
                    authority.resume.categoryNotTrainedCount,
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
              onClick={() => {}}
              disabled={
                authority.status === 'GETTING_DATA' ||
                authority.status === 'TRAINING'
              }
            >
              <Sync />
            </Button>
            <Button
              variant={'outlined'}
              color={'success'}
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
                authority.status === 'TRAINING'
              }
            >
              <FitnessCenter />
            </Button>
            <Button
              disabled={authority.native}
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
