

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
  registerables
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import { Grid, Typography } from '@mui/material'
import { formatLabels, getLabels } from '../../utils/statistics/datesTimesFormaters'


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ...registerables
)

const chartOptions = (title, x = 'number') => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    },
    x: {
      ticks: {
        callback: x === 'text' ? function (value) { return this.getLabelForValue(value).substring(0, 8) } : function (value) { return this.getLabelForValue(value) }
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

const openOptions = chartOptions('Apertura de reportes')
const activityOptions = chartOptions('Media de minutos abierto')
const reportsTopOptions = chartOptions('Top de reportes más visitados', 'text')

const colors = {
  borderColor: 'rgb(175, 176, 175)',
  backgroundColor: 'rgba(175, 176, 175, 0.5)'
}

const reportChartsAll = ['report-open', , 'report-time']
const reportChartsDesktop = ['report-open-desktop', 'report-time']
const reportChartsMobile = ['report-open-mobile', 'report-time']

export default function ReportCharts({ agrupation, user, openType, report, company }) {
  const { setErrorMessage } = useNotification()
  const [reportOpenData, setReportOpenData] = useState([])
  const [reportCloseData, setReportCloseData] = useState([])
  const [reportTopData, setReportTopData] = useState([])
  const [labels, setLabels] = useState([])
  const [reportsTopLabels, setReportsTopLabels] = useState([])
  const [reportTimeData, setReportTimeData] = useState([])

  const getStats = async (type) => {
    const Api = ApiConnection()
    const result = await Api.get(`statistics/${type}`, { params: { agrupation, usrId: user && user.usrId, repId: report && report.repId, loginType: openType, cmpId: company && company.cmpId } })
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
        case 'report-open':
        case 'report-open-desktop':
        case 'report-open-mobile':
          setReportOpenData(data)
          break
        case 'report-close':
        case 'report-close-desktop':
        case 'report-close-mobile':
          setReportCloseData(data)
          break
        case 'report-time':
          setReportTimeData(data)
          break
      }
      setLabels(formatLabels(labelList, agrupation))
    } else
      setErrorMessage(Api.message)
  }


  const getTop = async () => {
    const Api = ApiConnection()
    const result = await Api.get(`statistics/reports-top`, { params: { agrupation, usrId: user && user.usrId, repId: report && report.repId, loginType: openType, cmpId: company && company.cmpId } })
    if (Api.status === 200) {
      const labelList = result.statistics.map(point => point.repName)
      const data = result.statistics.map(point => point.counts)
      setReportsTopLabels(labelList)
      setReportTopData(data)
    } else
      setErrorMessage(Api.message)
  }

  useEffect(() => {
    if (agrupation) {
      switch (openType) {
        case 'all':
          reportChartsAll.map(key => getStats(key))
          break
        case 'desktop':
          reportChartsDesktop.map(key => getStats(key))
          break
        case 'mobile':
          reportChartsMobile.map(key => getStats(key))
          break
      }
      getTop()
    }
  }, [user, company, agrupation, openType, report])



  return (
    <>
      {/* Fisrt row*/}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>

          <Line
            options={openOptions}
            data={{
              labels,
              datasets: [{
                data: reportOpenData,
                ...colors,
              }]
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>

          <Line
            options={activityOptions}
            data={{
              labels,
              datasets: [{
                data: reportTimeData,
                ...colors,
              }]
            }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} style={{ height: 300 }}>
        <Grid item xs={12}>
          <Bar
            options={reportsTopOptions}
            data={{
              labels: reportsTopLabels,
              datasets: [{
                data: reportTopData,
                ...colors,
              }]
            }}
          />
        </Grid>
      </Grid>
    </>
  )
}