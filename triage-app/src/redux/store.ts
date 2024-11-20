import { configureStore } from '@reduxjs/toolkit';
import SEpatientChangesReducer from './reducers/SEpatientsReducer';

const store = configureStore({
  reducer: {
    patientChanges: SEpatientChangesReducer, 
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
