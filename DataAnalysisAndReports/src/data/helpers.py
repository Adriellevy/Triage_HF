import pandas as pd
import uuid
from datetime import datetime
import json


def transform_patient_data(patients_json):
    # Si recibes el JSON como cadena, asegúrate de cargarlo a un objeto Python
    if isinstance(patients_json, str):
        patients_json = json.loads(patients_json)

    # Función para convertir el buffer a UUID
    def buffer_to_uuid(buffer_data):
        return str(uuid.UUID(bytes=bytes(buffer_data)))

    # Parseamos cada registro del JSON
    parsed_patients = []
    for patient in patients_json:
        # Convertimos patient_id de buffer a UUID

        # Creamos el diccionario con los campos transformados
        parsed_patient = {
            "patient_id": None,
            "patient_name": patient["patient_name"],
            "patient_age": datetime.strptime(
                patient["patient_age"], "%Y-%m-%dT%H:%M:%S.%fZ"
            ).date(),
            "patient_entry_time": datetime.strptime(
                patient["patient_entry_time"], "%Y-%m-%dT%H:%M:%S.%fZ"
            ),
            "patient_exit_time": datetime.strptime(
                patient["patient_exit_time"], "%Y-%m-%dT%H:%M:%S.%fZ"
            ),
            "patient_triage_time": datetime.strptime(
                patient["patient_triage_time"], "%Y-%m-%dT%H:%M:%S.%fZ"
            ),
            "patient_triage_level": patient["patient_triage_level"],
            "patient_isolated": patient["patient_isolated"],
            "patient_status": patient["patient_status"],
            "patient_symptom": patient["patient_symptom"],
            "patient_healthcare_system": patient["patient_healthcare_system"],
            "doctor_procedure": patient["doctor_procedure"],
            "doctor_studies_solicitated": patient["doctor_studies_solicitated"],
            "nurse_coment": patient["nurse_coment"],
            "doctor_id": patient["doctor_id"],
            "nurse_id": patient["nurse_id"],
            "box_id": patient["box_id"],
        }

        # Imprimimos toda la información del paciente
        print("Paciente: ", parsed_patient)

        parsed_patients.append(parsed_patient)

    # Convertimos la lista de pacientes en un DataFrame
    df = pd.DataFrame(parsed_patients)
    return df
