import { z } from "zod";

export const classGroupSchema = z.object({
  name: z.string(),
  year: z.number(),
  hidden: z.boolean(),
});

export type ClassGroupSchema = z.output<typeof classGroupSchema>;
