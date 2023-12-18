import express from 'express'
import 'dotenv/config'

import { corsMiddleware } from './src/middlewares/corsMiddleware.js'
import { patientRouter } from './src/routes/patientRoutes.js'
import { doctorRouter } from './src/routes/doctorRoutes.js'
import { authRouter } from './src/routes/authRoutes.js'

const PORT = process.env.PORTAPI ?? 3000

const app = express()
app.disable('x-powered-by')
app.use(express.json())
app.use(corsMiddleware())

app.get('/', (req, res) => {
  res.send('<h1>Triage Api</h1>')
})

app.use('/auth', authRouter)
app.use('/patient', patientRouter)
app.use('/doctor', doctorRouter)

app.use((req, res) => {
  res.status(404).send('<h1>404</h1>')
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`server listening on port http://localhost:${PORT}`)
})
