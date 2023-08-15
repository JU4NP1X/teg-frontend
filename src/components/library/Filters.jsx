import {
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import SimpleBar from 'simplebar-react'

const Filters = ({ filters, handleFilterSearchChange }) => {
  const [apiFilters, setApiFilters] = useState([])
  const [authorityList, setAuthorityList] = useState([])

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await axios.get('URL_DE_LA_API/filters', {
          params: {
            search: filters.filterSearch,
          },
        })
        setApiFilters(response.data)
      } catch (error) {
        console.error('Error al obtener los filtros:', error)
      }
    }

    const fetchAuthorityList = async () => {
      try {
        const response = await axios.get('URL_DE_LA_API/authorityList')
        setAuthorityList(response.data)
      } catch (error) {
        console.error('Error al obtener la lista de autoridad:', error)
      }
    }

    fetchFilters()
    fetchAuthorityList()
  }, [filters.filterSearch])

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Filtrar por categoría</Typography>
        <FormControl fullWidth style={{ marginTop: 20, marginBottom: 14 }}>
          <InputLabel id="authority-list" style={{ top: '-12px' }}>
            Lista de autoridad
          </InputLabel>
          <Select
            labelId="authority-list"
            label="Lista de autoridad"
            value={filters.authority}
            onChange={(event) => handleFilterSearchChange(event.target.value)}
          >
            {authorityList.map((authority) => (
              <MenuItem key={authority.id} value={authority.id}>
                {authority.name}
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="Buscar categoría"
            variant="outlined"
            value={filters.filterSearch}
            onChange={handleFilterSearchChange}
            fullWidth
            style={{ marginBottom: '16px' }}
          />
        </FormControl>
        <SimpleBar style={{ height: '50vh', border: '1px solid #ccc' }}>
          <List>
            {apiFilters.map((filter) => (
              <ListItem key={filter.id}>
                <FormControlLabel control={<Checkbox />} label={filter.name} />
              </ListItem>
            ))}
          </List>
        </SimpleBar>
      </CardContent>
    </Card>
  )
}

export default Filters
