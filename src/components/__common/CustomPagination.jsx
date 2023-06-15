import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { Pagination } from '@mui/material'
import PropTypes from 'prop-types'
import { isMobile } from '../../utils/utils'

import { useEffect, useState } from 'react'
import useReports from '../../hooks/useReports'

function CustomPagination({
  totalRows,
  rows,
  handleChangePage,
  loading,
  setRows,
  page,

}) {


  return (
 
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile() ? 'column' : 'row',
          alignItems: 'center',
          padding: 1,
          paddingRight: 10,
          justifyContent: 'start',
        }}
      >
        <Pagination
          page={page}
          defaultPage={1}
          sx={{ ml: 'auto', my: 1, p: '10px' }}
          className='farm-card-pagination'
          count={Math.ceil(totalRows / rows)}
          onChange={handleChangePage}
          disabled={loading}
        />
        <FormControl style={{ width: isMobile() ? '100%' : 'auto' }}>
          <Select value={rows} onChange={(e) => setRows(e.target.value)}>
            <MenuItem value={10}>10 / página</MenuItem>
            <MenuItem value={20}>20 / página</MenuItem>
            <MenuItem value={50}>50 / página</MenuItem>
          </Select>
        </FormControl>
      </div>

  )
}

CustomPagination.propTypes = {
  totalRows: PropTypes.number.isRequired,
  rows: PropTypes.number.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  setRows: PropTypes.func.isRequired,
  loading: PropTypes.bool,
}

export default CustomPagination
