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
    setApiFilters,
    selectedFilters,
    setSelectedFilters,
  } = useLibrary()
  const handleFilterChange = (filter) => {
    let index = selectedFilters.indexOf(filter)
    if (index === -1) setSelectedFilters([...selectedFilters, filter])
    else
      setSelectedFilters(selectedFilters.filter(({ id }) => id !== filter.id))
  }
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
                label={'Lista de autoridad'}
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
          style={{
            height: 'calc(100vh - 382px)',
            border: '1px solid #ccc',
            borderRadius: 4,
          }}
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
              [
                ...selectedFilters,
                ...apiFilters.filter(
                  (filter) => !selectedFilters.includes(filter)
                ),
              ].map((filter) => (
                <ListItem key={filter.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedFilters.includes(filter)}
                        onChange={() => handleFilterChange(filter)}
                      />
                    }
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
