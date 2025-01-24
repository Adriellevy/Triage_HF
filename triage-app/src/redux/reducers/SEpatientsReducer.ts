// reducers/patientChangesReducer.js
const initialState = [] // Estado inicial como un array vacío

const SEpatientChangesReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_OR_UPDATE_CHANGE': {
      const { id_paciente, id_nuevodoc, id_nuevoenf, procedures, observations, record } =
        action.payload

      // Buscar si ya existe un cambio para este paciente
      const existingIndex = state.findIndex((change) => change.id_paciente === id_paciente)

      if (existingIndex !== -1) {
        // Si ya existe, actualizar los datos
        const updatedState = [...state]
        updatedState[existingIndex] = {
          ...updatedState[existingIndex],
          id_nuevodoc,
          id_nuevoenf,
          procedures,
          observations,
          record
        }
        return updatedState
      }

      // Si no existe, agregar un nuevo cambio
      return [...state, { id_paciente, id_nuevodoc, id_nuevoenf }]
    }

    case 'REMOVE_CHANGE': {
      const { id_paciente } = action.payload

      // Eliminar el cambio del paciente especificado
      return state.filter((change) => change.id_paciente !== id_paciente)
    }

    case 'CLEAN_CHANGES': {
      return []
    }

    default:
      return state
  }
}

export default SEpatientChangesReducer
