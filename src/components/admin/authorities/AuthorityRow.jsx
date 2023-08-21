import { Edit, FitnessCenter, Sync } from '@mui/icons-material'
import DeleteIcon from '@mui/icons-material/Delete'
import { Button, TableCell, TableRow } from '@mui/material'
import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import TrainStep from './TrainStep'

const data = {
  labels: ['Categorías Suficientes', 'Categorías Insuficientes'],
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
  console.log(authority)
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
      <TableCell>{authority.trainingData}</TableCell>
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
                    authority.theoreticalAccuracy.sufficientCategories,
                    authority.theoreticalAccuracy.insufficientCategories,
                  ],
                },
              ],
            }}
          />
        </div>
      </TableCell>
      <TableCell>{authority.updatedCategories}</TableCell>
      <TableCell>{authority.deprecatedCategories}</TableCell>
      <TableCell>{authority.newUntrainedCategories}</TableCell>
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
                    authority.theoreticalAccuracy.sufficientCategories,
                    authority.theoreticalAccuracy.insufficientCategories,
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
                    authority.practicalAccuracy.sufficientCategories,
                    authority.practicalAccuracy.insufficientCategories,
                  ],
                },
              ],
            }}
          />
        </div>
      </TableCell>
      <TableCell>
        <TrainStep
          stepNumber={authority.trainStep.stepNumber}
          progress={authority.trainStep.progress}
          status={authority.trainStep.status}
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
            <Button variant={'outlined'} color={'secondary'} onClick={() => {}}>
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
            <Button variant={'outlined'} color={'info'} onClick={handleReTrain}>
              <FitnessCenter />
            </Button>
            <Button
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
