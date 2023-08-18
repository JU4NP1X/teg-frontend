import { Delete, Edit } from '@mui/icons-material'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material'
import React, { useState } from 'react'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import SimpleBar from 'simplebar-react'

const initialUsers = [
  {
    id: 1,
    email: 'usuario1@example.com',
    firstName: 'Juan',
    lastName: 'Pérez',
  },
  // Resto de los usuarios...
]

const ConfirmationDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <DialogContentText>
          ¿Estás seguro de que deseas eliminar este usuario?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>No</Button>
        <Button onClick={onConfirm}>Sí</Button>
      </DialogActions>
    </Dialog>
  )
}

const Users = () => {
  const [users, setUsers] = useState(initialUsers)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formValues, setFormValues] = useState({
    email: '',
    firstName: '',
    lastName: '',
  })

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleDeleteUser = (userId) => {
    setSelectedUser(userId)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    setUsers(users.filter((user) => user.id !== selectedUser))
    setDeleteDialogOpen(false)
  }

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
  }

  const handleCloseDialog = () => {
    setEditDialogOpen(false)
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setFormValues({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    })
    setEditDialogOpen(true)
  }

  const handleAddUser = () => {
    setSelectedUser(null)
    setFormValues({
      email: '',
      firstName: '',
      lastName: '',
    })
    setEditDialogOpen(true)
  }

  const handleSaveUser = () => {
    const { email, firstName, lastName } = formValues
    const newUser = {
      id: selectedUser ? selectedUser.id : users.length + 1,
      email,
      firstName,
      lastName,
    }

    if (selectedUser) {
      setUsers(
        users.map((user) => (user.id === selectedUser.id ? newUser : user))
      )
    } else {
      setUsers([...users, newUser])
    }

    editDialogOpen(false)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }))
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage)

  return (
    <>
      <Card>
        <CardHeader title={'Administrador de Usuarios'} />
        <CardContent style={{ paddingBottom: 0 }}>
          <TableContainer component={Paper}>
            <SimpleBar style={{ height: 'calc(100vh - 270px)' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Apellido</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? users.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : users
                  ).map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.firstName}</TableCell>
                      <TableCell>{user.lastName}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant={'outlined'}
                          onClick={() => handleEditUser(user)}
                          size={'small'}
                        >
                          <Edit />
                        </Button>
                        <Button
                          variant={'contained'}
                          onClick={() => handleDeleteUser(user.id)}
                          size={'small'}
                          sx={{ ml: 2 }}
                        >
                          <Delete />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </SimpleBar>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25]}
            component={'div'}
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          <Button onClick={handleAddUser} variant={'contained'} sx={{ mt: -7 }}>
            Agregar usuario
          </Button>
        </CardContent>
      </Card>
      <Dialog open={editDialogOpen} onClose={handleCloseDialog} maxWidth={'md'}>
        <DialogTitle>
          {selectedUser ? 'Editar Usuario' : 'Agregar Usuario'}
        </DialogTitle>
        <ValidatorForm onSubmit={handleSaveUser}>
          <DialogContent>
            <DialogContentText width={500}>
              <TextValidator
                label="Email"
                name="email"
                value={formValues.email}
                validators={['required', 'isEmail']}
                errorMessages={['Este campo es requerido', 'Email inválido']}
                onChange={handleChange}
                fullWidth
              />
              <TextValidator
                label="Nombre"
                name="firstName"
                value={formValues.firstName}
                validators={['required']}
                errorMessages={['Este campo es requerido']}
                onChange={handleChange}
                fullWidth
              />
              <TextValidator
                label="Apellido"
                name="lastName"
                value={formValues.lastName}
                validators={['required']}
                errorMessages={['Este campo es requerido']}
                onChange={handleChange}
                fullWidth
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button type="submit">Guardar</Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}

export default Users
