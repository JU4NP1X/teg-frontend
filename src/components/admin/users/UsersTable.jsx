import { Delete, Edit } from '@mui/icons-material'
import {
  Button,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material'
import React from 'react'
import SimpleBar from 'simplebar-react'

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
      <TableContainer component={Paper}>
        <SimpleBar
          onTouchStart={(e) => {
            e.stopPropagation()
          }}
          style={{ height: 'calc(100vh - 230px)' }}
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
                users.results.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell align={'center'}>
                      <Chip
                        label={user.isAdmin ? 'Sí' : 'No'}
                        color={user.isAdmin ? 'success' : 'error'}
                      />
                    </TableCell>
                    <TableCell align={'right'}>
                      <Button
                        variant={'outlined'}
                        onClick={() => handleEditUser(user)}
                        size={'small'}
                        color={'success'}
                        sx={{ m: 1 }}
                      >
                        <Edit />
                      </Button>
                      <Button
                        variant={'outlined'}
                        onClick={() => handleDeleteUser(user.id)}
                        size={'small'}
                        color={'primary'}
                        sx={{ m: 1 }}
                      >
                        <Delete />
                      </Button>
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
