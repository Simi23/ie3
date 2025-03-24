import { z } from "zod";

export const registrationSchema = z
  .object({
    fullname: z.string().min(1, "Add meg a teljes nevedet!"),
    username: z
      .string()
      .min(4, "Legalább 4 karakternek kell lennie!")
      .regex(
        /^[a-zA-Z0-9áéíóöőúüűÁÉÍÓÖŐÚÜŰ\-._]+$/i,
        "Lehetséges karakterek: a-z A-Z 0-9 . -",
      ),
    email: z.string().email("Helyes email cím megadása kötelező!"),
    password: z.string().min(8, "Legalább 8 karakternek kell lennie!"),
    confirmPassword: z.string().min(8, "Legalább 8 karakternek kell lennie!"),
    classId: z.string().min(1, "Válaszd ki az osztályodat!"),
    ownPc: z.boolean(),
    ethernetPort: z.boolean(),
    ownChair: z.boolean(),
    seatName: z.string().min(1, "Válassz ki egy ülőhelyet!"),
  })
  .refine((data) => data.password == data.confirmPassword, {
    message: "Nem egyeznek a jelszavak!",
    path: ["confirmPassword"],
  });

export type RegistrationSchema = z.output<typeof registrationSchema>;

// 1/3

export const registrationSchema1p3 = z
  .object({
    email: z.string().email("Helyes email cím megadása kötelező!"),
    username: z
      .string()
      .min(4, "Legalább 4 karakternek kell lennie!")
      .regex(
        /^[a-zA-Z0-9áéíóöőúüűÁÉÍÓÖŐÚÜŰ\-._]+$/i,
        "Lehetséges karakterek: a-z A-Z 0-9 . -",
      ),
    password: z.string().min(8, "Legalább 8 karakternek kell lennie!"),
    confirmPassword: z.string().min(8, "Legalább 8 karakternek kell lennie!"),
  })
  .refine((data) => data.password == data.confirmPassword, {
    message: "Nem egyeznek a jelszavak!",
    path: ["confirmPassword"],
  });

export type RegistrationSchema1p3 = z.output<typeof registrationSchema1p3>;

// 2/3

export const registrationSchema2p3 = z.object({
  fullname: z.string().min(1, "Add meg a teljes nevedet!"),
  classId: z.string().min(1, "Válaszd ki az osztályodat!"),
});

export type RegistrationSchema2p3 = z.output<typeof registrationSchema2p3>;

// 3/3

export const registrationSchema3p3 = z.object({
  ownPc: z.boolean(),
  ethernetPort: z.boolean(),
  ownChair: z.boolean(),
});

export type RegistrationSchema3p3 = z.output<typeof registrationSchema3p3>;

// SEAT

export const registrationSchemaSeat = z.object({
  seatName: z.string().min(1, "Válassz ki egy ülőhelyet!"),
});

export type RegistrationSchemaSeat = z.output<typeof registrationSchemaSeat>;
