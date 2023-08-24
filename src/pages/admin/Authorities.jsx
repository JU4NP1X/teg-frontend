import { Button, Card, CardContent, CardHeader } from '@mui/material'
import React, { useState } from 'react'
import AuthoritiesTable from '../../components/admin/authorities/AuthoritiesTable'
import AuthorityDialog from '../../components/admin/authorities/AuthorityDialog'
import ConfirmationDialog from '../../components/common/ConfirmationDialog'

const authoritiesData = [
  {
    name: 'Autoridad 1',
    lastTrainingDate: '2023-08-15',
    color: '#000000',
    trainingData: 20,
    updatedCategories: 20,
    deprecatedCategories: 20,
    newUntrainedCategories: 20,
    theoreticalAccuracy: {
      sufficientCategories: 70,
      insufficientCategories: 30,
    },
    practicalAccuracy: {
      sufficientCategories: 70,
      insufficientCategories: 30,
    },
    trainStep: {
      stepNumber: 1,
      progress: 50,
      status: 'IN_PROGRESS',
    },
  },
]

const authorityTemplate = {
  name: '',
  color: 'ffffff',
  csvFile: null,
}

const Authorities = () => {
  const [authority, setAuthority] = useState(authorityTemplate)
  const [authorities, setAuthorities] = useState(authoritiesData)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingFile, setLoadingFile] = useState(false)
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [authorityToDelete, setAuthorityToDelete] = useState(null)
  const [openAuthorityModal, setOpenAuthorityModal] = useState(false)

  const handleAddAuthority = () => {
    const newAuthority = {
      ...authority,
      lastTrainingDate: '',
      trainingData: '',
      theoreticalAccuracy: {
        sufficientCategories: 0,
        untrainedCategories: 0,
      },
      practicalAccuracy: {
        sufficientCategories: 0,
        untrainedCategories: 0,
      },
    }
    setAuthorities([...authorities, newAuthority])
    setAuthority(authorityTemplate)
    setOpenAuthorityModal(false)
  }

  const handleDeleteAuthority = (authority) => {
    setAuthorityToDelete(authority)
    setOpenConfirmation(true)
  }

  const handleConfirmDelete = () => {
    setAuthorities(authorities.filter((item) => item !== authorityToDelete))
    setAuthorityToDelete(null)
    setOpenConfirmation(false)
  }

  const handleCancelDelete = () => {
    setAuthorityToDelete(null)
    setOpenConfirmation(false)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleUpdateAuthority = (authority) => {
    setAuthority(authority)
    setOpenAuthorityModal(true)
  }

  const handleReTrain = () => {
    // Implementar lógica para activar/desactivar autoridad
  }

  return (
    <div>
      <Card sx={{ pb: 0 }}>
        <CardHeader title={'Listas de autoridad'} />
        <CardContent style={{ paddingBottom: 0 }}>
          <AuthoritiesTable
            authorities={authorities}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            handleDeleteAuthority={handleDeleteAuthority}
            handleUpdateAuthority={handleUpdateAuthority}
            handleReTrain={handleReTrain}
          />
          {isLoading && (
            <div>{/* Lógica para mostrar el indicador de carga */}</div>
          )}

          <ConfirmationDialog
            cancelButtonText={'Cancelar'}
            confirmButtonText={'Eliminar'}
            title={'Confirmar eliminación'}
            message={'¿Estás seguro de que deseas eliminar esta autoridad?'}
            open={openConfirmation}
            onClose={handleCancelDelete}
            onConfirm={handleConfirmDelete}
          />
          <AuthorityDialog
            open={openAuthorityModal}
            onClose={() => {
              setAuthority(authorityTemplate)
              setOpenAuthorityModal(false)
            }}
            onSubmit={handleAddAuthority}
            authority={authority}
            setAuthority={setAuthority}
            authorityTemplate={authorityTemplate}
            setLoadingFile={setLoadingFile}
          />
          <Button
            variant={'contained'}
            color={'primary'}
            onClick={() => setOpenAuthorityModal(true)}
            style={{ marginTop: -70, marginLeft: 4, marginBottom: 0 }}
          >
            Agregar Autoridad
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Authorities
