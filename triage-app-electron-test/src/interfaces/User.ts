export interface User {
  user_id: number
  user_name: string
  user_email: string
  user_password: string
  user_type: 'DOCTOR' | 'NURSE' | 'HOSPITAL'
}
