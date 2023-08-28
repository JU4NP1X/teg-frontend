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
import React, { useEffect, useState } from 'react'
import SimpleBar from 'simplebar-react'
import ApiConnection from '../../utils/apiConnection'

const Filters = ({ filters, handleFilterSearchChange }) => {
  const [apiFilters, setApiFilters] = useState([])
  const [authorityList, setAuthorityList] = useState([])
  const [selectedAuthority, setSelectedAuthority] = useState(null)
  const [loadingFilters, setLoadingFilters] = useState(false)
  const [loadingAuthorities, setLoadingAuthorities] = useState(false)

  const fetchFilters = async (signal) => {
    try {
      setLoadingFilters(true)
      const api = ApiConnection()
      const data = await api.get('categories/translations/', {
        params: {
          search: filters.filterSearch,
          language: 'es',
          ordering: 'name',
          authority: selectedAuthority?.id,
        },
        signal,
      })
      if (api.status === 200) {
        setApiFilters(data.results)
        setLoadingFilters(false)
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Búsqueda de filtros cancelada')
      } else {
        console.error('Error al obtener los filtros:', error)
      }
    }
  }

  const fetchAuthorityList = async () => {
    try {
      setLoadingAuthorities(true)
      const api = ApiConnection()
      const data = await api.get('categories/authorities/', {
        params: { excludeCounts: true },
      })
      if (api.status === 200) {
        setAuthorityList(data.results)
        setLoadingAuthorities(false)
      }
    } catch (error) {
      console.error('Error al obtener la lista de autoridad:', error)
    }
  }

  useEffect(() => {
    let abortController = new AbortController()

    fetchFilters(abortController.signal)

    return () => {
      abortController.abort()
    }
  }, [filters.filterSearch, selectedAuthority])

  useEffect(() => {
    fetchAuthorityList()
  }, [])
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
            onInputChange={(event, value) => {
              console.log(value)
              setSelectedAuthority(value)
            }}
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
            value={filters.filterSearch}
            onChange={handleFilterSearchChange}
            fullWidth
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
