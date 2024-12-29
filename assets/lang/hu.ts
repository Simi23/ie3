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
  "user-not-found": "A felhasználó nem található!",
  "request-body-invalid": "Feltöltés sikertelen!",
  "storing-file-failed": "A fájl tárolása meghiúsult!",
};

export const huLang = new Proxy(strings, handler);
