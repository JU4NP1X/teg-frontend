import {
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Tooltip,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
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
  active: false,
  disabled: false,
  autoSync: true,
}

const AuthorityDialog = ({}) => {
  const {
    addAuthority,
    authority,
    setAuthority,
    setOpenAuthorityModal,
    loadingAction,
    setLoadingFile,
    updateAuthority,
    openAuthorityModal,
    systemInfo,
  } = useAuthorities()

  const [downloadingAuthorities, setDownloadingAuthorities] = useState(false)
  const [ramAvailable, setRamAvailable] = useState(0)
  const [authorityIsActive, setAuhorityIsActive] = useState(authority.active)

  const handleCancel = () => {
    if (!downloadingAuthorities && !loadingAction) {
      setAuthority(authorityTemplate)
      onClose()
    }
  }
  const onClose = () => {
    if (!downloadingAuthorities && !loadingAction) {
      setOpenAuthorityModal(false)
      setAuthority(authorityTemplate)
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
    const data = await api.post('categories/csv/', {
      authorityId: authority.id,
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

  useEffect(() => {
    const calculateRamAvailable = () => {
      const available =
        systemInfo.ram.total -
        (systemInfo.ram.percent * systemInfo.ram.total) / 100
      setRamAvailable(available)
    }

    calculateRamAvailable()
  }, [systemInfo])
  useEffect(() => {
    setAuhorityIsActive(authority.active)
  }, [authority.id])
  return (
    <Dialog
      open={openAuthorityModal}
      onClose={handleCancel}
      aria-labelledby={'form-dialog-title'}
      fullWidth
    >
      <DialogTitle
        id={'form-dialog-title'}
        sx={{ display: 'flex', verticalAlign: 'center' }}
      >
        {authority.id ? 'Modificar autoridad' : 'Agregar Autoridad'}{' '}
        {authority.native && (
          <Tooltip
            title={
              'Modificación limitada: 1. No se puede cambiar el nombre. 2. El cambio de categorías solo permite cambiar la traducción. 3. No es posible de eliminar por limitaciones estructurales del sistema.'
            }
            sx={{ ml: 'auto' }}
          >
            <Chip label={'Nativa'} color={'info'} />
          </Tooltip>
        )}
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

          <FileUploader
            buttonText={'Haz click o arrastra un .csv con las categorías'}
            isLoading={setLoadingFile}
            fileTypes={['.csv']}
            onFileUpload={(file) =>
              setAuthority({ ...authority, csvBase64: file })
            }
          />

          <SelectValidator
            id={'active'}
            label={'¿Activar predictor?'}
            labelid={'admin-label'}
            name={'active'}
            value={authority.active}
            validators={['required']}
            errorMessages={['Este campo es requerido']}
            onChange={(e) =>
              setAuthority({ ...authority, active: e.target.value })
            }
            fullWidth
            disabled={authority.disabled || !authority.lastTrainingDate}
          >
            <MenuItem
              value={true}
              disabled={
                ramAvailable < 2.1 * 1024 * 1024 * 1024 && !authorityIsActive
              }
            >
              Sí{' '}
              {ramAvailable < 2.1 * 1024 * 1024 * 1024 &&
                !authorityIsActive &&
                `- Requiere: 2 GB de RAM. Se tiene: 
              ${Math.floor(
                ramAvailable / (1024 * 1024 * 1024) - 0.1
              )} GB disponible`}
            </MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </SelectValidator>

          <SelectValidator
            id={'disabled'}
            label={'¿Desea que sincronice automáticamente?'}
            labelid={'admin-label'}
            name={'disabled'}
            value={authority.autoSync}
            disabled={authority.disabled}
            validators={['required']}
            errorMessages={['Este campo es requerido']}
            onChange={(e) =>
              setAuthority({ ...authority, autoSync: e.target.value })
            }
            fullWidth
          >
            <MenuItem value={true}>Sí</MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </SelectValidator>

          <SelectValidator
            id={'disabled'}
            label={'¿Está deshabilitado?'}
            labelid={'admin-label'}
            name={'disabled'}
            value={authority.disabled}
            disabled={authority.active || authority.autoSync}
            validators={['required']}
            errorMessages={['Este campo es requerido']}
            onChange={(e) =>
              setAuthority({ ...authority, disabled: e.target.value })
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
                loadingAction ||
                downloadingAuthorities ||
                (!authority.csvBase64 && !authority.id)
              }
              type={'submit'}
              color={'primary'}
              sx={{ ml: 'auto' }}
            >
              {loadingAction ? (
                <CircularProgress size={24} />
              ) : !authority.id ? (
                'Agregar'
              ) : (
                'Guardar'
              )}
            </Button>
          </Grid>
        </DialogActions>
      </ValidatorForm>
    </Dialog>
  )
}

export default AuthorityDialog
