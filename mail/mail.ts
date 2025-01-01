import { sendMail } from "./sender";
import { render } from "@vue-email/render";

import Test from "./templates/Test.vue";
import Register from "./templates/Register.vue";
import PasswordReset from "./templates/PasswordReset.vue";

export async function testMail(recipient: string) {
  const options = {
    title: "Teszt - Infósok Éjszakája",
    text: "Ha megkaptad ezt az üzenetet, akkor helyesek az email beállítások.",
  };

  const html = await render(Test, options, {
    pretty: true,
  });

  const plaintext = await render(Test, options, {
    plainText: true,
  });

  await sendMail(recipient, "Teszt - Infósok Éjszakája", plaintext, html);
}

export async function registerMail(recipient: string, emailVerifyLink: string) {
  const options = {
    title: "Email megerősítése",
    text: "Köszönjük a regisztrációt! Kérlek, az alábbi gomb megnyomásával erősítsd meg az email címedet!",
    emailVerifyLink: emailVerifyLink,
  };

  const html = await render(Register, options, {
    pretty: true,
  });

  const plaintext = await render(Register, options, {
    plainText: true,
  });

  await sendMail(
    recipient,
    "Email megerősítése - Infósok Éjszakája",
    plaintext,
    html,
  );
}

export async function passwordResetMail(
  recipient: string,
  passwordResetLink: string,
) {
  const options = {
    title: "Jelszó-visszaállítási kérelem",
    text: "Ezt a levelet azért kaptad, mert jelszó-visszaállítási kérelmet indítottál a fiókodra. Amennyiben nem te voltál, figyelmen kívül hagyhatod az emailt. A jelszavad visszaállításához kattints az alábbi gombra.",
    passwordChangeLink: passwordResetLink,
  };

  const html = await render(PasswordReset, options, {
    pretty: true,
  });

  const plaintext = await render(PasswordReset, options, {
    plainText: true,
  });

  await sendMail(
    recipient,
    "Jelszó visszaállítása - Infósok Éjszakája",
    plaintext,
    html,
  );
}
