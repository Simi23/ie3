const handler = {
  get: function (target: any, name: string): string {
    return Object.prototype.hasOwnProperty.call(target, name)
      ? target[name]
      : "Ismeretlen szöveg";
  },
};

const strings = {
  error: "Hiba",
  success: "Siker",
  warning: "Figyelmeztetés",
  information: "Információ",
  "unknown-error": "Ismeretlen hiba",
  "init-already-done": "Már megtörtént az inicializáció",
  "form-invalid": "Az űrlap kitöltése helytelen!",
  "user-invalid":
    "Ezzel a felhasználónév/jelszó kombinációval nem található fiók!",
  "email-not-verified": "A megadott email cím még nincs megerősítve!",
  "session-not-found": "Érvénytelen belépés! Kérlek, jelentkezz be!",
  "access-denied": "Hozzáférés megtagadva!",
  "validation-failed": "A megadott adatok helytelenek!",
  "classgroup-not-found": "Az évfolyam nem található!",
  "class-not-found": "Az osztály nem található!",
  "CSRF Token invalid": "Lejárt CSRF token. Frissítsd az oldalt!",
  "CSRF Cookie not found": "Nem található CSRF token. Frissítsd az oldalt!",
  "user-not-found": "A felhasználó nem található!",
  "request-body-invalid": "Feltöltés sikertelen!",
  "storing-file-failed": "A fájl tárolása meghiúsult!",
  "media-not-found": "A fájl nem létezik!",
  "email-already-exists": "Ezzel az email címmel már létezik fiók!",
  "username-already-exists": "Ezzel a felhasználónévvel már létezik fiók!",
  "seat-taken": "A kiválasztott ülőhely foglalt!",
  "no-more-pc": "Elfogytak az iskolai számítógépek!",
  "content-not-found": "A tartalom nem létezik!",
};

export const huLang = new Proxy(strings, handler);
