import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { prisma } from "~/db/prismaClient";
import adminCheck from "~/utils/adminCheck";
import createNotification from "~/utils/createNotification";
import { logEventAction } from "~/utils/logger";

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);

  // Read and validate the file from multipart/form-data
  const fd = await readMultipartFormData(event);
  if (fd == undefined || fd.length < 1) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "request-body-invalid",
    });
  }

  // Check if directory exists, create if doesn't exist
  const dirExists = existsSync("./public/images");
  if (!dirExists) {
    try {
      await mkdir("./public/images");
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Internal Server Error",
        message: "storing-file-failed",
      });
    }
  }

  // Parse the filename
  const filename = fd[0].filename ?? "unknown";
  const filenameSplit = filename.split(".");
  const extension = filenameSplit[filenameSplit.length - 1];

  // Create the file in the database
  const dbFile = await prisma.media.create({
    data: {
      name: filename,
      type: "Image",
      path: "NONE",
    },
  });

  // Generate the real filename from the database id
  const newFileName = dbFile.id + "." + extension;

  // Update the database with the new path
  const updatedDbFile = await prisma.media.update({
    where: {
      id: dbFile.id,
    },
    data: {
      path: "./public/images/" + newFileName,
      url: "/images/" + newFileName,
    },
  });

  // Write the file to the disk
  try {
    await writeFile(updatedDbFile.path, fd[0].data);
  } catch (error) {
    // If writing failed, delete the database entry
    await prisma.media.delete({
      where: {
        id: dbFile.id,
      },
    });
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "storing-file-failed",
    });
  }

  logEventAction(event, {
    category: "UPLOAD",
    severity: "INFO",
    message: `${event.context.user?.username} uploaded file "${updatedDbFile.name}"`,
  });

  return {
    notification: createNotification("SUCCESS", {
      message: "Fájl feltöltése sikeres!",
    }),
  };
});
