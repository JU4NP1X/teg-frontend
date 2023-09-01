import { Add } from '@mui/icons-material'
import { Button, Card, CardContent, CardHeader } from '@mui/material'
import React, { useEffect, useState } from 'react'
import UserDialog from '../../components/admin/users/UserDialog'
import UsersTable from '../../components/admin/users/UsersTable'
import ConfirmationDialog from '../../components/common/ConfirmationDialog'
import useNotification from '../../hooks/useNotification'
import ApiConnection from '../../utils/apiConnection'

const userTemplate = {
  fistName: '',
  lastName: '',
  email: '',
  isAdmin: false,
}

const Users = () => {
  const [users, setUsers] = useState({
    count: null,
    next: null,
    previous: null,
    results: [],
  })
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formValues, setFormValues] = useState(userTemplate)
  const [loading, setLoading] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(0)
  const { setSuccessMessage, setErrorMessage } = useNotification()

  const handleDeleteUser = (userId) => {
    setSelectedUser(userId)
    setDeleteDialogOpen(true)
  }

  const handleEditUser = (user) => {
    setFormValues(user)
    setEditDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    try {
      const api = ApiConnection()
      await api.delete(`/users/list/${selectedUser}`)
      fetchUsers()
    } catch (error) {
      console.error(error)
    }
  }

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
  }

  const handleCloseDialog = () => {
    setEditDialogOpen(false)
  }

  const handleSaveUser = async () => {
    const api = ApiConnection()
    if (formValues.id) {
      await api.patch(`/users/list/${formValues.id}/`, formValues)
    } else {
      await api.post('/users/list/', formValues)
    }
    if (api.status === 200) {
      setSuccessMessage(
        `Usuario ${formValues.id ? 'Modificado' : 'Guardado'} exitosamente`
      )

      setEditDialogOpen(false)
      fetchUsers()
    } else
      setErrorMessage(
        `Error al modificar, asegúrese que el correo o el usuario no se encuentren ya en uso`
      )
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }))
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const api = ApiConnection()
      const data = await api.get('/users/list/', {
        params: {
          limit: rowsPerPage,
          offset: page * rowsPerPage,
        },
      })
      setUsers(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [page, rowsPerPage])

  return (
    <>
      <Card>
        <CardHeader
          title={'Usuarios'}
          action={
            <Button
              variant={'outlined'}
              color={'primary'}
              size={'small'}
              onClick={() => handleEditUser(userTemplate)}
            >
              <Add />
            </Button>
          }
        />
        <CardContent>
          <UsersTable
            users={users}
            handleEditUser={handleEditUser}
            handleDeleteUser={handleDeleteUser}
            loading={loading}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
          />
        </CardContent>
      </Card>
      <UserDialog
        open={editDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveUser}
        formValues={formValues}
        handleChange={handleChange}
      />
      <ConfirmationDialog
        title={'Eliminar usuario'}
        message={'¿Está seguro que desea borrar este usuario?'}
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        cancelButtonText={'Cancelar'}
        confirmButtonText={'Eliminar'}
      />
    </>
  )
}

export default Users
