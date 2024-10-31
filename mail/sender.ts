import { createTransport } from "nodemailer";
import { prisma } from "~/db/prismaClient";

interface EmailSettings {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  from: string;
}

const result = await prisma.option.findFirst({
  where: {
    name: "email",
  },
});

const { host, port, secure, user, password, from } = (result ?? {
  host: "127.0.0.1",
  port: 25,
  secure: false,
  user: "user",
  password: "password",
  from: "user",
}) as EmailSettings;

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
