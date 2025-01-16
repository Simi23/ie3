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
  "user-not-found-try-username":
    "A felhasználó nem található! Nézd meg, hogy helyesen írtad-e be a felhasználónevét!",
  "request-body-invalid": "Érvénytelen művelet!",
  "storing-file-failed": "A fájl tárolása meghiúsult!",
  "media-not-found": "A fájl nem létezik!",
  "email-already-exists": "Ezzel az email címmel már létezik fiók!",
  "username-already-exists": "Ezzel a felhasználónévvel már létezik fiók!",
  "seat-taken": "A kiválasztott ülőhely foglalt!",
  "no-more-pc": "Elfogytak az iskolai számítógépek!",
  "content-not-found": "A tartalom nem található!",
  "competition-not-found": "A verseny nem található!",
  "already-in-competition": "Már részt veszel ezen a versenyen!",
  "competition-joined": "Sikeresen jelentkeztél a versenyre!",
  "competition-team-created": "Csapat létrehozása sikeres!",
  "competition-leave-unsuccessful":
    "A verseny elhagyása során hiba lépett fel.",
  "team-not-found": "A csapat nem található!",
  "team-not-member": "Nem vagy a csapatban!",
  "team-not-leader": "Nem te vagy a csapatvezető!",
  "team-join-failed": "Csatlakozás a csapathoz sikertelen!",
  "team-full": "A csapat már tele van!",
  "modification-failed": "Adatmódosítás sikertelen!",
  "invite-not-found": "A meghívó nem található!",
};

export const huLang = new Proxy(strings, handler);
