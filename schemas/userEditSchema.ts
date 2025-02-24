import { z } from "zod";

export const userEditSchema = z.object({
  fullname: z.string().min(1, "Kötelező"),
  classId: z.string().cuid(),
  email: z.string().email(),
  adminClass: z.number().min(0).max(2),
  ownPc: z.boolean(),
  ethernetPort: z.boolean(),
  ownChair: z.boolean(),
});

export type UserEditSchema = z.output<typeof userEditSchema>;
