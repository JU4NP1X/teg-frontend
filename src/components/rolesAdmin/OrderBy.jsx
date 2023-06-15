import { TableSortLabel } from '@mui/material'

const OrderBy = ({ headCell, order, setOrder }) => {
  async function onOffButton() {
    setOrder(order === 'DESC' ? 'ASC' : 'DESC')
  }

  if (headCell.headCell.id === 'rolStatus') {
    return (
      <TableSortLabel
        sx={{ position: 'relative', ml: 'auto' }}
        active={true}
        direction={order.toLowerCase()}
        onClick={() => onOffButton()}
      ></TableSortLabel>
    )
  }
}
export default OrderBy
