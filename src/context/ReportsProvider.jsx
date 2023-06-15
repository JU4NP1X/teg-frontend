import { useState, useEffect, createContext } from 'react'
import ApiConnection from '../utils/apiConnection'

const reportTemplate = {
  repName: '',
  repDescription: '',
  cmpId: '',
  repType: '',
  repToken: '',
  roles: [],
  categories: [],
  repBehavior: 'DYNAMIC',
  repStatus: 1,
  repInMaintenance: 0,
  repInConstruction: 0,
  url: {
    ruaUrl: '',
  },
  token: {
    rtaReportId: '',
    rtaWorkspaceId: '',
    rtaJson: '',
  },
  updatedByUser: {
    usrName: '',
    usrLastName: '',
  },
  createdByUser: {
    usrName: '',
    usrLastName: '',
  },
  tags: [],
  isNewReport: true,
}

const columnsTemplate = {
  repName: 'safdasf',
  repDescription: '',
  rolName: '',
  cmpName: '',
  tagName: '',
  catName: ''
}

const ReportsContext = createContext()
const ReportsProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [loadingReport, setLoadingReport] = useState(false)
  const [error, setError] = useState(false)
  const [reports, setReports] = useState([])
  const [totalRows, setTotalRows] = useState(0)
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState(10)
  const [value, setValue] = useState('')
  const [column, setColumn] = useState('')
  const [order, setOrder] = useState('DESC')
  const [listCompanies, setListCompanies] = useState([])
  const [rolesList, setRolesList] = useState([])
  const [report, setReportData] = useState(reportTemplate)
  const [columns, setColumns] = useState({
    repName: '',
    repDescription: '',
    rolName: '',
    cmpName: '',
    tagName: '',
    catName: ''
  })


  const Api = ApiConnection()

  const setReport = async ({ repId }) => {
    if (!repId) return setReportData(reportTemplate)

    try {
      setLoadingReport(true)
      const report = await Api.get(`reports/${repId}`)
      setReportData({
        ...report,
        token: report.token ?? {},
        url: report.url ?? {},
        createdByUser: report.createdByUser ?? {},
        updatedByUser: report.updatedByUser ?? {},
        isNewReport: false,
      })
      setLoadingReport(false)
    } catch (error) {
      console.log(error)
    }
  }

  const getReports = async () => {
    try {
      setLoading(true)
      const result = await Api.get('reports', {
        params: {
          page: page/*  + 1  */,
          rows,
          repName: columns.repName,
          repDescription: columns.repDescription,
          rolName: columns.rolName,
          cmpName: columns.cmpName,
          tagName: columns.tagName,
          catName: columns.catName,
          orderByRepStatus: order,
        },
      })
      if (Api.status === 200) {
        const totalRows = result.totalRows
        const reports = result.reports

        setReports(reports)
        setTotalRows(totalRows)
        setLoading(false)
      } else {
        setError(true)
      }
    } catch (error) {
      setError(true)
      console.log(error)
    }
  }

  const getCompanies = async () => {
    const Api = ApiConnection()
    const listCompanies = await Api.get('/companies', {
      params: { onlyIndexed: false },
    })
    setListCompanies(listCompanies)
  }

  const getRoles = async () => {
    const Api = ApiConnection()
    const listRoles = await Api.get('/roles/actives')
    setRolesList(listRoles)
  }

  //Get Data
  useEffect(() => {
    getReports()
  }, [
    page,
    order,
    rows
  ])
  
  useEffect(() => {
    setPage(1)
    getReports()
  }, [columns])



  //Get Companies and roles
  useEffect(() => {
    getCompanies()
    getRoles()
  }, [])

  return (
    <ReportsContext.Provider
      value={{
        loading,
        loadingReport,
        totalRows,
        setTotalRows,
        page,
        setPage,
        rows,
        setRows,
        value,
        getReports,
        setValue,
        order,
        setOrder,
        listCompanies,
        setListCompanies,
        rolesList,
        setRolesList,
        report,
        setReport,
        reports,
        setReports,
        setReportData,
        setColumn,
        column,
        columns,
        setColumns,

      }}
    >
      {children}
    </ReportsContext.Provider>
  )
}

export { ReportsProvider }

export default ReportsContext
