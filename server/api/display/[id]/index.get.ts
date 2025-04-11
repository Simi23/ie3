import { $Enums } from "@prisma/client";
import { prisma } from "~/db/prismaClient";
import adminCheck from "~/utils/adminCheck";
import { catchError } from "~/utils/catchError";

export type DisplayIdGetResponse = {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  order: number;
  type: $Enums.DisplayContentType;
  name: string;
  displayTimeMs: number;
  showProgress: boolean;
  shortText: string | null;
  formattedTextId: string | null;
  bracketId: string | null;
  mediaId: string | null;
  topListId: string | null;
};

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (id === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "request-body-invalid",
    });
  }

  const [error, data] = await catchError(
    prisma.displayContent.findFirst({
      where: {
        id: id,
      },
    }),
  );

  if (error || data === null) {
    throw createError({
      statusCode: 404,
      statusMessage: "Resource Not Found",
      message: "content-not-found",
    });
  }

  return data;
});
