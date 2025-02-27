export const isTokenExpired = (token: string): boolean => {
  const payload = JSON.parse(atob(token.split('.')[1]))
  const expiry = payload.exp * 1000
  return Date.now() > expiry
}
