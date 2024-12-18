import { z } from "zod";

export const registrationSchema = z
  .object({
    fullname: z.string().min(1, "Adja meg a teljes nevét!"),
    username: z.string().min(4, "Legalább 4 karakternek kell lennie!"),
    email: z.string().email("Helyes email cím megadása kötelező!"),
    password: z.string().min(8, "Legalább 8 karakternek kell lennie!"),
    confirmPassword: z.string().min(8, "Legalább 8 karakternek kell lennie!"),
    classId: z.string().min(1, "Válassza ki az osztályát!"),
    ownPc: z.boolean(),
    ethernetPort: z.boolean(),
    ownChair: z.boolean(),
    seatName: z.string().min(1, "Válasszon ki egy ülőhelyet!"),
  })
  .refine((data) => data.password == data.confirmPassword, {
    message: "Nem egyeznek a jelszavak!",
    path: ["confirmPassword"],
  });

export type RegistrationSchema = z.output<typeof registrationSchema>;
