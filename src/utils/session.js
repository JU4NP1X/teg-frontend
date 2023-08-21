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
  id: () =>
    sessionExist()
      ? JSON.parse(localStorage.getItem('__session')).id
      : undefined,
  email: () =>
    sessionExist()
      ? JSON.parse(localStorage.getItem('__session')).email
      : undefined,
  firstName: () =>
    sessionExist()
      ? JSON.parse(localStorage.getItem('__session')).firstName
      : undefined,
  lastName: () =>
    sessionExist()
      ? JSON.parse(localStorage.getItem('__session')).lastName
      : undefined,
  isAdmin: () =>
    sessionExist()
      ? JSON.parse(localStorage.getItem('__session')).isAdmin
      : undefined,
  token: () =>
    sessionExist()
      ? JSON.parse(localStorage.getItem('__session')).token
      : undefined,
}

export default Session
