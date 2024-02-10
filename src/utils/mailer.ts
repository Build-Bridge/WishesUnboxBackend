import nodemailer from 'nodemailer'

const sendEmail = async (options: any): Promise<void> => {
  // 1. Create a transporter object using the default SMTP transport.
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  })

  // 2. Define the email options.
  const mailOptions = {
    from: '"Wishes Unbox"<th3buildbridge@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  }

  // 3. Send the email.
  await transport.sendMail(mailOptions)
}

// Export sendEmail.
export default sendEmail
