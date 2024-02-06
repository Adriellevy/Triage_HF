export enum UserRole {
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  HOSPITAL = 'HOSPITAL'
}

export interface User {
  user_id: number
  user_name: string
  user_email: string
  user_password: string
  user_type: UserRole
  speciality?: string
  state?: boolean

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [Symbol.iterator](): IterableIterator<any>
}
export interface PartialUser {
  user_id: number
  user_name?: string
  user_email?: string
  user_password?: string
  user_type?: UserRole
  speciality?: string
  state?: boolean
}
