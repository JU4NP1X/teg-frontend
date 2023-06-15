import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import ListReports from '../components/reportsAdmin/ListReports'
import IconButton from '@mui/material/IconButton'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import CircularProgress from '@mui/material/CircularProgress'
import ApiConnection from '../utils/apiConnection'
import Tooltip from '@mui/material/Tooltip'


import Alert from '../components/reportsAdmin/Alert'
import useReports from '../hooks/useReports'
import { Grid, Typography } from '@mui/material'



const ReportAdmin = () => {
  const [visibleModal, setVisibleModal] = useState(false)

  const { setReport } = useReports()

  return (
    <Grid item xs={12}>
      <Tooltip title={
        <>
          Administrador de creación, eliminación y edición de reportes.
        </>}>
        <Typography className='layout-not-select' variant={'h5'} component={'h2'} sx={{ textAlign: 'center', my: 4 }}>
          <b>Administrador de reportes</b>
        </Typography>
      </Tooltip>
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 30 }}>
        <div>
          <Tooltip title='Agregar Reporte'>
            <IconButton
              onClick={() => {
                setReport({})
                setVisibleModal(true)
              }}
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <>
        <ListReports
          visibleModal={visibleModal}
          setVisibleModal={setVisibleModal}
        />
      </>

    </Grid>
  )
}

export default ReportAdmin
