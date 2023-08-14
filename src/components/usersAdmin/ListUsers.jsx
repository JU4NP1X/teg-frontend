import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { CircularProgress } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import { useState } from 'react'
import SimpleBar from 'simplebar-react'
import useUsers from '../../hooks/useUsers'
import TableHead from '../reportsAdmin/TableHead'
import CustomPagination from '../__common/CustomPagination'
import Action from './Action'
import EditUser from './EditUser'
import Filter from './Filter'
import Status from './Status'

const headCells = [
  {
    key: 'id',
    id: 'cmpName',
    numeric: false,
    disablePadding: false,
    label: 'Compañía',
    sort: false,
    filter: true,
  },
  {
    key: 'id',
    id: 'usrName',
    numeric: false,
    disablePadding: false,
    label: 'Nombre',
    sort: false,
    filter: true,
  },
  {
    key: 'id',
    id: 'usrLastName',
    numeric: false,
    disablePadding: false,
    label: 'Apellido',
    sort: false,
    filter: true,
  },

  {
    key: 'id',
    id: 'usrEmail',
    numeric: false,
    disablePadding: false,
    label: 'Correo',
    sort: false,
    filter: true,
  },

  {
    key: 'id',
    id: 'rolName',
    numeric: false,
    disablePadding: false,
    label: 'Roles',
    sort: false,
    filter: true,
  },
  {
    key: 'id',
    id: 'usrStatus',
    numeric: false,
    disablePadding: false,
    label: 'Estatus',
    sort: true,
    filter: false,
  },
  {
    key: 'id',
    id: 'actions',
    numeric: false,
    disablePadding: false,
    label: 'Acciones',
    sort: false,
    filter: false,
  },
]

export default function ListUsers({ visibleModal, setVisibleModal }) {
  const [showUser, setShowUser] = useState(false)

  const {
    users,
    totalRows,
    rows,
    page,
    setPage,
    setValue,
    setColumn,
    order,
    setOrder,
    setUser,
    setRows,
    loading,
  } = useUsers()

  const handleChangePage = (e, newPage) => {
    setPage(newPage)
  }

  const handleShowUser = () => setShowUser(true)

  const handleOpenModal = () => setVisibleModal(true)

  const handleCloseModal = () => setVisibleModal(false)

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%' }}>
        <TableContainer>
          <SimpleBar
            style={{ height: '60vh' }}
            onTouchEnd={(e) => {
              e.stopPropagation()
            }}
          >
            <Table
              sx={{ minWidth: 750, width: '100%', height: '100%' }}
              aria-labelledby={'tableTitle'}
              size={'large'}
              stickyHeader={true}
            >
              <TableHead
                headCells={headCells}
                setColumn={setColumn}
                setValue={setValue}
                order={order}
                setOrder={setOrder}
                Filter={Filter}
              />
              <TableBody>
                {!loading ? (
                  users.map((user, index) => {
                    return (
                      <TableRow hover key={user.key}>
                        <TableCell align={'left'}>
                          <img
                            src={`/img/${
                              user.company.cmpValue ?? 'mayoreo'
                            }-category.png`}
                            style={{ height: '25px', width: 'auto' }}
                          />
                        </TableCell>
                        <TableCell align={'left'}>{user.usrName}</TableCell>
                        <TableCell align={'left'}>{user.usrLastName}</TableCell>
                        <TableCell align={'left'}>{user.usrEmail}</TableCell>
                        <TableCell>
                          <Accordion>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls={'panel1a-content'}
                              id={'panel1a-header'}
                            >
                              {user.roles.length
                                ? user.roles[0].rolName
                                : 'N/A'}
                            </AccordionSummary>
                            <AccordionDetails>
                              {user.roles.length > 1
                                ? user.roles.map((role) => (
                                    <>
                                      {role.rolName}
                                      <br />
                                    </>
                                  ))
                                : ''}
                            </AccordionDetails>
                          </Accordion>
                        </TableCell>
                        <TableCell align={'center'}>
                          <Status usrStatus={user.usrStatus} />
                        </TableCell>
                        <TableCell align={'center'}>
                          <Action
                            setShowUser={setShowUser}
                            handleShowUser={handleShowUser}
                            data={user}
                            setData={setUser}
                            handleOpenModal={handleOpenModal}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow
                    hover
                    rowSpan={5}
                    style={{ height: 'calc(60vh - 70px)' }}
                  >
                    <TableCell align={'center'} colSpan={7}>
                      <CircularProgress sx={{ color: 'black' }} />
                    </TableCell>
                  </TableRow>
                )}
                {visibleModal && (
                  <EditUser
                    modal={visibleModal}
                    setModal={setVisibleModal}
                    handleCloseModal={handleCloseModal}
                  />
                )}
              </TableBody>
            </Table>
          </SimpleBar>
        </TableContainer>

        <CustomPagination
          totalRows={totalRows}
          rows={rows}
          handleChangePage={handleChangePage}
          loading={loading}
          setRows={setRows}
          page={page}
        />
      </Paper>
    </Box>
  )
}
