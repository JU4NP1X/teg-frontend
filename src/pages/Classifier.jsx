import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { useEffect, useState } from 'react'
import Slide from '../components/common/Slide'
import DocumentManager from '../components/finder/DocumentManager'
import useClassifier from '../hooks/useClassifier'
import DocsTable from '../components/finder/DocsTable'

const Classifier = () => {
  const { showTable } = useClassifier()
  const [changed, setChanged] = useState()

  useEffect(() => {
    setChanged(true)
  }, [showTable])
  return (
    <Box component={'main'}>
      <Slide changed={changed} setChanged={setChanged}>
        {showTable ? <DocsTable /> : <DocumentManager key={'manager'} />}
      </Slide>
    </Box>
  )
}

export default Classifier
