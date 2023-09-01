import { Add } from '@mui/icons-material'
import { Button, Card, CardContent, CardHeader } from '@mui/material'
import React from 'react'
import AuthoritiesTable from '../../components/admin/authorities/AuthoritiesTable'
import AuthorityDialog from '../../components/admin/authorities/AuthorityDialog'
import ConfirmationDialog from '../../components/common/ConfirmationDialog'
import useAuthorities from '../../hooks/useAuthorities'

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
  console.log({ openConfirmation })
  return (
    <div>
      <Card sx={{ pb: 0 }}>
        <CardHeader
          title={'Listas de autoridad'}
          action={
            <Button
              variant={'outlined'}
              color={'primary'}
              size={'small'}
              onClick={() => setOpenAuthorityModal(true)}
            >
              <Add />
            </Button>
          }
        />
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
