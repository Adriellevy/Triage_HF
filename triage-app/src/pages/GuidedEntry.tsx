import { Link } from 'react-router-dom'
import PatientForm from '@/components/PatientForm'
import Dashboard from '@/components/Dashboard/Dashboard'

function GuidedEntry() {
  return (
    <div>
      <PatientForm />
      <Dashboard />
    </div>
  )
}

export default GuidedEntry
