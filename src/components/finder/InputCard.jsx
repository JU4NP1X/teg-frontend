import { Category, Upload } from '@mui/icons-material'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import { useState } from 'react'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'

import PDFExtractor from './PDFExtractor'

const InputCard = () => {
  const [openPDFExtractor, setOpenPDFExtractor] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    // Lógica para clasificar el documento
  }

  return (
    <Card sx={{ minHeight: '100%' }}>
      <CardHeader title={'Documento a clasificar'} />
      <ValidatorForm onSubmit={handleSubmit}>
        <CardContent>
          <FormControl size={'small'} fullWidth>
            <InputLabel>Lista de autoridad emisora</InputLabel>
            <Select
              sx={{ mt: '10px !important' }}
              fullWidth
              value={10}
              label={'Lista de autoridad emisora'}
            >
              <MenuItem value={10}>UNESCO</MenuItem>
            </Select>
            <TextValidator
              label={'Título'}
              id={'title'}
              placeholder={
                'Ingrese el título del texto a claseficar o bien, puede subir un PDF'
              }
              fullWidth
              validators={['required']}
              errorMessages={['Este campo es requerido']}
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
      />
    </Card>
  )
}

export default InputCard
