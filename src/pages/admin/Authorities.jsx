import { Add } from '@mui/icons-material'
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip,
} from '@mui/material'
import React from 'react'
import AuthoritiesTable from '../../components/admin/authorities/AuthoritiesTable'
import AuthorityDialog from '../../components/admin/authorities/AuthorityDialog'
import ConfirmationDialog from '../../components/common/ConfirmationDialog'
import useAuthorities from '../../hooks/useAuthorities'
import Monitor from '../../components/admin/authorities/Mionitor'

const Authorities = () => {
  const {
    setOpenAuthorityModal,
    openConfirmation,
    setAuthorityToDelete,
    deleteAuthority,
    setOpenConfirmation,
  } = useAuthorities()

  const handleConfirmDelete = () => {
    deleteAuthority()
  }

  const handleCancelDelete = () => {
    setAuthorityToDelete(null)
    setOpenConfirmation(false)
  }
  return (
    <div>
      <Card sx={{ pb: 0 }}>
        <CardHeader
          title={
            <div style={{ display: 'flex' }}>
              Autoridades
              <Monitor />
            </div>
          }
          action={
            <Tooltip title={'Agregar autoridad'}>
              <IconButton
                color={'primary'}
                size={'small'}
                onClick={() => setOpenAuthorityModal(true)}
                sx={{ mr: 1 }}
              >
                <Add />
              </IconButton>
            </Tooltip>
          }
        ></CardHeader>
        <CardContent style={{ paddingBottom: 0 }}>
          <AuthoritiesTable />

          <ConfirmationDialog
            cancelButtonText={'Cancelar'}
            confirmButtonText={'Eliminar'}
            title={'Confirmar eliminación'}
            message={'¿Estás seguro de que deseas eliminar esta autoridad?'}
            open={openConfirmation}
            onClose={handleCancelDelete}
            onConfirm={handleConfirmDelete}
          />
          <AuthorityDialog />
        </CardContent>
      </Card>
    </div>
  )
}

export default Authorities
