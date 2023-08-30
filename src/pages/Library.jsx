import { Card, CardContent, Grid, Pagination } from '@mui/material'
import { useState } from 'react'
import SimpleBar from 'simplebar-react/dist'
import Documents from '../components/library/Documents'
import Filters from '../components/library/Filters'
import Search from '../components/library/Search'
import useLibrary from '../hooks/useLibrary'

const Library = () => {
  const handleSearchChange = (event) => {}
  const {documents, currentPage, setCurrentPage} = useLibrary()

  const handlePageChange = (event, page) => {
    setCurrentPage(page)
  }

  return (
    <Grid container spacing={2}>
      <Grid item sx={{ display: { xs: 'none', md: 'block' } }} md={3}>
        <Filters />
      </Grid>
      <Grid item xs={12} md={9}>
        <Search handleSearchChange={handleSearchChange} />
        <Card
          style={{
            marginTop: 10,
          }}
        >
          <CardContent>
            <SimpleBar
              style={{
                height: 'calc(100vh - 310px)',
              }}
            >
              <Documents
                paginatedData={documents.results}
                style={{
                  height: 'calc( 100vh - 270px)',
                  backdropFilter: 'blur(5px)',
                }}
              />
            </SimpleBar>
          </CardContent>
        </Card>
        <Pagination
          defaultPage={1}
          page={currentPage}
          count={Math.ceil(documents.count/20)}
          handlePageChange={handlePageChange}
        />
      </Grid>
    </Grid>
  )
}

export default Library
