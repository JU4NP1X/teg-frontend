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
import useAuthorities from '../../../hooks/useAuthorities'
import FileUploader from '../../common/FileUploader'

const authorityTemplate = {
  name: '',
  color: null,
  active: true,
}

const AuthorityDialog = ({}) => {
  const {
    addAuthority,
    authority,
    setAuthority,
    setOpenAuthorityModal,
    setLoadingFile,
    updateAuthority,
    openAuthorityModal,
  } = useAuthorities()
  const handleCancel = () => {
    setAuthority(authorityTemplate)
    onClose()
  }
  const onClose = () => {
    setOpenAuthorityModal(false)
    setAuthority({})
  }
  const handleAddAuthority = () => {
    if (authority.id) {
      updateAuthority()
    } else {
      addAuthority()
    }
  }
  return (
    <Dialog
      open={openAuthorityModal}
      onClose={handleCancel}
      aria-labelledby={'form-dialog-title'}
      fullWidth
    >
      <DialogTitle id={'form-dialog-title'}>
        {authority.id ? 'Modificar autoridad' : 'Agregar Autoridad'}
      </DialogTitle>
      <ValidatorForm onSubmit={handleAddAuthority}>
        <DialogContent>
          <TextValidator
            autoFocus
            margin={'dense'}
            id={'name'}
            label={'Nombre'}
            type={'text'}
            fullWidth
            value={authority.name}
            onChange={(e) =>
              setAuthority({ ...authority, name: e.target.value })
            }
            disabled={authority.native}
            validators={['required']}
            errorMessages={['Este campo es requerido']}
          />

          <TextValidator
            autoFocus
            margin={'dense'}
            id={'color'}
            label={'Color'}
            type={'color'}
            fullWidth
            value={authority.color}
            onChange={(e) =>
              setAuthority({ ...authority, color: e.target.value })
            }
            validators={['required']}
            errorMessages={['Este campo es requerido']}
          />
          {!authority.native && (
            <FileUploader
              buttonText={'Haz click o arrastra un .csv con las categorías'}
              isLoading={setLoadingFile}
              fileTypes={['.csv']}
              onFileUpload={(file) =>
                setAuthority({ ...authority, csvFile: file })
              }
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            disabled={!authority.csvFile && !authority.id}
            type={'submit'}
            color={'primary'}
          >
            {!authority.id ? 'Agregar' : 'Guardar'}
          </Button>
        </DialogActions>
      </ValidatorForm>
    </Dialog>
  )
}

export default AuthorityDialog
