import nodemailer from "nodemailer";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export const sendMail = (email: string, resetToken: string) => {
    const link = `http://localhost:4200/resetPassword/${resetToken}`;
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        port: 25,
        auth: {
            user: 'testingmycode011@gmail.com',
            pass: 'testCodeChinmay'
        }
        // user: 'surajkale10148@gmail.com',
        // pass: 'Suraj@123#'
    });
    if (resetToken) {
        let mailOptions = {
            from: 'test@gmail.com',
            to: `${email}`,
            subject: `RESET PASSWORD`,
            html: `<h1>Welcome</h1>
                <h2>That was easy!</h2>
                <h4>Link for resetting your password - <a href="${link}">link</a> <h4>
                <p>expires in 30 minutes*</p>`
        };
        
        transporter.sendMail(mailOptions, function (err: any, data: any) {
            if (err) { console.log(err); }
            else { console.log(`email send`); }
        });
    }
}