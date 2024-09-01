import bcrypt from "bcrypt";
import { prisma } from "~/db/prismaClient";
import { initSchema } from "~/schemas/initSchema";
import createNotification from "~/utils/createNotification";
import { logEventAction } from "~/utils/logger";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const parsedBody = initSchema.safeParse(body);

  if (!parsedBody.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "form-invalid",
    });
  }

  const passwordHashPromise = bcrypt.hash(parsedBody.data.password, 10);

  const initDoneQuery = await prisma.option.findUnique({
    where: {
      name: "initDone",
    },
  });
  const initDone = (initDoneQuery?.value as boolean) ?? false;

  if (initDone) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "init-already-done",
    });
  }

  const passwordHash = await passwordHashPromise;
  const newUser = await prisma.user.create({
    data: {
      email: parsedBody.data.email,
      emailToken: "",
      emailVerified: true,

      username: parsedBody.data.username,
      fullname: "Initial User",
      class: {
        create: {
          name: "Admin",
          hidden: true,
          group: {
            create: {
              name: "Admin",
              year: 99,
              hidden: true,
            },
          },
        },
      },
      adminClass: 2,

      passwordHash: passwordHash,
      ownPc: true,
      ethernetPort: true,
      ownChair: true,
      paid: true,

      seat: {
        create: {
          name: "INIT-SEAT",
          public: false,
        },
      },
    },
  });

  await prisma.option.upsert({
    where: {
      name: "initDone",
    },
    update: {
      value: true,
    },
    create: {
      name: "iniDone",
      value: true,
    },
  });

  logEventAction(event, {
    category: "INIT",
    severity: "INFO",
    message: `Initial user "${newUser.username}" (ID: ${newUser.id}) created.`,
  });

  return {
    notification: createNotification("SUCCESS", {
      message: "Inicializáció sikeres!",
    }),
  };
});
