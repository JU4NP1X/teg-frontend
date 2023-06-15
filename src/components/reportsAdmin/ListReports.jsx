import { useState } from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { CircularProgress, TablePagination, Pagination } from '@mui/material'
import '../../styles/reportsAdmin/report.css'
import EditReport from './EditReport'
import Status from './Status'
import Action from './Action'
import TableHead from './TableHead'
import useReports from '../../hooks/useReports'
import ReportDialog from '../__common/ReportDialog'
import Filter from './Filter'
import SimpleBar from 'simplebar-react'
import InputLabel from '@mui/material/InputLabel'
import CustomPagination from '../__common/CustomPagination'


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
    id: 'repName',
    numeric: false,
    disablePadding: false,
    label: 'Nombre',
    sort: false,
    filter: true,
  },
  {
    key: 'id',
    id: 'repDescription',
    numeric: false,
    disablePadding: false,
    label: 'Descripción',
    sort: false,
    filter: true,
  },

  {
    key: 'id',
    id: 'catName',
    numeric: false,
    disablePadding: false,
    label: 'Categorías',
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
    id: 'repStatus',
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

export default function ListReports({ visibleModal, setVisibleModal }) {
  //const [reportsState, setreportsState] = useState([])
  //const [modal, setModal] = useState(visibleModal)
  const [showReport, setShowReport] = useState(false)
  const [reportToShow, setReportToShowData] = useState({})

  const { loading, setRows} = useReports()

  const {
    reports,
    totalRows,
    rows,
    page,
    setPage,
    setValue,
    setColumn,
    order,
    setOrder,
    setReport,

  } = useReports()

  const handleChangePage = (e, newPage) => setPage( newPage /*  - 1 */ )

  const handleOpenModal = () => setVisibleModal(true)

  const handleCloseModal = () => setVisibleModal(false)
  const setReportToShow = async (data) => {
    await setReportToShowData({ ...data })
    setShowReport(true)
  }

  

  return (
    <Box sx={{ width: '100%', px: 5 }}>
      <Paper sx={{ width: '100%' }}>
        <TableContainer>
          <SimpleBar style={{ height: '60vh' }} onTouchEnd={(e) => {e.stopPropagation()}}>
            <Table
              sx={{ minWidth: 750, width: '100%', height: '100%' }}
              aria-labelledby='tableTitle'
              size={'large'}
              stickyHeader
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
                  reports.map((report, index) => {
                    return (
                      <TableRow hover key={report.key}>
                        <TableCell align='left'>
                          <img
                            src={`/img/${
                              report.company.cmpValue ?? 'mayoreo'
                            }-category.png`}
                            style={{ height: '25px', width: 'auto' }}
                          />
                        </TableCell>
                        <TableCell align='left'>{report.repName}</TableCell>
                        <TableCell align='left'>
                          {report.repDescription}
                        </TableCell>
                        <TableCell>
                          <Accordion>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls='panel1a-content'
                              id='panel1a-header'
                            >
                              {report.categories && report.categories.length
                                ? `${report.categories[0].parent.catName} - ${report.categories[0].catName}`
                                : 'N/A'}
                            </AccordionSummary>
                            <AccordionDetails>
                              {report.categories && report.categories.length > 1
                                ? report.categories.map((cat) => (
                                    <>
                                      {`${cat.parent.catName} - ${cat.catName}`}
                                      <br />
                                    </>
                                  ))
                                : ''}
                            </AccordionDetails>
                          </Accordion>
                        </TableCell>
                        <TableCell>
                          <Accordion>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls='panel1a-content'
                              id='panel1a-header'
                            >
                              {report.roles.length
                                ? report.roles[0].rolName
                                : 'N/A'}
                            </AccordionSummary>
                            <AccordionDetails>
                              {report.roles.length > 1
                                ? report.roles.map((role) => (
                                    <>
                                      {role.rolName}
                                      <br />
                                    </>
                                  ))
                                : ''}
                            </AccordionDetails>
                          </Accordion>
                        </TableCell>
                        <TableCell align='center'>
                          <Status repStatus={report.repStatus} />
                        </TableCell>
                        <TableCell align='center'>
                          <Action
                            setReportToShow={setReportToShow}
                            data={report}
                            setData={setReport}
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
                    <TableCell align='center' colSpan={7}>
                      <CircularProgress sx={{ color: 'black' }} />
                    </TableCell>
                  </TableRow>
                )}

                <ReportDialog
                  setOpen={setShowReport}
                  open={showReport}
                  title={reportToShow.repName}
                  repType={reportToShow.repType}
                  repId={reportToShow.repId}
                />
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

      {visibleModal && (
        <EditReport
          modal={visibleModal}
          setModal={setVisibleModal}
          handleCloseModal={handleCloseModal}
        />
      )}
    </Box>
  )
}
