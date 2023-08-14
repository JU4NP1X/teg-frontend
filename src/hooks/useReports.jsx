import { useContext } from 'react'
import ReportsContext from '../context/ReportsProvider'

const useReports = () => {
  return useContext(ReportsContext)
}

export default useReports
