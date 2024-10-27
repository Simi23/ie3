import { z } from "zod";

export const mailSettingSchema = z.object({
  host: z.string(),
  port: z.number().int().gte(1).lte(65535),
  secure: z.boolean(),
  user: z.string(),
  password: z.string(),
  from: z
    .string()
    .regex(
      /^.+?"<.+?>"$/,
      'Nem felel meg a formátumnak: Példa Küldő "<pelda@kuldo.com>"',
    ),
});

export type MailSettingSchema = z.output<typeof mailSettingSchema>;
