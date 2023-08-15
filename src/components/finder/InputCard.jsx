import { Search, Upload } from '@mui/icons-material'
import {
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react'
import PDFExtractor from './PDFExtractor'

const InputCard = () => {
  const [openPDFExtractor, setOpenPDFExtractor] = useState(false)

  return (
    <Card sx={{ minHeight: '100%' }}>
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
          <TextField
            label={'Título'}
            id={'title'}
            placeholder={
              'Ingrese el título del texto a claseficar o bien, puede subir un PDF'
            }
            fullWidth
          />
          <TextField
            label={'Resumen'}
            id={'textToClassify'}
            placeholder={
              'Ingrese el texto del que desea obtener el vocabulario controlado, o bien puede pasar directamente el PDF pulsando el botón de abajo.'
            }
            multiline
            rows={20}
            fullWidth
          />
        </FormControl>
      </CardContent>
      <Box sx={{ display: 'flex', alignItems: 'between', px: 1, pb: 1 }}>
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
          variant={'contained'}
          startIcon={<Search />}
          sx={{ ml: 'auto' }}
        >
          Clasificar
        </Button>
      </Box>
      <PDFExtractor
        open={openPDFExtractor}
        onClose={() => setOpenPDFExtractor(false)}
      />
    </Card>
  )
}
export default InputCard
