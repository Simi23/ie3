import { getLocale } from "~/assets/lang";

const defaults = {
  title: {
    SUCCESS: getLocale("success"),
    WARN: getLocale("warning"),
    INFO: getLocale("information"),
    ERROR: getLocale("error"),
  },
  color: {
    SUCCESS: "emerald",
    WARN: "yellow",
    INFO: "blue",
    ERROR: "red",
  },
  icon: {
    SUCCESS: "i-heroicons-check-circle-20-solid",
    WARN: "i-heroicons-exclamation-circle-20-solid",
    INFO: "i-heroicons-information-circle-20-solid",
    ERROR: "i-heroicons-x-mark-20-solid",
  },
};

interface NotificationInput {
  title: string;
  message: string;
  icon: string;
}

export interface Notification {
  showNotification: boolean;
  title: string;
  message?: string;
  icon: string;
  color: string;
}

export default function createNotification(
  type: "SUCCESS" | "WARN" | "INFO" | "ERROR",
  params: Partial<NotificationInput>,
): Notification {
  const title = params.title ?? defaults.title[type];
  const message = params.message;
  const icon = params.icon ?? defaults.icon[type];
  const color = defaults.color[type];

  return {
    showNotification: true,
    title,
    message,
    icon,
    color,
  };
}
