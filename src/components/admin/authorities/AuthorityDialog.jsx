import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
} from '@mui/material'
import React from 'react'
import {
  SelectValidator,
  TextValidator,
  ValidatorForm,
} from 'react-material-ui-form-validator'
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
                setAuthority({ ...authority, csvBase64: file })
              }
            />
          )}

          <SelectValidator
            id={'active'}
            label={'¿Está activo?'}
            labelid={'admin-label'}
            name={'active'}
            value={authority.active}
            validators={['required']}
            errorMessages={['Este campo es requerido']}
            onChange={(e) =>
              setAuthority({ ...authority, active: e.target.value })
            }
            fullWidth
          >
            <MenuItem value={true}>Sí</MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </SelectValidator>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={!authority.csvBase64 && !authority.id}
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
