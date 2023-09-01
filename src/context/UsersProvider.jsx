import { createContext, useEffect, useState } from 'react'
import ApiConnection from '../utils/apiConnection'

const userTemplate = {
  usrName: '',
  usrLastName: '',
  cmpId: '',
  usrEmail: '',
  roles: [],
  usrStatus: '',
  isNewUser: true,
}

const UsersContext = createContext()
const UsersProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [loadingUser, setLoadingUser] = useState(false)
  const [error, setError] = useState(false)
  const [users, setUsers] = useState([])
  const [totalRows, setTotalRows] = useState(0)
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState(10)
  const [value, setValue] = useState('')
  const [column, setColumn] = useState('')
  const [order, setOrder] = useState('DESC')
  const [listCompanies, setListCompanies] = useState([])
  const [rolesList, setRolesList] = useState([])
  const [user, setUserData] = useState(userTemplate)
  const [columns, setColumns] = useState({
    rolName: '',
    cmpName: '',
    usrName: '',
    usrLastName: '',
    usrEmail: '',
  })

  const Api = ApiConnection()

  const setUser = async ({ usrId }) => {
    if (!usrId) return setUserData(userTemplate)

    try {
      setLoadingUser(true)
      const user = await Api.get(`users/${usrId}`)
      setUserData({ ...user, isNewUser: false })
      setLoadingUser(false)
    } catch (error) {
      console.log(error)
    }
  }

  const getUsers = async () => {
    try {
      setLoading(true)
      console.log({ users })
      const result = await Api.get('users', {
        params: {
          page: page /* + 1 */,
          rows,
          rolName: columns.rolName,
          cmpName: columns.cmpName,
          usrName: columns.usrName,
          usrLastName: columns.usrLastName,
          usrEmail: columns.usrEmail,
          orderByUsrStatus: order,
        },
      })
      if (Api.status < 400) {
        const totalRows = result.totalRows
        const users = result.users
        setUsers(users)
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
    getUsers()
  }, [page, order, rows])

  useEffect(() => {
    setPage(1)
    getUsers()
  }, [columns])

  //Get Companies and roles
  useEffect(() => {
    getCompanies()
    getRoles()
  }, [])

  return (
    <UsersContext.Provider
      value={{
        loading,
        loadingUser,
        totalRows,
        setTotalRows,
        page,
        setPage,
        rows,
        setRows,
        value,
        getUsers,
        setValue,
        order,
        setOrder,
        listCompanies,
        setListCompanies,
        rolesList,
        setRolesList,
        user,
        setUser,
        users,
        setUsers,
        setUserData,
        column,
        setColumn,
        columns,
        setColumns,
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}

export { UsersProvider }

export default UsersContext
