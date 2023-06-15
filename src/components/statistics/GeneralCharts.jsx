

import { useEffect, useState } from 'react'
import ApiConnection from '../../utils/apiConnection'
import useNotification from '../../hooks/useNotification'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { Grid } from '@mui/material'
import { formatLabels, getLabels } from '../../utils/statistics/datesTimesFormaters'


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const chartOptions = (title) => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: true,
      text: title,
    },
  },
})

const activeUsersOptions = chartOptions('Cantidad de usuarios activos')
const visitsOptions = chartOptions('Cantidad de visitas')
const createdUsersOptions = chartOptions('Cantidad de usuarios creados')

const colors = {
  borderColor: 'rgb(175, 176, 175)',
  backgroundColor: 'rgba(175, 176, 175, 0.5)'
}

const generalCharts = ['active-users', 'visits', 'created-users']

export default function GeneralCharts({ agrupation, loginType }) {
  const { setErrorMessage } = useNotification()
  const [activeUsersData, setActiveUsersData] = useState([])
  const [visitsData, setVisitsData] = useState([])
  const [labels, setLabels] = useState([])
  const [createdUsersData, setCreatedUsersData] = useState([])

  const getStats = async (type) => {
    const Api = ApiConnection()
    const result = await Api.get(`statistics/${type}`, { params: { agrupation, loginType } })
    if (Api.status === 200) {
      const labelList = getLabels(result.startDate, result.endDate, agrupation)
      const data = labelList.map(label => {
        let count = 0
        result.statistics.forEach(point => {
          if (point.hstCreatedAt === label)
            count = point.counts
        })
        return count
      })

      switch (type) {
        case 'active-users':
          setActiveUsersData(data)
          break
        case 'visits':
          setVisitsData(data)
          break
        case 'created-users':
          setCreatedUsersData(data)
          break
      }
      setLabels(formatLabels(labelList, agrupation))
    } else
      setErrorMessage(Api.message)
  }


  useEffect(() => {
    if (agrupation && loginType)
      generalCharts.map(key => getStats(key))
  }, [agrupation, loginType])

  return (
    <>
      {/* Fisrt row*/}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>

          <Line
            options={activeUsersOptions}
            data={{
              labels,
              datasets: [{
                data: activeUsersData,
                ...colors,
              }]
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>

          <Line
            options={visitsOptions}
            data={{
              labels,
              datasets: [{
                data: visitsData,
                ...colors,
              }]
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>

          <Line
            options={createdUsersOptions}
            data={{
              labels,
              datasets: [{
                data: createdUsersData,
                ...colors,
              }]
            }}
          />
        </Grid>
      </Grid>
    </>
  )
}