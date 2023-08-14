import { Grid } from '@mui/material'
import '../../styles/login/footer.css'
import { isMobile } from '../../utils/utils'

export function Footer(props) {
  return (
    <Grid
      container
      className={'footer-container'}
      style={{ marginTop: 'auto', backgroundColor: 'white' }}
    >
      <Grid
        container
        sx={{ width: isMobile() ? 500 : 1000, justifyContent: 'center' }}
      ></Grid>
    </Grid>
  )
}
