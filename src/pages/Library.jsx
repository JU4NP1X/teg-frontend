import { Grid } from '@mui/material'
import { useState } from 'react'
import SimpleBar from 'simplebar-react/dist'
import Documents from '../components/library/Documents'
import Filters from '../components/library/Filters'
import Pagination from '../components/library/Pagination'
import Search from '../components/library/Search'

const data = [
  {
    id: 1,
    title: 'Documento 1',
    description: 'Descripción del documento 1',
    imageUrl:
      'https://img.freepik.com/vector-gratis/concepto-evaluacion-credito-dibujado-mano-documentos_23-2149154259.jpg?w=2000',
    downloadUrl: 'https://example.com/document1.pdf',
    categories: ['Categoría 1', 'Categoría 2'],
  },
  {
    id: 2,
    title: 'Documento 2',
    description: 'Descripción del documento 2',
    imageUrl:
      'https://img.freepik.com/vector-gratis/concepto-evaluacion-credito-dibujado-mano-documentos_23-2149154259.jpg?w=2000',
    downloadUrl: 'https://example.com/document2.pdf',
    categories: ['Categoría 2', 'Categoría 3'],
  },
  // Agrega más datos aquí
]
const Library = () => {
  const handleSearchChange = (event) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      search: event.target.value,
    }))
  }

  const handleFilterSearchChange = (event) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      filterSearch: event.target.value,
    }))
  }

  const handleOrderByChange = (event) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      orderBy: event.target.value,
    }))
  }

  const [filters, setFilters] = useState({
    orderBy: '',
    search: '',
    filterSearch: '',
    filter1: false,
    filter2: false,
    filter3: false,
    // Agrega más filtros aquí
  })

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const handlePageChange = (event, page) => {
    setCurrentPage(page)
  }

  const filteredData = data.filter((item) => {
    return (
      item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.description.toLowerCase().includes(filters.search.toLowerCase())
    )
  })

  const sortedData = filteredData.sort((a, b) => {
    if (filters.orderBy === 'title') {
      return a.title.localeCompare(b.title)
    } else if (filters.orderBy === 'description') {
      return a.description.localeCompare(b.description)
    }
    return 0
  })

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Filters
          filters={filters}
          handleFilterSearchChange={handleFilterSearchChange}
        />
      </Grid>
      <Grid item xs={9}>
        <Search
          filters={filters}
          handleSearchChange={handleSearchChange}
          handleOrderByChange={handleOrderByChange}
        />

        <SimpleBar>
          <Documents paginatedData={paginatedData} />
        </SimpleBar>
        <Pagination
          sortedData={sortedData}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
      </Grid>
    </Grid>
  )
}

export default Library
