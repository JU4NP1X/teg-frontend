import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import React from 'react'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import FileUploader from '../../common/FileUploader'

const AuthorityDialog = ({
  open,
  onClose,
  onSubmit,
  authority,
  setAuthority,
  authorityTemplate,
  setLoadingFile,
}) => {
  const handleCancel = () => {
    setAuthority(authorityTemplate)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {authority.id ? 'Modificar autoridad' : 'Agregar Autoridad'}
      </DialogTitle>
      <ValidatorForm onSubmit={onSubmit}>
        <DialogContent>
          <DialogContentText>
            Por favor, ingresa el nombre y las categorías de la nueva autoridad.
          </DialogContentText>
          <TextValidator
            autoFocus
            margin="dense"
            id="name"
            label="Nombre"
            type="text"
            fullWidth
            value={authority.name}
            onChange={(e) =>
              setAuthority({ ...authority, name: e.target.value })
            }
            validators={['required']}
            errorMessages={['Este campo es requerido']}
          />

          <TextValidator
            autoFocus
            margin="dense"
            id="color"
            label="Color"
            type="color"
            fullWidth
            value={authority.color}
            onChange={(e) =>
              setAuthority({ ...authority, color: e.target.value })
            }
            validators={['required']}
            errorMessages={['Este campo es requerido']}
          />

          <FileUploader
            buttonText="Haz click o arrastra un .csv con las categorías"
            isLoading={setLoadingFile}
            fileTypes={['.csv']}
            onFileUpload={(file) =>
              setAuthority({ ...authority, csvFile: file })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancelar</Button>
          <Button
            disabled={!authority.csvFile && !authority.id}
            type="submit"
            color="primary"
          >
            Agregar
          </Button>
        </DialogActions>
      </ValidatorForm>
    </Dialog>
  )
}

export default AuthorityDialog
