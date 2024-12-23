import { UAParser } from "ua-parser-js";

import Color from "#ui-colors";

type Icon = {
  icon: string;
  name: string;
  color: (typeof Color)[number];
};

type IconCollection = Record<string, Icon>;

const browserIcons: IconCollection = {
  brave: { icon: "fa6-brands:brave", name: "Brave", color: "orange" },
  chrome: { icon: "fa6-brands:chrome", name: "Chrome", color: "emerald" },
  chrome_mobile: {
    icon: "fa6-brands:chrome",
    name: "Chrome",
    color: "emerald",
  },
  edge: { icon: "fa6-brands:edge", name: "Edge", color: "blue" },
  firefox: {
    icon: "fa6-brands:firefox-browser",
    name: "Firefox",
    color: "orange",
  },
  firefox_mobile: {
    icon: "fa6-brands:firefox-browser",
    name: "Firefox",
    color: "orange",
  },
  mozilla: {
    icon: "fa6-brands:firefox-browser",
    name: "Firefox",
    color: "orange",
  },
  opera: { icon: "fa6-brands:opera", name: "Opera", color: "red" },
  safari: { icon: "fa6-brands:safari", name: "Safari", color: "sky" },
  safari_mobile: { icon: "fa6-brands:safari", name: "Safari", color: "sky" },
};

const osIcons: IconCollection = {
  android: { icon: "fa6-brands:android", name: "Android", color: "emerald" },
  android_x86: {
    icon: "fa6-brands:android",
    name: "Android",
    color: "emerald",
  },
  debian: { icon: "fa6-brands:debian", name: "Debian", color: "red" },
  ios: { icon: "fa6-brands:apple", name: "iOS", color: "teal" },
  linux: { icon: "fa6-brands:linux", name: "Linux", color: "amber" },
  macos: { icon: "fa6-brands:apple", name: "macOS", color: "teal" },
  windows: { icon: "fa6-brands:windows", name: "Windows", color: "blue" },
};

type UserAgentInfo = {
  icons: Icon[];
  text: string;
};

export default function (input: string): UserAgentInfo {
  const UA = UAParser(input);

  const output: UserAgentInfo = {
    icons: [],
    text: input,
  };

  const osName: string = UA.os.name?.toLowerCase() ?? "";
  const browserName: string = UA.browser.name?.toLowerCase() ?? "";

  const osKnown = Object.prototype.hasOwnProperty.call(osIcons, osName);
  const browserKnown = Object.prototype.hasOwnProperty.call(
    browserIcons,
    browserName,
  );

  if (osKnown) {
    output.icons.push(osIcons[osName]);
  } else {
    output.icons.push({
      icon: "heroicons:question-mark-circle",
      name: "Rendszer",
      color: "red",
    });
  }

  if (browserKnown) {
    output.icons.push(browserIcons[browserName]);
  } else {
    output.icons.push({
      icon: "heroicons:question-mark-circle",
      name: "Böngésző",
      color: "red",
    });
  }

  return output;
}
