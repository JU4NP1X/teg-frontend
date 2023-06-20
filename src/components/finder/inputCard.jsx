import { Search, Upload } from '@mui/icons-material'
import { Button, Card, CardContent, TextField } from '@mui/material'
import { Box } from '@mui/system'

const InputCard = () => {

  return (
    <Card>
      <CardContent >
        <TextField
          id='textToClassify'
          placeholder='Ingrese el texto del que desea obtener el vocabulario controlado, o bien puede pasar directamente el PDF pulsando el botón de abajo.'
          multiline
          rows={20}
          fullWidth
        />
      </CardContent>
      <Box sx={{ display: 'flex', alignItems: 'between', px: 1, pb: 1 }}>
        <Button variant='outlined' startIcon={<Upload />}>
          Subir PDF
        </Button>
        <Button variant='contained' startIcon={<Search />} sx={{ ml: 'auto' }}>
          Buscar
        </Button>
      </Box>
    </Card>
  )
}
export default InputCard