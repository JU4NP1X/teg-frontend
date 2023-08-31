import { useContext } from 'react'
import AuthoritiesContext from '../context/AuthoritiesProvider'

const useAuthorities = () => {
  return useContext(AuthoritiesContext)
}

export default useAuthorities
