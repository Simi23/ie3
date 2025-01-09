import { getLocale } from "~/assets/lang";

const toast = useToast();
const { csrf } = useCsrf();

export default $fetch.create({
  onRequest: ({ options }) => {
    options.headers = new Headers(options.headers);
    options.headers.set("csrf-token", csrf);
  },
  onResponse: ({ response }) => {
    if (
      response?._data?.notification !== undefined &&
      response._data.notification.showNotification
    ) {
      const nd = response._data.notification;

      if (nd.message === undefined) {
        toast.add({
          title: nd.title,
          icon: nd.icon,
          color: nd.color,
        });
        return;
      }

      toast.add({
        title: nd.title,
        description: nd.message,
        icon: nd.icon,
        color: nd.color,
      });
    }
  },
  onResponseError: ({ response }) => {
    toast.add({
      title: getLocale("error"),
      description: response?._data?.message
        ? getLocale(response?._data?.message)
        : getLocale("unknown-error"),
      icon: "i-heroicons-x-mark-20-solid",
      color: "red",
    });
  },
});
