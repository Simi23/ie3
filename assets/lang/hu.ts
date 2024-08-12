let handler = {
  get: function (target: any, name: string): string {
    return target.hasOwnProperty(name) ? target[name] : "Ismeretlen szöveg";
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
};

export const huLang = new Proxy(strings, handler);
