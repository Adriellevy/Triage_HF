import { ShiftChange } from './Shift-change.ts'

export interface Shift {
  id: string
  shift_day: string
  shift_start_time: number
  shift_end_time: number
  user_id?: number
}
export interface ShiftComplete {
  shift: Shift
  shiftChanges: ShiftChange[]
}
