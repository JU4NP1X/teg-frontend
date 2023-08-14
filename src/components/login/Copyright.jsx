import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

const Copyright = (props) => {
  return (
    <Typography
      variant={'body2'}
      color={'text.secondary'}
      align={'center'}
      {...props}
      className={'layout-not-select'}
    >
      <Link color={'inherit'} href={'https://www.intelix.biz/site/public/'}>
        Intelix Synergy ©
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

export default Copyright
