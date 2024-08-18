import { z } from "zod";

export const financeUpdateSchema = z.object({
  id: z.string().cuid(),
  paid: z.boolean(),
});

export type FinanceUpdateSchema = z.output<typeof financeUpdateSchema>;
