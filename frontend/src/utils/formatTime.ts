import moment from 'moment'

const subtractTime = (createdAt: number | string | Date) => {
  return moment(createdAt).subtract(1, 'days').calendar()
}

const formatDate = (createdAt: number | string) => {
  return moment(createdAt).format('MM-DD HH:mm:ss')
}

export {
  subtractTime,
  formatDate
}