import { createTransport } from "nodemailer";
import { prisma } from "~/db/prismaClient";
import type { Transporter } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { catchError } from "~/utils/catchError";

interface EmailSettings {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  from: string;
}

// The cached transporter object
let transporter: Transporter<
  SMTPTransport.SentMessageInfo,
  SMTPTransport.Options
> | null = null;

// Read or create the transporter object
async function getTransporter(): Promise<
  Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>
> {
  if (transporter == null) {
    console.log("Creating email transporter...");
    const result = await prisma.option.findFirst({
      where: {
        name: "email",
      },
    });
    let settings = {} as EmailSettings;
    if (result == null) {
      settings = {
        host: "127.0.0.1",
        port: 25,
        secure: false,
        user: "user",
        password: "password",
        from: "user",
      };
    } else {
      settings = result.value as unknown as EmailSettings;
    }

    transporter = createTransport({
      host: settings.host,
      port: settings.port,
      secure: settings.secure,
      auth: {
        user: settings.user,
        pass: settings.password,
      },
      from: settings.from,
    });

    const [error, data] = await catchError(transporter.verify());
    if (error) {
      console.log(`Transporter error: ${error.message}`);
    } else {
      console.log("Transporter verification successful!");
    }
  }

  return transporter;
}

export async function sendMail(
  recipient: string,
  subject: string,
  content: string,
  htmlContent: string,
  bgCid: string,
) {
  await (
    await getTransporter()
  ).sendMail({
    from: transporter?.options.from,
    to: recipient,
    subject: subject,
    text: content,
    html: htmlContent,
    attachments: [
      {
        cid: bgCid,
        filename: "background.jpg",
        path: "./public/mailbg.jpg",
        encoding: "base64",
        contentDisposition: "inline",
      },
    ],
  });
}
