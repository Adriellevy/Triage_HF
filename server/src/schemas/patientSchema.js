import z from 'zod'

// TODO
const patientSchema = z.object({
  patient_name: z.string({
    required_error: 'Name is required ',
  }),
})

export function validatePatient(input) {
  return patientSchema.safeParse(input)
}

export function validatePartialPatient(input) {
  return patientSchema.partial().safeParse(input)
}
