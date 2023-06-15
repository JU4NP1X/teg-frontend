import { useState } from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { CircularProgress, TablePagination, Pagination } from '@mui/material'
import EditRole from './EditRole'
import Status from './Status'
import Action from './Action'
import TableHead from '../reportsAdmin/TableHead'
import useRoles from '../../hooks/useRoles'
import Filter from './Filter'
import SimpleBar from 'simplebar-react'
import CustomPagination from '../__common/CustomPagination'

const headCells = [
  {
    key: 'id',
    id: 'rolName',
    numeric: false,
    disablePadding: false,
    label: 'Roles',
    sort: false,
    filter: true,
  },
  {
    key: 'id',
    id: 'rolStatus',
    numeric: false,
    disablePadding: false,
    label: 'Estatus',
    sort: true,
    filter: false,
  },
  {
    key: 'id',
    id: 'actions',
    numeric: false,
    disablePadding: false,
    label: 'Acciones',
    sort: false,
    filter: false,
  },
]

export default function ListRoles({ visibleModal, setVisibleModal }) {
  const [showRole, setShowRole] = useState(false)

  const {
    roles,
    totalRows,
    rows,
    setRows,
    page,
    setPage,
    setValue,
    setColumn,
    order,
    setOrder,
    setRole,
    loading,
  } = useRoles()

  const handleChangePage = (e, newPage) => setPage( newPage  - 1 )

  const handleShowRole = () => setShowRole(true)

  const handleOpenModal = () => setVisibleModal(true)

  const handleCloseModal = () => setVisibleModal(false)

  return (
    <Box sx={{ width: '100%', px: 5 }}>
      <Paper sx={{ width: '100%' }}>
        <TableContainer>
          <SimpleBar style={{ height: '60vh' }} onTouchEnd={(e) => {e.stopPropagation()}}>
            <Table
              sx={{ minWidth: 750, width: '100%', height: '100%' }}
              aria-labelledby='tableTitle'
              size={'large'}
              stickyHeader={true}
            >
              <TableHead
                headCells={headCells}
                setColumn={setColumn}
                setValue={setValue}
                order={order}
                setOrder={setOrder}
                Filter={Filter}
              />
              <TableBody>
                {!loading ? (
                  roles.map((role, index) => {
                    return (
                      <TableRow hover key={role.key}>
                        <TableCell align='left'>{role.rolName}</TableCell>
                        <TableCell align='center'>
                          <Status rolStatus={role.rolStatus} />
                        </TableCell>
                        <TableCell align='center'>
                          <Action
                            setShowRole={setShowRole}
                            handleShowRole={handleShowRole}
                            data={role}
                            setData={setRole}
                            handleOpenModal={handleOpenModal}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow
                    hover
                    rowSpan={5}
                    style={{ height: 'calc(60vh - 70px)' }}
                  >
                    <TableCell align='center' colSpan={7}>
                      <CircularProgress sx={{ color: 'black' }} />
                    </TableCell>
                  </TableRow>
                )}
                {visibleModal && (
                  <EditRole
                    modal={visibleModal}
                    setModal={setVisibleModal}
                    handleCloseModal={handleCloseModal}
                  />
                )}
              </TableBody>
            </Table>
          </SimpleBar>
        </TableContainer>
        <CustomPagination
          totalRows={totalRows}
          rows={rows}
          handleChangePage={handleChangePage}
          loading={loading}
          setRows={setRows}
        />
      </Paper>
    </Box>
  )
}
