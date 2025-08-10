class EmailService {
  constructor() {
    console.log("Email service initialized")
  }

  sendEmail(from: string, to: string, subject: string, body: string) {
    console.log("Email sent", from, to, subject, body)
  }
}

export default EmailService
