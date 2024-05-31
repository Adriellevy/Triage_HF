import NodeMailer from 'nodemailer';
import { type Request, type Response } from 'express';

export class NodemailerController {
  static async SendEmailTest(req: Request, res: Response): Promise<void> {
    try {
      const emailUser = process.env.EMAIL_USER;
      const emailPass = process.env.EMAIL_PASS;

      if (!emailUser || !emailPass) {
        console.error('Email credentials are not provided.');
        res.status(500).json({ message: 'Email credentials are not provided' });
      }

      const transporter = NodeMailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: 'Email Test',
        text: 'Texto de prueba '
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).json({ message: 'Error sending email' });
        }
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Email sent successfully' });
      });
    } catch (error) {
      console.error('Error in SendEmailTest:', error);
      res.status(500).json({ message: 'Something goes wrong' });
    }
  }
}
