import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import TableRoles from '../components/rolesAdmin/ListRoles'
import IconButton from '@mui/material/IconButton'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import CircularProgress from '@mui/material/CircularProgress'
import Tooltip from '@mui/material/Tooltip'
import EditRole from '../components/rolesAdmin/EditRole'
import ApiConnection from "../utils/apiConnection"
import { Grid, Typography } from '@mui/material'
import useRoles from '../hooks/useRoles'


const RolesAdmin = () => {
  const [visibleModal, setVisibleModal] = useState(false)
  const [openLoading, setOpenLoading] = useState(false)
  const { setRole } = useRoles()

  return (
    <Grid item xs={12}>
      <Tooltip title={
        <>
          Administrador de creación, eliminación y edición de roles.
        </>}>
        <Typography className='layout-not-select' variant={'h5'} component={'h2'} sx={{ textAlign: 'center', my: 4 }}>
          <b>Administrador de roles</b>
        </Typography>
      </Tooltip>
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 30 }}>
        <div><Tooltip title='Crear Rol'><IconButton
          onClick={() => {
            setRole({})
            setVisibleModal(true)
          }}><AddCircleOutlineIcon /></IconButton></Tooltip></div>
      </div>
      <TableRoles
        setVisibleModal={setVisibleModal}
        visibleModal={visibleModal}
      />
      {visibleModal ?
        (<EditRole
          visibleModal={visibleModal}
          setVisibleModal={setVisibleModal}
          setOpenLoading={setOpenLoading}
        />) : null}

    </Grid>
  )
}

export default RolesAdmin
