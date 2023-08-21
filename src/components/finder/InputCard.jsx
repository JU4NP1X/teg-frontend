import { Category, Upload } from '@mui/icons-material'
import {
  Autocomplete,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import PDFExtractor from './PDFExtractor'
import ApiConnection from '../../utils/apiConnection'

const InputCard = () => {
  const [openPDFExtractor, setOpenPDFExtractor] = useState(false)
  const [loadingAuthorities, setLoadingAuthorities] = useState(false)
  const [authorities, setAuthorities] = useState([])
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    // Lógica para clasificar el documento
  }

  const getAuthorityList = async () => {
    setLoadingAuthorities(true)
    const api = ApiConnection()
    const data = await api.get('/categories/authorities/')

    setLoadingAuthorities(false)
    setAuthorities(data.results)
    console.log(data)
  }

  useEffect(() => {
    getAuthorityList()
  }, [])

  return (
    <Card sx={{ minHeight: '100%' }}>
      <CardHeader title={'Documento a clasificar'} />
      <ValidatorForm onSubmit={handleSubmit}>
        <CardContent>
          <FormControl
            size={'small'}
            fullWidth
            style={{ height: 'calc(100vh - 250px)' }}
          >
            <Autocomplete
              getOptionLabel={({ name }) => name}
              options={authorities}
              loading={loadingAuthorities}
              renderInput={(params) => (
                <TextValidator
                  {...params}
                  label={'Lista de autoridad emisora'}
                  validators={['required']}
                  errorMessages={['Este campo es requerido']}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingAuthorities ? (
                          <CircularProgress color={'inherit'} size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            <TextValidator
              label={'Título'}
              id={'title'}
              placeholder={
                'Ingrese el título del texto a claseficar o bien, puede subir un PDF'
              }
              fullWidth
              validators={['required']}
              errorMessages={['Este campo es requerido']}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              InputLabelProps={{
                shrink: title !== '',
              }}
            />
            <TextValidator
              label={'Resumen'}
              id={'textToClassify'}
              placeholder={
                'Ingrese el texto del que desea obtener el vocabulario controlado, o bien puede pasar directamente el PDF pulsando el botón de abajo.'
              }
              multiline
              rows={20}
              fullWidth
              validators={['required']}
              errorMessages={['Este campo es requerido']}
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              InputLabelProps={{
                shrink: summary !== '',
              }}
            />
          </FormControl>
        </CardContent>
        <CardActions disableSpacing>
          <Button
            variant={'outlined'}
            startIcon={<Upload />}
            onClick={() => {
              setOpenPDFExtractor(true)
            }}
          >
            Subir PDF
          </Button>
          <Button
            type="submit"
            variant={'contained'}
            startIcon={<Category />}
            sx={{ ml: 'auto' }}
          >
            Clasificar
          </Button>
        </CardActions>
      </ValidatorForm>
      <PDFExtractor
        open={openPDFExtractor}
        onClose={() => setOpenPDFExtractor(false)}
        handleTextExtracted={({ title, summary }) => {
          setTitle(title)
          setSummary(summary)
        }}
      />
    </Card>
  )
}

export default InputCard
