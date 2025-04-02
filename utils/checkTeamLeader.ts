import { prisma } from "~/db/prismaClient";
import { catchError } from "./catchError";

export default async function (
  userId: string,
  teamId: string,
  passThru?: boolean,
): Promise<boolean> {
  const [error, data] = await catchError(
    prisma.userInTeam.findFirst({
      where: {
        userId: userId,
        teamId: teamId,
      },
    }),
  );

  if (!passThru && (error !== undefined || data === null)) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "team-not-member",
    });
  } else if (passThru && (error !== undefined || data === null)) {
    return false;
  } else if (error !== undefined || data === null) {
    return false;
  }

  return data.isLeader;
}
