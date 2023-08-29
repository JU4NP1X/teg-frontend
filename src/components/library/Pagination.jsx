import { Pagination as MuiPagination } from '@mui/material'
import React from 'react'

const Pagination = ({ currentPage, handlePageChange }) => {
  return (
    <MuiPagination
      count={2}
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
