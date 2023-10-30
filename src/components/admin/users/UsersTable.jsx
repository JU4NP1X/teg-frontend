import { Delete, Edit } from '@mui/icons-material'
import {
  Chip,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from '@mui/material'
import React from 'react'
import SimpleBar from 'simplebar-react'
import useAuth from '../../../hooks/useAuth'
import Border from '../../common/Border'

const columns = [
  { label: 'Email', align: 'left', width: '20%' },
  { label: 'Usuario', align: 'left', width: '20%' },
  { label: 'Nombre', align: 'left', width: '20%' },
  {
    label: 'Apellido',
    align: 'left',
    width: '20%',
  },
  {
    label: 'Administrador',
    align: 'center',
    width: '10%',
  },
  { label: 'Acciones', align: 'right', width: '10%' },
]
const UsersTable = ({
  users,
  handleEditUser,
  handleDeleteUser,
  loading,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
}) => {
  const { user } = useAuth()
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10)
    setRowsPerPage(newRowsPerPage)
    handleChangePage(null, 0)
  }

  return (
    <>
      <TableContainer>
        <Border>
          <SimpleBar
            onTouchStart={(e) => {
              e.stopPropagation()
            }}
            style={{ height: 'calc(100vh - 200px)' }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.label}
                      align={column.align}
                      style={{
                        fontWeight: 'bold',
                        textAlign: column.align,
                        width: column.width,
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading ? (
                  users.results.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.username}</TableCell>
                      <TableCell>{item.firstName}</TableCell>
                      <TableCell>{item.lastName}</TableCell>
                      <TableCell align={'center'}>
                        <Chip
                          label={item.isAdmin ? 'Sí' : 'No'}
                          color={item.isAdmin ? 'success' : 'error'}
                        />
                      </TableCell>
                      <TableCell align={'right'}>
                        <Tooltip title="Editar usuario">
                          <IconButton
                            onClick={() => handleEditUser(item)}
                            size={'small'}
                            color={'success'}
                            sx={{ m: 1 }}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar usuario">
                          <IconButton
                            onClick={() => handleDeleteUser(item.id)}
                            size={'small'}
                            color={'error'}
                            sx={{ m: 1 }}
                            disabled={item.id === user.id}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      align={'center'}
                      style={{
                        height: 'calc(100vh - 280px)',
                        marginBottom: -200,
                      }}
                    >
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </SimpleBar>
        </Border>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[rowsPerPage]}
        component={'div'}
        count={users.count || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  )
}

export default UsersTable
