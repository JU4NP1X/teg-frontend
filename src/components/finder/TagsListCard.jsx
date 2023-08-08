import { CopyAll, Search, Upload } from '@mui/icons-material'
import { Button, Card, CardActions, CardContent, Chip, Divider, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import SimpleBar from 'simplebar-react'



const TagsListCard = () => {

  return (
    <Card sx={{ w: '100%', h: '100%' }}>
      <CardContent sx={{ height: '100%' }}>
        <Typography sx={{ fontSize: 14, height: '33%' }} color='text.secondary' gutterBottom>
          Categorías:
          <Divider />
          <SimpleBar style={{ height: 'calc(100% - 20px)' }}>

            <Chip
              sx={{ m: 0.5 }}
              label='Thesaurio 1'
              component='a'
              href='#basic-chip'
              variant='outlined'
              clickable
              onClick={(value) => { console.log(value) }}
              onDelete={() => { }}
              deleteIcon={<CopyAll />}
            />
          </SimpleBar>
        </Typography>
      </CardContent>
    </Card>
  )
}
export default TagsListCard