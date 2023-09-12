import { Cancel, Category, Upload } from '@mui/icons-material'
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
    showTable,
    setShowTable,
    authorities,
    loadingAuthorities,
    doc,
    setDoc,
    classify,
    authority,
    setAuthority,
    loadingCategories,
    loadingSaveDocument,
  } = useClassifier()

  const handleSubmit = (event) => {
    classify()
  }
  return (
    <>
      <Card sx={{ minHeight: '100%' }}>
        <CardHeader
          title={doc.id ? 'Modificar documento' : 'Agregar documento'}
        />
        <ValidatorForm onSubmit={handleSubmit}>
          <CardContent>
            <FormControl
              size={'small'}
              fullWidth
              style={{ height: 'calc(100vh - 260px)' }}
            >
              <Autocomplete
                getOptionLabel={({ name }) => name}
                renderOption={(props, { name, color }) => {
                  return (
                    <li {...props}>
                      <span
                        className={'dot'}
                        style={{ backgroundColor: color, marginTop: -2 }}
                      />
                      {name}
                    </li>
                  )
                }}
                options={authorities}
                loading={loadingAuthorities}
                value={authority}
                onChange={(event, value) => {
                  setAuthority(value)
                }}
                renderInput={(params) => (
                  <TextValidator
                    {...params}
                    label={'Lista de autoridad'}
                    placeholder={
                      'Selecciona una autoridad de dónde buscar categorías'
                    }
                    validators={['required']}
                    errorMessages={['Este campo es requerido']}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingAuthorities ? (
                            <CircularProgress
                              color={'inherit'}
                              size={24}
                              sx={{ mt: '-10px' }}
                            />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                    value={authority ? authority.name : ''} // Mostrar solo el nombre del valor seleccionado
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
                value={doc.title}
                onChange={(event) =>
                  setDoc({ ...doc, title: event.target.value })
                }
                onFocus={(event) => setTitleFocus(true)}
                onBlur={(event) => setTitleFocus(false)}
                InputLabelProps={{
                  shrink: doc.title !== '' || titleFocus,
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
                value={doc.summary}
                onChange={(event) =>
                  setDoc({ ...doc, summary: event.target.value })
                }
                onFocus={(event) => setSummaryFocus(true)}
                onBlur={(event) => {
                  setSummaryFocus(false)
                }}
                InputLabelProps={{
                  shrink: doc.summary !== '' || summaryFocus,
                }}
              />
            </FormControl>
          </CardContent>
          <CardActions disableSpacing sx={{ pb: 0 }}>
            <Button
              variant={'outlined'}
              startIcon={<Cancel />}
              sx={{ mr: 'auto' }}
              onClick={() => {
                setShowTable(!showTable)
              }}
              disabled={loadingCategories || loadingSaveDocument}
            >
              Cancelar
            </Button>
            <Button
              variant={'outlined'}
              startIcon={<Upload />}
              onClick={() => {
                setOpenPDFExtractor(true)
              }}
              disabled={loadingCategories || loadingSaveDocument}
            >
              {doc.pdf ? 'Modificar' : 'Subir'} PDF
            </Button>
            <Button
              type={'submit'}
              variant={'contained'}
              startIcon={<Category />}
              sx={{ ml: 'auto', width: '250px' }}
              disabled={loadingCategories || loadingSaveDocument}
            >
              Buscar categorías
              {loadingCategories && (
                <CircularProgress color={'inherit'} size={24} sx={{ ml: 2 }} />
              )}
            </Button>
          </CardActions>
        </ValidatorForm>
      </Card>

      <PDFExtractor
        open={openPDFExtractor}
        onClose={() => setOpenPDFExtractor(false)}
      />
    </>
  )
}

export default InputCard
