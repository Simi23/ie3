import { z } from "zod";

export const newUserSchema = z.object({
  email: z.string().email("Helytelen email cím!"),
  username: z.string().min(1, "Felhasználónév megadása kötelező!"),
  fullname: z.string().min(1, "Név megadása kötelező!"),
  classId: z.string().cuid("Helytelen osztály!"),
  ownPc: z.boolean(),
  ethernetPort: z.boolean(),
  ownChair: z.boolean(),
  seatId: z.string().cuid("Helytelen ülőhely!"),
});

export type NewUserSchema = z.output<typeof newUserSchema>;
