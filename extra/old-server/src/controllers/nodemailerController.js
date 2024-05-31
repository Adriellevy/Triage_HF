import NodeMailer from 'nodemailer'

export class NodemailerController {
  static async SendEmailTest(req, res) {
    try {
      const transporter = NodeMailer.createTransport(
        {
          service: "Gmail",
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
      })

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'adriellevy2014@gmail.com',
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
