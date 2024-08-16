import { z } from "zod";

export const loginStage1Schema = z.object({
  username: z.string().min(1, "Kötelező"),
});

export type LoginStage1Schema = z.output<typeof loginStage1Schema>;

export const loginStage2Schema = z.object({
  username: z.string().min(1, "Kötelező"),
  password: z.string().min(1, "Kötelező"),
});

export type LoginStage2Schema = z.output<typeof loginStage2Schema>;
