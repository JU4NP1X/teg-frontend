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
} from '@mui/material'
import React, { useState } from 'react'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import AuthoritiesTable from '../../components/admin/authorities/AuthoritiesTable'
import FileUploader from '../../components/__common/FileUploader'

const authoritiesData = [
  {
    name: 'Autoridad 1',
    lastTrainingDate: '2023-08-15',
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

const Authorities = () => {
  const [authorities, setAuthorities] = useState(authoritiesData)
  const [newAuthority, setNewAuthority] = useState('')
  const [isClassifierUpdated, setIsClassifierUpdated] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingFile, setLoadingFile] = useState(false)
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [authorityToDelete, setAuthorityToDelete] = useState(null)
  const [openAddAuthority, setOpenAddAuthority] = useState(false)
  const [newAuthorityName, setNewAuthorityName] = useState('')
  const [newAuthorityCategories, setNewAuthorityCategories] = useState('')
  const [csvFile, setCsvFile] = useState(null)

  const handleAddAuthority = () => {
    if (
      newAuthorityName.trim() !== '' &&
      newAuthorityCategories.trim() !== ''
    ) {
      const newAuthority = {
        name: newAuthorityName,
        categories: newAuthorityCategories,
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
      setNewAuthorityName('')
      setNewAuthorityCategories('')
      setOpenAddAuthority(false)
    }
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
            handleReTrain={handleReTrain}
          />
          {isLoading && (
            <div>{/* Lógica para mostrar el indicador de carga */}</div>
          )}
          <Dialog
            open={openConfirmation}
            onClose={handleCancelDelete}
            aria-labelledby={'alert-dialog-title'}
            aria-describedby={'alert-dialog-description'}
          >
            <DialogTitle id={'alert-dialog-title'}>
              Confirmar eliminación
            </DialogTitle>
            <DialogContent>
              <DialogContentText id={'alert-dialog-description'}>
                ¿Estás seguro de que deseas eliminar esta autoridad?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDelete} color={'primary'}>
                Cancelar
              </Button>
              <Button onClick={handleConfirmDelete} color={'primary'} autoFocus>
                Eliminar
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={openAddAuthority}
            onClose={() => setOpenAddAuthority(false)}
            aria-labelledby={'form-dialog-title'}
          >
            <DialogTitle id={'form-dialog-title'}>
              Agregar Autoridad
            </DialogTitle>
            <ValidatorForm onSubmit={handleAddAuthority}>
              <DialogContent>
                <DialogContentText>
                  Por favor, ingresa el nombre y las categorías de la nueva
                  autoridad.
                </DialogContentText>
                <TextValidator
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Nombre"
                  type="text"
                  fullWidth
                  value={newAuthorityName}
                  onChange={(e) => setNewAuthorityName(e.target.value)}
                  validators={['required']}
                  errorMessages={['Este campo es requerido']}
                />
                <FileUploader
                  buttonText={'Haz click o arrastra un .csv con las categorías'}
                  isLoading={setLoadingFile}
                  fileTypes={['.csv']}
                  onFileUpload={setCsvFile}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenAddAuthority(false)}>
                  Cancelar
                </Button>
                <Button
                  disabled={csvFile === null}
                  type={'submit'}
                  color={'primary'}
                >
                  Agregar
                </Button>
              </DialogActions>
            </ValidatorForm>
          </Dialog>
          <Button
            variant={'contained'}
            color={'primary'}
            onClick={() => setOpenAddAuthority(true)}
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
