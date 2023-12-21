import z from 'zod'

// TODO
const patientSchema = z.object({
  patient_name: z
    .string({
      required_error: 'Name is required ',
    })
    .min(1)
    .max(50),
  date_of_birth: z.string(),
  entry_time: z.string(),
  exit_time: z.string().nullable(),
  patient_triage_time: z.string(),
  patient_triage_level: z.number().int().nullable(),
  patient_status: z.enum([
    'ALTA',
    'EN ESPERA',
    'EN ESPERA DE INTERNACION',
    'INTERNADO',
  ]),
  patient_problem: z.string().min(1).max(500),
  patient_medication: z.string().min(1).max(500),
  doctor_id: z.number().int().nullable(),
  nurse_id: z.number().int().nullable(),
  box_id: z.number().int().nullable(),
})

export function validatePatient(input) {
  return patientSchema.safeParse(input)
}

export function validatePartialPatient(input) {
  return patientSchema.partial().safeParse(input)
}
