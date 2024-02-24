import express from 'express'
import { createServer } from 'http'
import 'dotenv/config'
import authenticateToken from './src/middlewares/authMiddleware.js'
import initializeSocketMiddleware from './src/middlewares/socketMiddleware.js'
import { corsMiddleware } from './src/middlewares/corsMiddleware.js'
import { patientRouter } from './src/routes/patientRoutes.js'
import { boxRouter } from './src/routes/boxRoutes.js'
import { authRouter } from './src/routes/authRoutes.js'
import { userRouter } from './src/routes/userRoutes.js'
import { settingsRouter } from './src/routes/settingRoutes.js'

const PORT = process.env.PORTAPI ?? 3000

const app = express()
app.disable('x-powered-by')
app.use(express.json())
app.use(corsMiddleware())

const httpServer = createServer(app)

app.use(initializeSocketMiddleware(httpServer))

app.get('/', (req, res) => {
  res.send('<h1>Triage Api</h1>')
})

app.use('/auth', authRouter)
app.use('/patient', authenticateToken, patientRouter)
app.use('/box', authenticateToken, boxRouter)
app.use('/users', authenticateToken, userRouter)
app.use('/settings', authenticateToken, settingsRouter)

app.use((req, res) => {
  res.status(404).send('<h1>404</h1>')
})

httpServer.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${PORT}`)
})
