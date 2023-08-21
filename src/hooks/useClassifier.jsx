import { useContext } from 'react'
import ClassifierContext from '../context/ClassifierProvider'

const useClassifier = () => {
  return useContext(ClassifierContext)
}

export default useClassifier
