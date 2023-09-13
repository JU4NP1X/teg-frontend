import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
} from '@mui/material'
import React, { useState } from 'react'
import {
  SelectValidator,
  TextValidator,
  ValidatorForm,
} from 'react-material-ui-form-validator'
import useAuthorities from '../../../hooks/useAuthorities'
import ApiConnection from '../../../utils/apiConnection'
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

  const [downloadingAuthorities, setDownloadingAuthorities] = useState(false)
  const handleCancel = () => {
    setAuthority(authorityTemplate)
    onClose()
  }
  const onClose = () => {
    if (!downloadingAuthorities) {
      setOpenAuthorityModal(false)
      setAuthority({})
    }
  }
  const handleAddAuthority = () => {
    if (authority.id) {
      updateAuthority()
    } else {
      addAuthority()
    }
  }

  const getAuthorityCategories = async () => {
    setDownloadingAuthorities(true)
    const api = ApiConnection()
    const data = await api.get('categories/csv/', {
      params: { authorities: authority.id },
    })

    if (api.status === 200) {
      const { csvData } = data
      downloadCsv(csvData)
      setDownloadingAuthorities(false)
    } else setDownloadingAuthorities(false)
  }

  const downloadCsv = (csvBase64) => {
    const link = document.createElement('a')
    link.href = `data:text/csv;base64,${csvBase64}`
    link.download = 'categories.csv'
    link.click()
  }

  const downloadExample = (csvBase64) => {
    const link = document.createElement('a')
    link.href = `/file/example.csv`
    link.download = 'categories.csv'
    link.click()
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
      <ValidatorForm
        onSubmit={handleAddAuthority}
        style={{ marginBottom: 0, paddingBottom: 0 }}
      >
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
          <Grid container sx={{ m: 0, p: 0 }}>
            <Button
              disabled={downloadingAuthorities}
              color={'primary'}
              sx={{ width: 200 }}
              onClick={() => {
                if (authority.id) getAuthorityCategories()
                else downloadExample()
              }}
            >
              {!downloadingAuthorities &&
                `Descargar ${authority.id ? 'categorías' : 'csv de ejemplo'}`}
              {downloadingAuthorities && (
                <CircularProgress color={'inherit'} size={24} />
              )}
            </Button>
            <Button
              disabled={
                downloadingAuthorities ||
                (!authority.csvBase64 && !authority.id)
              }
              type={'submit'}
              color={'primary'}
              sx={{ ml: 'auto' }}
            >
              {!authority.id ? 'Agregar' : 'Guardar'}
            </Button>
          </Grid>
        </DialogActions>
      </ValidatorForm>
    </Dialog>
  )
}

export default AuthorityDialog
