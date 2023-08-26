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
    <TableContainer component={Paper}>
      <SimpleBar
        onTouchStart={(e) => {
          e.stopPropagation()
        }}
        style={{ height: 'calc(100vh - 270px)' }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '20%' }}>Email</TableCell>
              <TableCell style={{ width: '20%' }}>Usuario</TableCell>
              <TableCell style={{ width: '20%' }}>Nombre</TableCell>
              <TableCell style={{ width: '20%' }}>Apellido</TableCell>
              <TableCell align={'center'} style={{ width: '10%' }}>
                Administrador
              </TableCell>
              <TableCell align={'right'} style={{ width: '10%' }}>
                Acciones
              </TableCell>
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
                      sx={{ m: 1 }}
                    >
                      <Edit />
                    </Button>
                    <Button
                      variant={'contained'}
                      onClick={() => handleDeleteUser(user.id)}
                      size={'small'}
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
                  colSpan={6}
                  align={'center'}
                  style={{ height: 'calc(100vh - 380px)' }}
                >
                  <CircularProgress />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </SimpleBar>
      <TablePagination
        rowsPerPageOptions={[10, 25]}
        component={'div'}
        count={users.count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  )
}

export default UsersTable
