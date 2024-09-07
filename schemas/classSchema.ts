import { z } from "zod";

export const classSchema = z.object({
  name: z.string(),
  groupId: z.string(),
  hidden: z.boolean(),
});

export type ClassSchema = z.output<typeof classSchema>;
