import {
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import React from 'react'
import useLibrary from '../../hooks/useLibrary'

const Search = ({ handleSearchChange, handleOrderByChange }) => {
  const { search, setSearch } = useLibrary()
  console.log(search)
  return (
    <Card>
      <CardContent>
        <FormControl fullWidth sx={{ marginTop: '10px' }}>
          <Grid container alignItems={'center'} spacing={1}>
            <Grid item xs={9}>
              <TextField
                label={'Buscar'}
                variant={'outlined'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={3}>
              <FormControl
                fullWidth
                size={'small'}
                style={{ marginTop: '15px' }}
              >
                <InputLabel id={'order-by-label'} style={{ top: '-5px' }}>
                  Ordenar por
                </InputLabel>
                <Select
                  label={'Ordenar por'}
                  labelId={'order-by-label'}
                  value={'title'}
                  onChange={handleOrderByChange}
                >
                  <MenuItem value={'title'}>Título</MenuItem>
                  <MenuItem value={'description'}>Descripción</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </FormControl>
        <Button
          variant={'contained'}
          color={'primary'}
          size={'small'}
          style={{ marginTop: '10px', float: 'right', marginBottom: '10px' }}
        >
          Buscar
        </Button>
      </CardContent>
    </Card>
  )
}

export default Search
