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
import { useState } from 'react'
import Slide from '../components/common/Slide'
import TagsFinder from '../components/finder/TagsFinder'
import useClassifier from '../hooks/useClassifier'

const Classifier = () => {
  const { showTable } = useClassifier()
  const [changed, setChanged] = useState()

  useEffect(() => {
    setChanged(true)
  }, [showTable])
  return (
    <Box component={'main'}>
      <Slide changed={changed} setChanged={setChanged}>
        {showTable ? (
          <Card>
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Documento</TableCell>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Tags</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Aquí puedes agregar las filas de la tabla */}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        ) : (
          <TagsFinder />
        )}
      </Slide>
    </Box>
  )
}

export default Classifier
