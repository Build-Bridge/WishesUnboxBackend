import sendEmail from './mailer'
import type { Response } from 'express'

// util to share card through email

const sendCard = async (card: any, cardLink: string, res: Response): Promise<void> => {
  const message = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
        }
        .container {
          max-width: 600px;
          margin: auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 10px;
          background-color: #f9f9f9;
        }
        .title {
          font-size: 20px;
          margin-bottom: 10px;
          color: #333;
        }
        .message {
          margin-bottom: 20px;
          color: #333;
        }
        .link {
          font-weight: bold;
          color: #007bff;
          text-decoration: none;
        }
        .link:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2 class="title">You have received a card!</h2>
        <p class="message">Hello ${card.receiver},</p>
        <p class="message">You have received a card from ${card.sender} for ${card.occasion}.</p>
        <p class="message">${card.wish}</p>
        <p class="message">If you have not requested this email, please ignore it.</p>
        <p class="message">Use this <a class="link" href="${cardLink}">link</a> to view the card.</p>
      </div>
    </body>
  </html>
`
  try {
    await sendEmail({
      email: card.email,
      subject: `Wishes Unbox - ${card.occasion}`,
      message
    })
    res.status(200).json({ success: true, message: `Card sent to ${card.email}` })
  } catch (error: Error | any) {
    res.status(500).json({ success: false, message: 'Card not sent' })
  }
}
export default sendCard
