import 'moment/locale/es'
import moment from 'moment/moment'
moment.locale('es')

const arrayRange = (start, stop, step) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
  )
const timeConvert = (time) =>
  time > 12
    ? `${time - 12} pm`
    : time === 0
    ? '12 am'
    : time === 12
    ? '12 pm'
    : `${time} am`

const getLabels = (start, end, agrupation) => {
  let labels = []

  switch (agrupation) {
    case 'TO_DAY':
      labels = arrayRange(0, 23, 1)
      break
    case '7_DAYS':
    case 'LAST_30_DAYS':
      labels = createDateRange(start, end, 'days')
      break
    case 'LAST_12_MONTHS':
      labels = createDateRange(start, end, 'months')
      break
    case 'ALL_YEARS':
      labels = createDateRange(start, end, 'years')
      break
  }
  return labels
}

const formatLabels = (labels, agrupation) => {
  return agrupation === 'TO_DAY'
    ? labels.map((value) => timeConvert(value))
    : agrupation === 'LAST_12_MONTHS'
    ? labels.map((value) => moment(value).format('MMMM YYYY'))
    : labels
}

const createDateRange = (startDate, stopDate, type) => {
  startDate = moment(startDate)
  stopDate = moment(stopDate)
  let dateArray = new Array()
  let currentDate = startDate
  do {
    let dateFormated
    if (type === 'months') dateFormated = `${currentDate.format('YYYY-MM')}`
    else if (type === 'years') {
      dateFormated = `${currentDate.format('YYYY')}`
    } else dateFormated = `${currentDate.format('YYYY-MM-DD')}`
    dateArray.push(dateFormated)
    currentDate = currentDate.add(type, 1)
  } while (currentDate.format('YYYY-MM-DD') <= stopDate.format('YYYY-MM-DD'))
  return dateArray
}

export { getLabels, formatLabels }
