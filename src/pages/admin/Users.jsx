import { Button, Card, CardContent, CardHeader } from '@mui/material'
import React, { useEffect, useState } from 'react'
import UserDialog from '../../components/admin/users/UserDialog'
import UsersTable from '../../components/admin/users/UsersTable'
import ConfirmationDialog from '../../components/common/ConfirmationDialog'
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
    try {
      const api = ApiConnection()
      setLoading(true)
      if (formValues.id) {
        await api.patch(`/users/list/${formValues.id}/`, formValues)
      } else {
        await api.post('/users/list/', formValues)
      }
      fetchUsers()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }))
  }

  const fetchUsers = async () => {
    try {
      const api = ApiConnection()
      setLoading(true)
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
        <CardHeader title={'Usuarios'} />
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
          <Button
            onClick={() => {
              handleEditUser(userTemplate)
            }}
            variant={'contained'}
            sx={{ mt: -10, ml: 2 }}
          >
            Agregar usuario
          </Button>
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
