import {
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Pagination,
} from '@mui/material'
import SimpleBar from 'simplebar-react/dist'
import Border from '../components/common/Border'
import Documents from '../components/library/Documents'
import Filters from '../components/library/Filters'
import Search from '../components/library/Search'
import useLibrary from '../hooks/useLibrary'
import { isMobile } from '../utils/utils'

const Library = () => {
  const { documents, currentPage, setCurrentPage, loadingDocuments } =
    useLibrary()

  const handlePageChange = (event, page) => {
    setCurrentPage(page)
  }

  return (
    <Grid container spacing={2}>
      <Grid
        item
        sx={{
          display: { xs: 'none', md: 'none', lg: 'none', xl: 'block' },
          pt: '0 !important',
        }}
        xl={3}
      >
        <Filters />
      </Grid>
      <Grid item xs={12} md={12} lg={12} xl={9} style={{ paddingTop: 0 }}>
        <Search />
        <Card style={{ marginTop: 10 }}>
          <CardContent>
            <Border>
              <SimpleBar
                onTouchStart={(e) => {
                  e.stopPropagation()
                }}
                style={{
                  height: isMobile()
                    ? 'calc(100vh - 240px)'
                    : 'calc(100vh - 297px)',
                }}
              >
                {loadingDocuments ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: isMobile()
                        ? 'calc(100vh - 250px)'
                        : 'calc(100vh - 297px)',
                    }}
                  >
                    <CircularProgress color={'primary'} />
                  </div>
                ) : (
                  <Documents
                    paginatedData={documents.results}
                    loading={loadingDocuments}
                  />
                )}
              </SimpleBar>
            </Border>
          </CardContent>
        </Card>
        <div
          style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}
        >
          <Pagination
            defaultPage={1}
            page={currentPage}
            count={Math.ceil(documents.count / 20)}
            onChange={handlePageChange}
          />
        </div>
      </Grid>
    </Grid>
  )
}

export default Library
