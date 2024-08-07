import { getLocale } from "~/assets/lang";
const toast = useToast();

export default $fetch.create({
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
