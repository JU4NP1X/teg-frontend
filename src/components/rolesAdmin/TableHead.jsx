import { TableHead as Head, TableRow, TableCell } from "@mui/material"
import OrderBy from "./OrderBy"
const TableHead = ({headCells, setColumn, setValue, order, setOrder, Filter}) => {
  return (
    <Head>
    <TableRow>
      {headCells.map((headCell) => (
        <TableCell>
          <div className='row-head'>
            <strong>{headCell.label}</strong>
            <Filter headCell={{ headCell }} setColumn={setColumn} setValue={setValue}/>
             <OrderBy headCell={{ headCell }} order={order} setOrder={setOrder} /> 
          </div>
        </TableCell>
      ))}
    </TableRow>
  </Head>
  )
}

export default TableHead