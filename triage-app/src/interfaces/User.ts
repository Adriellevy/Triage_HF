export enum UserRole {
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  HOSPITAL = 'HOSPITAL'
}

export interface User {
  user_id: string
  user_name: string
  user_full_name: string
  user_email: string
  user_password: string
  user_type: UserRole
  user_specialization?: string
  state?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [Symbol.iterator](): IterableIterator<any>
}

export interface PartialUser {
  user_id?: string
  user_name?: string
  user_full_name?: string
  user_email?: string
  user_password?: string
  user_type?: UserRole
  user_specialization?: string
  state?: boolean

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [Symbol.iterator]?(): IterableIterator<any>
}
