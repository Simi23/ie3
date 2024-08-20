const handler = {
  get: function (target: any, name: string): string {
    return Object.prototype.hasOwnProperty.call(target, name)
      ? target[name]
      : "Ismeretlen szöveg";
  },
};

const strings = {
  "unknown-error": "Ismeretlen hiba",
  error: "Hiba",
  "init-already-done": "Már megtörtént az inicializáció",
  "form-invalid": "Az űrlap kitöltése helytelen!",
  success: "Siker",
  warning: "Figyelmeztetés",
  information: "Információ",
  "user-invalid":
    "Ezzel a felhasználónév/jelszó kombinációval nem található fiók!",
  "email-not-verified": "A megadott email cím még nincs megerősítve!",
  "session-not-found": "Érvénytelen belépés! Kérlek, jelentkezz be!",
  "access-denied": "Hozzáférés megtagadva!",
  "validation-failed": "A megadott adatok helytelenek!s",
};

export const huLang = new Proxy(strings, handler);
