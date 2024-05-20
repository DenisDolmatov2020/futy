const nodemailer = require('nodemailer')
require('dotenv').config()

const confirmationEmailSubject = 'Confirm your email'
const confirmationEmailHtml = `<html lang="en">
<head>
<title>Time Caps</title>
  <style>
    body {
        background-color: #F4F4F4
        font-family: Arial, sans-serif
        padding: 20px
        margin: 0
    }

    .container {
        border-radius: 10px
        background-color: #FFFFFF
        padding: 20px
        box-shadow: 0px 0px 10px #CCCCCC
    }

    .btn {
        display: inline-block
        background-color: #4CAF50
        color: #FFFFFF
        padding: 10px 20px
        margin-top: 20px
        border-radius: 5px
        text-decoration: none
        cursor: pointer
    }

    .btn:hover {
        background-color: #3E8E41
    }

    .link {
        display: inline-block
        margin-top: 20px
        font-size: 14px
        color: #666666
        text-decoration: none
    }

    .link:hover {
        color: #333333
    }

    </style>
</head>
<body>
  <div class="container">
    <h1>${confirmationEmailSubject}</h1>
    <p>Thank you for registering. Please confirm your email address by clicking on the following link:</p>
    <a href="{{confirmationLink}}" class="button">Confirm email address</a>
    <p>Alternatively, you can copy and paste the following link into your browser:</p>
    <p><a href="{{confirmationLink}}">{{confirmationLink}}</a></p>
  </div>
</body>
</html>`

class SMPTService {
    async sendConfirmationEmail(user) {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })

        const confirmationLink = `${process.env.API_URL}:${process.env.API_PORT}/api/user/confirm?email=${user.email}`

        const html = confirmationEmailHtml.replace('{{confirmationLink}}', confirmationLink)

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: confirmationEmailSubject,
            html
        }

        return transporter.sendMail(mailOptions)
    }
}


module.exports = new SMPTService()
