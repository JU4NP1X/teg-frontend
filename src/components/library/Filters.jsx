import {
  Autocomplete,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  TextField,
} from '@mui/material'
import React from 'react'
import SimpleBar from 'simplebar-react'
import useLibrary from '../../hooks/useLibrary'

const Filters = () => {
  const {
    filterSearch,
    setFilterSearch,
    loadingAuthorities,
    loadingFilters,
    selectedAuthority,
    setSelectedAuthority,
    authorityList,
    apiFilters,
  } = useLibrary()
  return (
    <Card>
      <CardHeader title={'Filtrar por categoría'} />
      <CardContent>
        <FormControl fullWidth style={{ marginTop: 20, marginBottom: 14 }}>
          <Autocomplete
            id={'controllable-states-demo'}
            getOptionLabel={({ name }) => name}
            options={authorityList}
            loading={loadingAuthorities}
            value={selectedAuthority}
            onChange={(event, value) => {
              console.log(value)
              setSelectedAuthority(value)
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={'Lista de autoridad emisora'}
                value={params.InputProps.value}
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
            )}
          />
          <TextField
            label={'Buscar categoría'}
            variant={'outlined'}
            onChange={(e) => {
              setFilterSearch(e.target.value)
            }}
            fullWidth
            value={filterSearch}
            style={{ marginBottom: '16px' }}
          />
        </FormControl>
        <SimpleBar
          style={{ height: 'calc(100vh - 382px)', border: '1px solid #ccc' }}
        >
          <List>
            {loadingFilters ? (
              <div
                style={{
                  height: '50vh',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <CircularProgress />
              </div>
            ) : (
              apiFilters.map((filter) => (
                <ListItem key={filter.id}>
                  <FormControlLabel
                    control={<Checkbox />}
                    label={filter.name}
                  />
                </ListItem>
              ))
            )}
          </List>
        </SimpleBar>
      </CardContent>
    </Card>
  )
}

export default Filters
