import { prisma } from "~/db/prismaClient";
import adminCheck from "~/utils/adminCheck";
import createNotification from "~/utils/createNotification";
import { logEventAction } from "~/utils/logger";

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);

  const seats = [{ name: "SWAP", public: false }];

  const publicPrefixes = ["A-", "B-", "C-", "D-", "E-"];
  const privatePrefixes = ["HIDDEN-"];
  const minNum = 1;
  const maxNum = 18;

  fillSeatArray(seats, publicPrefixes, minNum, maxNum, true);
  fillSeatArray(seats, privatePrefixes, minNum, maxNum, false);

  const newSeats = await prisma.seat.createMany({
    data: seats,
  });

  logEventAction(event, {
    category: "OPTION",
    severity: "INFO",
    message: `User ${event.context.user?.username} has generated seats.`,
  });

  return {
    notification: createNotification("SUCCESS", {
      message: "Ülőhelyek sikeresen létrehozva!",
    }),
  };
});

function fillSeatArray(
  array: { name: string; public: boolean }[],
  prefixList: string[],
  minNum: number,
  maxNum: number,
  isPublic: boolean,
) {
  for (let i = 0; i < prefixList.length; i++) {
    const prefix = prefixList[i];
    for (let j = minNum; j <= maxNum; j++) {
      array.push({
        name: `${prefix}${j.toString().padStart(2, "0")}`,
        public: isPublic,
      });
    }
  }
}
