import nodemailer from "nodemailer";
const sendEmail = async (option) => {
  //create a transporter -> it uses as service to sed mails
  //   const transporter = nodemailer.createTransport({  for -> mail trap
  //     host: process.env.EMAIL_HOST,
  //     port: process.env.EMAIL_PORT,
  //     auth: {
  //       user: process.env.EMAIL_USER,
  //       pass: process.env.EMAIL_PASSWORD,
  //     },
  //   });

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_HOST,

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const emailOptions = {
    from: "Site Name support<support@xyz.com>",
    to: option.email,
    subject: option.subject,
    text: option.message,
  };
  await transporter.sendMail(emailOptions);
};

export { sendEmail };
