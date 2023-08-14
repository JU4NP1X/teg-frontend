const sessionExist = () =>
  localStorage.getItem('__session') &&
  localStorage.getItem('__session').length > 0

const Session = {
  set: (newSession) =>
    localStorage.setItem('__session', JSON.stringify(newSession)),
  getAll: () =>
    sessionExist() ? JSON.parse(localStorage.getItem('__session')) : {},
  nav: () =>
    sessionExist()
      ? JSON.parse(localStorage.getItem('__session')).nav
      : undefined,
  unset: () => localStorage.removeItem('__session'),
  usrId: () =>
    sessionExist()
      ? JSON.parse(localStorage.getItem('__session')).usrId
      : undefined,
  usrCompany: () =>
    sessionExist()
      ? JSON.parse(localStorage.getItem('__session')).usrCompany
      : undefined,
  usrEmail: () =>
    sessionExist()
      ? JSON.parse(localStorage.getItem('__session')).usrEmail
      : undefined,
  usrName: () =>
    sessionExist()
      ? JSON.parse(localStorage.getItem('__session')).usrName
      : undefined,
  usrLastName: () =>
    sessionExist()
      ? JSON.parse(localStorage.getItem('__session')).usrLastName
      : undefined,
  usrRol: () =>
    sessionExist()
      ? JSON.parse(localStorage.getItem('__session')).rolId
      : undefined,
  status: () =>
    sessionExist()
      ? JSON.parse(localStorage.getItem('__session')).usrStatus
      : undefined,
  usrStatus: () =>
    sessionExist()
      ? JSON.parse(localStorage.getItem('__session')).usrStatus
      : undefined,
  notReg: () =>
    sessionExist()
      ? JSON.parse(localStorage.getItem('__session')).notReg
      : undefined,
  token: () =>
    sessionExist()
      ? JSON.parse(localStorage.getItem('__session')).token
      : undefined,
}

export default Session
