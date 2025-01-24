import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { set } from 'lodash'

interface DoctorSelection {
  previousValue: string | null
  newValue: string | null
}

interface ShiftSelectionsState {
  doctorSelections: Record<string, DoctorSelection>
  nurseSelections: Record<string, DoctorSelection>
  procedures: Record<string, DoctorSelection>
  observations: Record<string, DoctorSelection>
  record: Record<string, DoctorSelection>
}

const initialState: ShiftSelectionsState = {
  doctorSelections: {},
  nurseSelections: {},
  procedures: {},
  observations: {},
  record: {}
}

const shiftSelectionsSlice = createSlice({
  name: 'shiftSelections',
  initialState,
  reducers: {
    setDoctorSelections: (
      state,
      action: PayloadAction<{
        patient_id: string
        previousValue: string | null
        newValue: string | null
      }>
    ) => {
      const { patient_id, previousValue, newValue } = action.payload
      state.doctorSelections[patient_id] = { previousValue, newValue }
    },
    setNurseSelections: (
      state,
      action: PayloadAction<{
        patient_id: string
        previousValue: string | null
        newValue: string | null
      }>
    ) => {
      const { patient_id, previousValue, newValue } = action.payload
      state.nurseSelections[patient_id] = { previousValue, newValue }
    },
    setRXProcedures: (
      state,
      action: PayloadAction<{
        patient_id: string
        previousValue: string | null
        newValue: string | null
      }>
    ) => {
      const { patient_id, previousValue, newValue } = action.payload
      state.procedures[patient_id] = { previousValue, newValue }
    },
    setRXObservations: (
      state,
      action: PayloadAction<{
        patient_id: string
        previousValue: string | null
        newValue: string | null
      }>
    ) => {
      const { patient_id, previousValue, newValue } = action.payload
      state.observations[patient_id] = { previousValue, newValue }
    },
    setRXRecord: (
      state,
      action: PayloadAction<{
        patient_id: string
        previousValue: string | null
        newValue: string | null
      }>
    ) => {
      const { patient_id, previousValue, newValue } = action.payload
      state.record[patient_id] = { previousValue, newValue }
    }
  }
})

export const {
  setDoctorSelections,
  setNurseSelections,
  setRXProcedures,
  setRXRecord,
  setRXObservations
} = shiftSelectionsSlice.actions
export default shiftSelectionsSlice.reducer
