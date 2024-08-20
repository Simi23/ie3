import { createTransport } from "nodemailer";

const { host, port, secure, user, password, from } =
  useRuntimeConfig().smtpSettings;

const transporter = createTransport({
  host: host,
  port: port,
  secure: secure,
  auth: {
    user: user,
    pass: password,
  },
});

export async function sendMail(
  recipient: string,
  subject: string,
  content: string,
  htmlContent: string,
) {
  await transporter.sendMail({
    from: from,
    to: recipient,
    subject: subject,
    text: content,
    html: htmlContent,
  });
}
