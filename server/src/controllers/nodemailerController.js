import NodeMailer from 'nodemailer'

export class NodemailerController {
  static async SendEmailTest(req, res) {
    try {
      const transporter = NodeMailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'micah33@ethereal.email',
          pass: 'QPvZ6nF6RrxXnDpuez',
        },
      })

      const mailOptions = {
        from: 'joel.walker@ethereal.email',
        to: 'micah33@ethereal.email',
        subject: 'Email Test',
        text: 'Texto de prueba ',
      }
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          // eslint-disable-next-line no-console
          console.error('Error sending email:', error)
        } else {
          // eslint-disable-next-line no-console
          console.log('Email sent:', info.response)
        }
      })
      return res.status(200).json({ message: 'Good' })
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' })
    }
  }
}
