import { z } from "zod";

export const bracketCreateSchema = z.object({
  title: z.string().min(1, "Név megadása kötelező!"),
  administrativeTitle: z.string().min(1, "Név megadása kötelező!"),
  numberOfCompetitors: z
    .number({ message: "Résztvevők száma kötelező!" })
    .min(1, "Legalább 1-nek kell lennie!"),
  competitionId: z.string().cuid("Verseny kiválasztása kötelező!"),
});
