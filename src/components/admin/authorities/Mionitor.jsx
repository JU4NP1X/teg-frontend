import { Box, Table, TableCell, TableRow, Tooltip } from '@mui/material'
import React from 'react'
import Border from '../../common/Border'
import useAuthorities from '../../../hooks/useAuthorities'

const Monitor = () => {
  const { systemInfo } = useAuthorities()

  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'none', lg: 'none', xl: 'flex' },
        mx: 'auto',
      }}
    >
      <Border
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          height: 52,
        }}
      >
        <Tooltip
          title={
            'Monitor de uso de recursos el servidor, toma en cuenta estos valores antes de realizar cualquier acción sobre las autoridades.'
          }
        >
          <Table>
            <TableRow>
              <TableCell>
                <b>MONITOR</b>
              </TableCell>
              <TableCell>
                <div
                  style={{
                    width: 1.3,
                    height: 15,
                    backgroundColor: 'black',
                  }}
                />
              </TableCell>
              <TableCell>
                CPU:{' '}
                {systemInfo.cpu.percent.toLocaleString(undefined, {
                  minimumIntegerDigits: 2,
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                %
              </TableCell>
              <TableCell>
                GPU:{' '}
                {systemInfo.gpu.percent.toLocaleString(undefined, {
                  minimumIntegerDigits: 2,
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                %
              </TableCell>
              <TableCell>
                <div
                  style={{
                    width: 1.3,
                    height: 15,
                    backgroundColor: 'black',
                  }}
                />
              </TableCell>
              <TableCell>
                RAM:{' '}
                {Math.round(
                  systemInfo.ram.total / Math.pow(2, 30)
                ).toLocaleString(undefined, {
                  minimumIntegerDigits: 2,
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                GB
              </TableCell>
              <TableCell>
                VRAM:{' '}
                {Math.round(
                  systemInfo.gpu.memoryTotal / Math.pow(2, 30)
                ).toLocaleString(undefined, {
                  minimumIntegerDigits: 2,
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                GB
              </TableCell>
              <TableCell>
                <div
                  style={{
                    width: 1.3,
                    height: 15,
                    backgroundColor: 'black',
                  }}
                />
              </TableCell>
              <TableCell>
                Uso de RAM:{' '}
                {systemInfo.ram.percent.toLocaleString(undefined, {
                  minimumIntegerDigits: 2,
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                %
              </TableCell>
              <TableCell>
                Uso de VRAM:{' '}
                {Math.round(
                  (systemInfo.gpu.memoryUsed / systemInfo.gpu.memoryTotal) * 100
                ).toLocaleString(undefined, {
                  minimumIntegerDigits: 2,
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                %
              </TableCell>
            </TableRow>
          </Table>
        </Tooltip>
      </Border>
    </Box>
  )
}
export default Monitor
