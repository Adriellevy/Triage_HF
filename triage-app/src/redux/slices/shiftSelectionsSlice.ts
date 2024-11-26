import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DoctorSelection {
  previousValue: string | null;
  newValue: string | null;
}

interface ShiftSelectionsState {
  doctorSelections: Record<string, DoctorSelection>;
  nurseSelections: Record<string, DoctorSelection>;
}

const initialState: ShiftSelectionsState = {
  doctorSelections: {},
  nurseSelections: {},
};

const shiftSelectionsSlice = createSlice({
  name: 'shiftSelections',
  initialState,
  reducers: {
    setDoctorSelections: (
      state,
      action: PayloadAction<{ patient_id: string; previousValue: string | null; newValue: string | null }>
    ) => {
      const { patient_id, previousValue, newValue } = action.payload;
      state.doctorSelections[patient_id] = { previousValue, newValue };
    },
    setNurseSelections: (
      state,
      action: PayloadAction<{ patient_id: string; previousValue: string | null; newValue: string | null }>
    ) => {
      const { patient_id, previousValue, newValue } = action.payload;
      state.nurseSelections[patient_id] = { previousValue, newValue };
    },
  },
});

export const { setDoctorSelections, setNurseSelections } = shiftSelectionsSlice.actions;
export default shiftSelectionsSlice.reducer;
