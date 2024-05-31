import z from 'zod';

const patientSchema = z.object({
  patient_name: z.string().max(50),
  patient_age: z.string(),
  patient_entry_time: z.string(),
  patient_exit_time: z.string().nullable(),
  patient_triage_time: z.string(),
  patient_triage_level: z.number().int().nullable(),
  patient_isolated: z.boolean(),
  patient_status: z.enum(['ALTA', 'EN OBSERVACION', 'AFUERA']),
  patient_symptom: z.string().min(1).max(500),
  // doctor_procedure: z.string().min(1).max(500),
  // doctor_studies_solicitated: z.string().min(1).max(500),
  nurse_coment: z.string().max(500),
  patient_healthcare_system: z.string().min(1).max(500),
  doctor_id: z.string(),
  nurse_id: z.string(),
  box_id: z.string().nullable()
});

type Patient = z.infer<typeof patientSchema>;
type PartialPatient = Partial<Patient>;

// Validación completa del paciente
export function validatePatient(input: unknown): z.SafeParseReturnType<unknown, Patient> {
  return patientSchema.safeParse(input);
}

// Validación parcial del paciente
export function validatePartialPatient(
  input: unknown
): z.SafeParseReturnType<unknown, PartialPatient> {
  return patientSchema.partial().safeParse(input);
}
