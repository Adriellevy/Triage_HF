import z from 'zod'

const patientSchema = z.object({
  patient_name: z.string().max(50),
  patient_age: z.string(),
  patient_entry_time: z.string(),
  patient_exit_time: z.string().nullable(),
  patient_triage_time: z.string(),
  patient_triage_level: z.number().int().nullable(),
  patient_isolated: z.boolean(),
  patient_status: z.enum([
    'ALTA',
    'EN OBSERVACION',
    'EN ESPERA DE INTERNACION',
    'INTERNADO',
    'AFUERA',
  ]),
  patient_symptom: z.string().min(1).max(500),
  patient_healthcare_system: z.string().min(1).max(500),
  doctor_id: z.string(),
  nurse_id: z.string(),
  box_id: z.string().nullable(),
})

export function validatePatient(input) {
  return patientSchema.safeParse(input)
}

export function validatePartialPatient(input) {
  return patientSchema.partial().safeParse(input)
}
