import { Add } from '@mui/icons-material'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import UserDialog from '../../components/admin/users/UserDialog'
import UsersTable from '../../components/admin/users/UsersTable'
import ConfirmationDialog from '../../components/common/ConfirmationDialog'
import useNotification from '../../hooks/useNotification'
import ApiConnection from '../../utils/apiConnection'
import useUsers from '../../hooks/useUsers'
import {
  SelectValidator,
  TextValidator,
  ValidatorForm,
} from 'react-material-ui-form-validator'

const userTemplate = {
  fistName: '',
  lastName: '',
  email: '',
  isAdmin: false,
}

const Users = () => {
  const {
    isAdmin,
    setIsAdmin,
    user,
    setUser,
    showModal,
    setShowModal,
    users,
    loadingUsers,
    page,
    setPage,
    search,
    setSearch,
    saveUser,
    loadingSaveUser,
    deleteUser,
    rows,
    setRows,
  } = useUsers()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleDeleteUser = (user) => {
    setUser(user)
    setDeleteDialogOpen(true)
  }

  const handleEditUser = (user) => {
    setUser(user)
    setShowModal(true)
  }

  const handleConfirmDelete = async () => {
    deleteUser(user)
    handleCloseDeleteDialog()
  }

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
  }

  const handleCloseDialog = () => {
    setShowModal(false)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setUser((prevValues) => ({
      ...prevValues,
      [name]: value,
    }))
  }

  return (
    <>
      <Card>
        <CardHeader
          title={
            <div style={{ display: 'flex' }}>
              Usuarios
              <Box
                sx={{
                  display: { xs: 'none', md: 'none', lg: 'none', xl: 'flex' },
                  width: '100%',
                }}
              >
                <ValidatorForm
                  onSubmit={() => {}}
                  style={{
                    display: 'flex',
                    width: '100%',
                    padding: 0,
                    margin: 0,
                  }}
                >
                  <div style={{ marginLeft: 'auto', paddingRight: 250 }}>
                    <SelectValidator
                      sx={{ minWidth: 250 }}
                      id={'isAdmin'}
                      label={'Tipo de usuario'}
                      labelid={'admin-label'}
                      name={'isAdmin'}
                      value={isAdmin}
                      onChange={(e) => setIsAdmin(e.target.value)}
                    >
                      <MenuItem value={-1}>Todos</MenuItem>
                      <MenuItem value={1}>Administrador</MenuItem>
                      <MenuItem value={0}>Estandar</MenuItem>
                    </SelectValidator>
                  </div>
                  <div style={{ marginRight: 'auto' }}>
                    <TextValidator
                      sx={{ minWidth: 350 }}
                      label={'Buscar'}
                      variant={'outlined'}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </ValidatorForm>
              </Box>
            </div>
          }
          action={
            <Tooltip title={'Agregar usuario'}>
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
            loading={loadingUsers}
            page={page}
            setPage={setPage}
            rowsPerPage={rows}
            setRowsPerPage={setRows}
          />
        </CardContent>
      </Card>
      <UserDialog
        open={showModal}
        onClose={handleCloseDialog}
        onSave={saveUser}
        formValues={user}
        loadingEdition={loadingSaveUser}
        handleChange={handleChange}
      />
      <ConfirmationDialog
        title={'Eliminar usuario'}
        message={'¿Está seguro que desea borrar este usuario?'}
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        loadingEdition={loadingSaveUser}
        cancelButtonText={'Cancelar'}
        confirmButtonText={'Eliminar'}
      />
    </>
  )
}

export default Users
