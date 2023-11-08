import { Grid } from '@mui/material'
import '../../styles/finder/finder.css'
import InputCard from './InputCard'
import TagsListCard from './TagsListCard'

const DocumentManager = () => {
  return (
    <Grid container>
      <Grid item xs={12} md={8} sx={{ pr: { xs: 0, md: 2 } }}>
        <InputCard />
      </Grid>
      <Grid
        item
        xs={12}
        md={4}
        sx={{
          pl: { xs: 0, md: 2 },
          pb: { xs: 2, md: 0 },
          mt: { xs: '20 !important', md: '0 !important' },
          display: 'inline-grid',
        }}
      >
        <TagsListCard />
      </Grid>
    </Grid>
  )
}
export default DocumentManager
