import nodemailer from "nodemailer";
import type { sendEmailOption } from "../typing";

const sendEmail = async (options: sendEmailOption) => {
  try {
    const transporterOptions = {
      host: process.env.SMPT_HOST,
      port: process.env.SMPT_PORT,
      service: process.env.SMPT_SERVICE,
      auth: {
        user: process.env.SMPT_MAIL,
        pass: process.env.SMPT_PASSWORD,
      },
    };

    const transporter = nodemailer.createTransport(transporterOptions as any);

    const mailOptions = {
      from: process.env.SMPT_MAIL,
      to: options.email,
      subject: options.subject,
      html: options.message,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw Error("Unable to send email");
  }
};

export default sendEmail;
