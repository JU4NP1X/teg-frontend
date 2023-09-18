import {
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  MenuItem,
} from '@mui/material'
import React, { useState } from 'react'
import {
  SelectValidator,
  TextValidator,
  ValidatorForm,
} from 'react-material-ui-form-validator'
import useLibrary from '../../hooks/useLibrary'

const Search = () => {
  const { setSearch, ordering, setOrdering } = useLibrary()
  const [searchDocument, setSearchDocument] = useState('')
  return (
    <Card>
      <CardContent style={{ paddingBottom: 0 }}>
        <FormControl fullWidth sx={{ marginTop: '10px' }}>
          <ValidatorForm onSubmit={() => setSearch(searchDocument)}>
            <Grid container alignItems={'center'} spacing={1}>
              <Grid item xs={9}>
                <TextValidator
                  label={'Buscar'}
                  variant={'outlined'}
                  value={searchDocument}
                  onChange={(e) => setSearchDocument(e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid item xs={3}>
                <SelectValidator
                  label={'Ordenar por'}
                  labelid={'order-by-label'}
                  value={ordering}
                  onChange={(e) => {
                    setOrdering(e.target.value)
                  }}
                  fullWidth
                >
                  <MenuItem value={'title'}>Título</MenuItem>
                  <MenuItem value={'-num_of_access'}>Popularidad</MenuItem>
                </SelectValidator>
              </Grid>
            </Grid>
            <Button
              variant={'contained'}
              type={'submit'}
              color={'primary'}
              size={'small'}
              style={{
                marginTop: '10px',
                float: 'right',
              }}
            >
              Buscar
            </Button>
          </ValidatorForm>
        </FormControl>
      </CardContent>
    </Card>
  )
}

export default Search
