// actions/patientChangesActions.js
export const addOrUpdateChange = (id_paciente, id_nuevodoc, id_nuevoenf) => ({
    type: 'ADD_OR_UPDATE_CHANGE',
    payload: { id_paciente, id_nuevodoc, id_nuevoenf },
  });
  
  export const removeChange = (id_paciente) => ({
    type: 'REMOVE_CHANGE',
    payload: { id_paciente },
  });

  export const cleanChanges = () => ({
    type: 'CLEAN_CHANGES',
    payload: {}
  })
  
  