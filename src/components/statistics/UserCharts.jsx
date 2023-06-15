

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

const loginOptions = chartOptions('Frecuencia de inicios de sesión')
const logoutOptions = chartOptions('Frecuencia de cierres sesión')
const activityOptions = chartOptions('Media de tiempo activo (en horas)')

const colors = {
  borderColor: 'rgb(175, 176, 175)',
  backgroundColor: 'rgba(175, 176, 175, 0.5)'
}

const userChartsAll = ['login', 'logout', 'session']
const userChartsDesktop = ['login-desktop', 'logout-desktop', 'session']
const userChartsMobile = ['login-mobile', 'logout-mobile', 'session']

export default function UserCharts({ agrupation, user, loginType }) {
  const { setErrorMessage } = useNotification()
  const [loginData, setLoginData] = useState([])
  const [logoutData, setLogoutData] = useState([])
  const [labels, setLabels] = useState([])
  const [sessionData, setSessionData] = useState([])

  const getStats = async (type) => {
    const Api = ApiConnection()
    const result = await Api.get(`statistics/${type}`, { params: { agrupation, usrId: user && user.usrId, loginType } })
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
        case 'login':
        case 'login-desktop':
        case 'login-mobile':
          setLoginData(data)
          break
        case 'logout':
        case 'logout-desktop':
        case 'logout-mobile':
          setLogoutData(data)
          break
        case 'session':
        case 'session-desktop':
        case 'session-mobile':
          setSessionData(data)
          break
      }
      setLabels(formatLabels(labelList, agrupation))
    } else
      setErrorMessage(Api.message)
  }


  useEffect(() => {
    if (agrupation) {
      switch (loginType) {
        case 'all':
          userChartsAll.map(key => getStats(key))
          break
        case 'desktop':
          userChartsDesktop.map(key => getStats(key))
          break
        case 'mobile':
          userChartsMobile.map(key => getStats(key))
          break
      }
    }
  }, [user, agrupation, loginType])

  return (
    <>
      {/* Fisrt row*/}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>

          <Line
            options={loginOptions}
            data={{
              labels,
              datasets: [{
                data: loginData,
                ...colors,
              }]
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>

          <Line
            options={logoutOptions}
            data={{
              labels,
              datasets: [{
                data: logoutData,
                ...colors,
              }]
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>

          <Line
            options={activityOptions}
            data={{
              labels,
              datasets: [{
                data: sessionData,
                ...colors,
              }]
            }}
          />
        </Grid>
      </Grid>
    </>
  )
}