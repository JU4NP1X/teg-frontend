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
} from '@mui/material'
import { useState } from 'react'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import useClassifier from '../../hooks/useClassifier'
import PDFExtractor from './PDFExtractor'

const InputCard = () => {
  const [openPDFExtractor, setOpenPDFExtractor] = useState(false)
  const [summaryFocus, setSummaryFocus] = useState(false)
  const [titleFocus, setTitleFocus] = useState(false)
  const {
    authorities,
    loadingAuthorities,
    summary,
    setSummary,
    title,
    setTitle,
    classify,
    authority,
    setAuthority,
  } = useClassifier()

  const handleSubmit = (event) => {
    classify()
  }
  return (
    <Card sx={{ minHeight: '100%' }}>
      <CardHeader title={'Documento a clasificar'} />
      <ValidatorForm onSubmit={handleSubmit}>
        <CardContent>
          <FormControl
            size={'small'}
            fullWidth
            style={{ height: 'calc(100vh - 270px)' }}
          >
            <Autocomplete
              getOptionLabel={({ name }) => name}
              options={authorities}
              loading={loadingAuthorities}
              value={authority}
              onChange={(event, value) => {
                setAuthority(value)
              }}
              renderInput={(params) => {
                return (
                  <TextValidator
                    {...params}
                    label={'Lista de autoridad'}
                    validators={['required']}
                    errorMessages={['Este campo es requerido']}
                    value={authority}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingAuthorities ? (
                            <CircularProgress
                              color={'inherit'}
                              size={20}
                              sx={{ mt: '-10px' }}
                            />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )
              }}
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
              onFocus={(event) => setTitleFocus(true)}
              onBlur={(event) => setTitleFocus(false)}
              InputLabelProps={{
                shrink: title !== '' || titleFocus,
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
              onFocus={(event) => setSummaryFocus(true)}
              onBlur={(event) => {
                setSummaryFocus(false)
              }}
              InputLabelProps={{
                shrink: summary !== '' || summaryFocus,
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
            type={'submit'}
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
