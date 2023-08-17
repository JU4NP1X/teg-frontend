import { FitnessCenter } from '@mui/icons-material'
import DeleteIcon from '@mui/icons-material/Delete'
import { Button, TableCell, TableRow } from '@mui/material'
import React from 'react'
import { Doughnut } from 'react-chartjs-2'

const data = {
  labels: ['Categorías Suficientes', 'Categorías Insuficientes'],
  datasets: [
    {
      backgroundColor: ['#36A2EB', '#FF6384'],
      hoverBackgroundColor: ['#36A2EB', '#FF6384'],
    },
  ],
}
const AuthorityRow = ({ authority, handleDeleteAuthority, handleReTrain }) => {
  return (
    <TableRow key={authority.name}>
      <TableCell>{authority.name}</TableCell>
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button variant="contained" color="secondary" onClick={handleReTrain}>
            <FitnessCenter />
          </Button>
          <Button
            variant="contained"
            onClick={() => handleDeleteAuthority(authority)}
            sx={{ ml: 1 }}
          >
            <DeleteIcon />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

export default AuthorityRow
