import { z } from "zod";

export const competitionSchema = z
  .object({
    title: z.string().min(1, "Nincs név megadva"),
    description: z.string().min(1, "Nincs leírás megadva"),
    image: z.string().cuid({ message: "Nincs kép kiválasztva" }),
    teamCompetition: z.boolean(),
    teamLimit: z.number(),
  })
  .refine(({ teamCompetition, teamLimit }) => {
    if (!teamCompetition && teamLimit != 1) return false;
    return true;
  }, "Egyéni versenyen a max. csapatlétszám csak 1 lehet!");

export type CompetitionSchema = z.output<typeof competitionSchema>;
