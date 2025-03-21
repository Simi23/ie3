import { prisma } from "~/db/prismaClient";
import adminCheck from "~/utils/adminCheck";
import { catchError } from "~/utils/catchError";

export default defineEventHandler(async (event) => {
  adminCheck(event, 1);

  const [error, data] = await catchError(
    prisma.user.findMany({
      select: {
        fullname: true,
        class: {
          select: {
            name: true,
          },
        },
        seat: {
          select: {
            name: true,
          },
        },
        email: true,
        paid: true,
        ownPc: true,
        ethernetPort: true,
        ownChair: true,
      },
    }),
  );

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "error-in-process",
    });
  }

  let file = [
    "Név,Osztály,Ülőhely,Email,Befizetve,Számítógép,Csatlakozás,Szék",
  ];

  const rows = data.map(
    (r) =>
      `${r.fullname},${r.class.name},${r.seat.name},${r.email},${r.paid ? "igen" : "nem"},${r.ownPc ? "saját" : "iskolai"},${r.ethernetPort ? "rj45" : "wifi"},${r.ownChair ? "saját" : "iskolai"}`,
  );

  file.push(...rows);

  return Buffer.from(file.join("\n"));
});
