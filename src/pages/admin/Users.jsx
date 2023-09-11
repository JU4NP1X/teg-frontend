import { Add } from '@mui/icons-material'
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip,
} from '@mui/material'
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
  const [loadingEdition, setLoadingEdition] = useState(false)
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
      setLoadingEdition(true)
      const api = ApiConnection()
      await api.delete(`/users/list/${selectedUser}`)
      if (api.status < 400) {
        fetchUsers()
        setLoadingEdition(false)
        setDeleteDialogOpen(false)
        setSuccessMessage('Usuario borrado exitosamente')
      } else setErrorMessage('Error al realizar la acción')
    } catch (error) {
      setLoadingEdition(false)
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
    setLoadingEdition(true)
    const api = ApiConnection()
    if (formValues.id) {
      await api.patch(`/users/list/${formValues.id}/`, formValues)
    } else {
      await api.post('/users/list/', formValues)
    }
    if (api.status < 400) {
      setSuccessMessage(
        `Usuario ${formValues.id ? 'Modificado' : 'Guardado'} exitosamente`
      )

      setEditDialogOpen(false)
      fetchUsers()
      setLoadingEdition(false)
    } else {
      setErrorMessage(
        `Error al ${
          formValues.id ? 'modificar' : 'crear'
        } el usuario, asegúrese que el correo o el nombre de usuario no se encuentren ya en uso`
      )
      setLoadingEdition(false)
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
            <Tooltip title="Agregar usuario">
              <IconButton
                color={'primary'}
                size={'small'}
                onClick={() => handleEditUser(userTemplate)}
                sx={{ mr: 1 }}
              >
                <Add />
              </IconButton>
            </Tooltip>
          }
        />
        <CardContent style={{ paddingBottom: 0 }}>
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
        loadingEdition={loadingEdition}
        handleChange={handleChange}
      />
      <ConfirmationDialog
        title={'Eliminar usuario'}
        message={'¿Está seguro que desea borrar este usuario?'}
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        loadingEdition={loadingEdition}
        cancelButtonText={'Cancelar'}
        confirmButtonText={'Eliminar'}
      />
    </>
  )
}

export default Users
