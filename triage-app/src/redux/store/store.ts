import { configureStore } from '@reduxjs/toolkit';
import SEpatientChangesReducer from '../reducers/SEpatientsReducer';
import shiftSelectionsReducer from '../slices/shiftSelectionsSlice.ts'; 

const store = configureStore({
  reducer: {
    patientChanges: SEpatientChangesReducer,
    shiftSelections: shiftSelectionsReducer, 
  },
  devTools: process.env.NODE_ENV !== 'production',
});


export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store