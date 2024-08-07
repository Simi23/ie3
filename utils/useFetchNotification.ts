import type { UseFetchOptions } from "nuxt/app";
import { getLocale } from "~/assets/lang";

export default function useFetchNotification<T>(
  url: string | (() => string),
  options?: Partial<
    Omit<UseFetchOptions<T>, "default"> & {
      default: () => T | Ref<T>;
    }
  >,
) {
  const toast = useToast();

  return useFetch(url, {
    ...options,
    onResponseError({ response }) {
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
}
