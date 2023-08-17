import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import AuthoritiesTable from '../../components/admin/authorities/AuthoritiesTable'

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
  },
]

const Authorities = () => {
  const [authorities, setAuthorities] = useState(authoritiesData)
  const [newAuthority, setNewAuthority] = useState('')
  const [isClassifierUpdated, setIsClassifierUpdated] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [isLoading, setIsLoading] = useState(false)
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

  const handleToggleAuthority = (authority) => {
    // Implementar lógica para activar/desactivar autoridad
  }

  const handleClassifierUpdate = () => {
    setIsClassifierUpdated(!isClassifierUpdated)
  }

  const handleReTrain = () => {
    // Implementar lógica para activar/desactivar autoridad
  }

  const handleFileInputChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64String = e.target.result.split(',').pop()
        setCsvFile(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64String = e.target.result.split(',').pop()
        setCsvFile(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  return (
    <div>
      <Card>
        <CardContent>
          <Typography variant="h5" component="div">
            Listas de autoridad
          </Typography>
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
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Confirmar eliminación
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                ¿Estás seguro de que deseas eliminar esta autoridad?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDelete} color="primary">
                Cancelar
              </Button>
              <Button onClick={handleConfirmDelete} color="primary" autoFocus>
                Eliminar
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={openAddAuthority}
            onClose={() => setOpenAddAuthority(false)}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Agregar Autoridad</DialogTitle>
            <DialogContent>
              <ValidatorForm onSubmit={handleAddAuthority}>
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
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  style={{
                    width: '99%',
                    height: '200px',
                    border: '1px dashed gray',
                    display: 'flex',
                    placeContent: 'center',
                    placeItems: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    document.getElementById('file-input').click()
                  }}
                >
                  Arrastra aquí el CSV con las categorías o haz click para
                  buscarlo
                  <input
                    id={'file-input'}
                    type={'file'}
                    accept={'.csv'}
                    onChange={handleFileInputChange}
                    style={{ display: 'none' }}
                  />
                </div>
                <Button type="submit" color="primary">
                  Agregar
                </Button>
              </ValidatorForm>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenAddAuthority(false)}>
                Cancelar
              </Button>
            </DialogActions>
          </Dialog>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenAddAuthority(true)}
            style={{ marginTop: -30, marginLeft: 4 }}
          >
            Agregar Autoridad
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Authorities
