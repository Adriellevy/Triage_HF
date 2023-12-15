/* eslint-disable arrow-body-style */
/* eslint-disable no-return-await */
import bcrypt from 'bcrypt'

export const encrypt = async (data) => {
  const hash = await bcrypt.hash(data, 10)
  return hash
}

export const compare = async (passwordPlain, hashPassword) => {
  return await bcrypt.compare(passwordPlain, hashPassword)
}
