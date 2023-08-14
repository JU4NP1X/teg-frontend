import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useState } from 'react'
import EditUser from '../components/usersAdmin/EditUser'
import TableUsers from '../components/usersAdmin/ListUsers'
import ModalMassiveAddUsers from '../components/usersAdmin/ModalMassiveAddUsers'
import useUsers from '../hooks/useUsers'

const UsersAdmin = () => {
  const [visibleModal, setVisibleModal] = useState(false)
  const [openLoading, setOpenLoading] = useState(false)
  const [visibleMassiveAddUsers, setVisibleMassiveAddUsers] = useState(false)
  const { setUser } = useUsers()

  const content = (
    <>
      <Box sx={{ width: '100%', px: 5 }}>
        <Tooltip
          title={
            <>Administrador de creación, eliminación y edición de usuarios.</>
          }
        >
          <Typography
            className={'layout-not-select'}
            variant={'h5'}
            component={'h2'}
            sx={{ textAlign: 'center', my: 4 }}
          >
            <b>Administrador de usuarios</b>
          </Typography>
        </Tooltip>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div>
            <Tooltip title={'Crear Usuario'}>
              <IconButton
                onClick={() => {
                  setUser({})
                  setVisibleModal(true)
                }}
              >
                <AddCircleOutlineIcon />
              </IconButton>
            </Tooltip>
          </div>
          <div>
            <Tooltip title={'Carga masiva de Usuarios'}>
              <IconButton onClick={() => setVisibleMassiveAddUsers(true)}>
                <FileUploadIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        <TableUsers
          setVisibleModal={setVisibleModal}
          visibleModal={visibleModal}
        />
        {visibleModal ? (
          <EditUser
            visibleModal={visibleModal}
            setVisibleModal={setVisibleModal}
            setOpenLoading={setOpenLoading}
          />
        ) : null}
        <ModalMassiveAddUsers
          setVisibleMassiveAddUsers={setVisibleMassiveAddUsers}
          visibleMassiveAddUsers={visibleMassiveAddUsers}
        />
      </Box>
    </>
  )

  return content
}

export default UsersAdmin
