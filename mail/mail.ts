import { sendMail } from "./sender";
import { render } from "@vue-email/render";

import Test from "./templates/Test.vue";

export async function testMail(recipient: string) {
  const html = await render(
    Test,
    {
      title: "Teszt - Infósok Éjszakája",
      text: "Ha megkaptad ezt az emailt, akkor helyesek az email beállítások.",
    },
    {
      pretty: true,
    },
  );
  const plaintext = await render(
    Test,
    {
      title: "Teszt - Infósok Éjszakája",
      text: "Ha megkaptad ezt az emailt, akkor helyesek az email beállítások.",
    },
    {
      plainText: true,
    },
  );
  await sendMail(recipient, "Teszt - Infósok Éjszakája", plaintext, html);
}
