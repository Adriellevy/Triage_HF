export interface User {
  user_id: number
  user_name: string
  user_email: string
  user_password: string
  user_type: 'DOCTOR' | 'NURSE' | 'HOSPITAL'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [Symbol.iterator](): IterableIterator<any>
}
export interface PartialUser {
  user_id: number
  user_name?: string
  user_email?: string
  user_password?: string
  user_type?: 'DOCTOR' | 'NURSE' | 'HOSPITAL'
}
