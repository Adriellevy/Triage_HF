import 'dotenv/config';
import './config/envvars';
import express, { type Request, type Response } from 'express';
import { createServer } from 'http';
import authenticateToken from './middlewares/authMiddleware';
import initializeSocketMiddleware from './middlewares/socketMiddleware';
import { corsMiddleware } from './middlewares/corsMiddleware';
import { patientRouter } from './routes/patientRoutes';
import { boxRouter } from './routes/boxRoutes';
import { authRouter } from './routes/authRoutes';
import { userRouter } from './routes/userRoutes';
import { settingsRouter } from './routes/settingRoutes';
import { dashboardRouter } from './routes/dashboardRoutes';
import { nodemailerRouter } from './routes/nodemailerRoutes';

const PORT = process.env.PORTAPI ?? 3000;

const app = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(corsMiddleware());

const httpServer = createServer(app);

app.use(initializeSocketMiddleware(httpServer));

app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Triage Api</h1>');
});

app.use('/auth', authRouter);
app.use('/nodemailer', nodemailerRouter);
app.use('/patient', authenticateToken, patientRouter);
app.use('/box', authenticateToken, boxRouter);
app.use('/users', authenticateToken, userRouter);
app.use('/settings', authenticateToken, settingsRouter);
app.use('/dashboard', authenticateToken, dashboardRouter);

app.use((req: Request, res: Response) => {
  res.status(404).send('<h1>404</h1>');
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
