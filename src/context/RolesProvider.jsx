import { useState, useEffect, createContext } from 'react'
import ApiConnection from '../utils/apiConnection'

const roleTemplate = {
  rolName: '',
  rolStatus: '',
  isNewRole: true
}


const RolesContext = createContext()
const RolesProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [loadingRole, setLoadingRole] = useState(false)
  const [error, setError] = useState(false)
  const [roles, setRoles] = useState([])
  const [totalRows, setTotalRows] = useState(0)
  const [page, setPage] = useState(0)
  const [rows, setRows] = useState(10)
  const [value, setValue] = useState('')
  const [column, setColumn] = useState('')
  const [order, setOrder] = useState('DESC')
  const [role, setRoleData] = useState(roleTemplate)



  const Api = ApiConnection()

  const setRole = async ({ rolId }) => {
    if (!rolId) return setRoleData(roleTemplate)

    try {
      setLoadingRole(true)
      const role = await Api.get(`roles/${rolId}`)
      setRoleData({ ...role, isNewRole: false })
      setLoadingRole(false)

    } catch (error) {
      console.log(error)
    }
  }

  const getRoles = async () => {
    try {
      setLoading(true)
      console.log({ roles })
      const result = await Api.get('roles', {
        params: { page: page + 1 , rows, column, value, orderByUsrStatus: order },
      })
      if (Api.status === 200) {
        const totalRows = result.totalRows
        const roles = result.roles
        setRoles(roles)
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


  //Get Data
  useEffect(() => {
    getRoles()
  }, [page, order, rows])
  
  useEffect(() => {
    if (page !== 0)
      setPage(0)
    else
      getRoles()
  }, [value, column])

  return (
    <RolesContext.Provider
      value={{
        loading,
        loadingRole,
        totalRows,
        setTotalRows,
        page,
        setPage,
        rows,
        setRows,
        value,
        getRoles,
        setValue,
        order,
        setOrder,
        role,
        setRole,
        roles,
        setRoles,
        setRoleData,
        column,
        setColumn,
      }}
    >
      {children}
    </RolesContext.Provider>
  )
}

export {
  RolesProvider
}

export default RolesContext