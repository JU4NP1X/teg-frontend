import { Pagination as MuiPagination } from '@mui/material'
import React from 'react'

const Pagination = ({
  sortedData,
  itemsPerPage,
  currentPage,
  handlePageChange,
}) => {
  return (
    <MuiPagination
      count={Math.ceil(sortedData.length / itemsPerPage)}
      page={currentPage}
      onChange={handlePageChange}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '10px',
      }}
    />
  )
}

export default Pagination
