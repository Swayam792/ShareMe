import nodemailer from "nodemailer";

const sendMail = async ({ from, to, subject, text, html}) => {
     let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
     });

     let info = await transporter.sendMail({
        from: `ShareMe <${from}`,
        to: to,
        subject: subject,
        text: text,
        html: html, 
     })
}

export default sendMail;