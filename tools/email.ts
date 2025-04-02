import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string = '', text : string = '', html: string = '') => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            type: 'OAuth2',
            user: process.env.mailuser, // Your Gmail email address
            clientId: process.env.mailclientId, // OAuth 2.0 client ID
            clientSecret: process.env.mailclientSecret, // OAuth 2.0 client secret
            refreshToken: process.env.mailrefreshToken // OAuth 2.0 refresh token
          }
    });
    /*
     let transporter = nodemailer.createTransport({
        host: "smtp.yandex.ru",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.emailAddress, // generated ethereal user
            pass: process.env.emailPassword // generated ethereal password
        }
    });
    */
    let result = await transporter.sendMail({
        from: `"${process.env.PROJECT_NAME}" <${process.env.mailuser}>`,
        to: to,
        subject: subject,
        text: text,
        html: html,
    });
    return result
};