import { Button, Input, Label } from '@/components/ui'
import { useState } from 'react'

interface Params {
  desde: string
  hasta: string
  nombreyapellido: string
  motivodeconsulta: string
  box: string
  triage: string
  medico: string
  enfermero: string
  alta: string
  aislado: string
}

function Stats() {
  const [params, setParams] = useState<Params>({
    desde: '',
    hasta: '',
    nombreyapellido: '',
    motivodeconsulta: '',
    box: '',
    triage: '',
    medico: '',
    enfermero: '',
    alta: '',
    aislado: ''
  })

  const handleParamChange = (param: keyof Params, value: string) => {
    setParams((prevParams) => ({ ...prevParams, [param]: value }))
  }

  const [searchPerformed, setSearchPerformed] = useState(false)

  const handleSearch = () => {
    setSearchPerformed(true)
  }

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-4 rounded-md shadow-md'>
        <div>
          <Label htmlFor='desde'>Desde:</Label>
          <Input
            type='text'
            id='desde'
            value={params.desde}
            onChange={(e) => handleParamChange('desde', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor='hasta'>Hasta:</Label>
          <Input
            type='text'
            id='hasta'
            value={params.hasta}
            onChange={(e) => handleParamChange('hasta', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor='nombreyapellido'>Nombre y Apellido:</Label>
          <Input
            type='text'
            id='nombreyapellido'
            value={params.nombreyapellido}
            onChange={(e) => handleParamChange('nombreyapellido', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor='motivodeconsulta'>Motivo de Consulta:</Label>
          <Input
            type='text'
            id='motivodeconsulta'
            value={params.motivodeconsulta}
            onChange={(e) => handleParamChange('motivodeconsulta', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor='box'>Box:</Label>
          <Input
            type='text'
            id='box'
            value={params.box}
            onChange={(e) => handleParamChange('box', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor='triage'>Triage:</Label>
          <Input
            type='text'
            id='triage'
            value={params.triage}
            onChange={(e) => handleParamChange('triage', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor='medico'>Médico:</Label>
          <Input
            type='text'
            id='medico'
            value={params.medico}
            onChange={(e) => handleParamChange('medico', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor='enfermero'>Enfermero:</Label>
          <Input
            type='text'
            id='enfermero'
            value={params.enfermero}
            onChange={(e) => handleParamChange('enfermero', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor='alta'>Alta:</Label>
          <Input
            type='text'
            id='alta'
            value={params.alta}
            onChange={(e) => handleParamChange('alta', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor='aislado'>Aislado:</Label>
          <Input
            type='text'
            id='aislado'
            value={params.aislado}
            onChange={(e) => handleParamChange('aislado', e.target.value)}
          />
        </div>

        <Button color='blue' onClick={handleSearch}>
          Buscar
        </Button>
      </div>
      {searchPerformed && (
        <iframe
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          src={`http://localhost:5000/?${new URLSearchParams(params as any).toString()}`}
          title='Gráfico'
          width='100%'
          height='100%'
        ></iframe>
      )}
    </>
  )
}

export default Stats
