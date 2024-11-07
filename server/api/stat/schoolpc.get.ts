import { prisma } from "~/db/prismaClient";

export default defineEventHandler(async (event) => {
  let totalPcs = prisma.option.findFirst({
    where: {
      name: "schoolPC",
    },
  });
  let occupiedPcs = prisma.user.count({
    where: {
      ownPc: false,
    },
  });

  const results = await Promise.allSettled([totalPcs, occupiedPcs]);

  const cTotal =
    results[0].status == "fulfilled" ? Number(results[0].value?.value ?? 0) : 0;
  const cOccupied = results[1].status == "fulfilled" ? results[1].value : 0;

  return {
    totalPcs: cTotal,
    freePcs: cTotal - cOccupied,
    occupiedPcs: cOccupied,
  };
});
