import { z } from "zod";

export const initSchema = z
  .object({
    username: z.string().min(4, "Legalább 4 karakternek kell lennie!"),
    email: z.string().email("Helyes email cím megadása kötelező!"),
    password: z.string().min(8, "Legalább 8 karakternek kell lennie!"),
    confirmPassword: z.string().min(8, "Legalább 8 karakternek kell lennie!"),
  })
  .refine((data) => data.password == data.confirmPassword, {
    message: "Nem egyeznek a jelszavak!",
    path: ["confirmPassword"],
  });

export type InitSchema = z.output<typeof initSchema>;
