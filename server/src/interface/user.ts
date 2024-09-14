export enum UserRole {
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  HOSPITAL = 'HOSPITAL'
}

export interface User {
  user_id: string;
  user_name: string;
  user_full_name: string;
  user_email: string;
  user_password?: string;
  user_type: UserRole;
  user_specialization?: string;
  user_cellphone?: string;
  state?: boolean;
}
