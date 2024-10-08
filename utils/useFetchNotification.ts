/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { FetchError } from "ofetch";
import type { AvailableRouterMethod, NitroFetchRequest } from "nitropack";
import type { AsyncData, UseFetchOptions, FetchResult } from "nuxt/app";

type PickFrom<T, K extends Array<string>> =
  T extends Array<any>
    ? T
    : T extends Record<string, any>
      ? keyof T extends K[number]
        ? T
        : K[number] extends never
          ? T
          : Pick<T, K[number]>
      : T;
type KeysOf<T> = Array<
  T extends T ? (keyof T extends string ? keyof T : never) : never
>;

export default function useFetchNotification<
  ResT = void,
  ErrorT = FetchError,
  ReqT extends NitroFetchRequest = NitroFetchRequest,
  Method extends AvailableRouterMethod<ReqT> = ResT extends void
    ? "get" extends AvailableRouterMethod<ReqT>
      ? "get"
      : AvailableRouterMethod<ReqT>
    : AvailableRouterMethod<ReqT>,
  _ResT = ResT extends void ? FetchResult<ReqT, Method> : ResT,
  DataT = _ResT,
  PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
  DefaultT = null,
>(
  request: Ref<ReqT> | ReqT | (() => ReqT),
  opts?: UseFetchOptions<_ResT, DataT, PickKeys, DefaultT, ReqT, Method>,
): AsyncData<PickFrom<DataT, PickKeys> | DefaultT, ErrorT | null> {
  return useFetch(request, {
    ...opts,
    $fetch: $fetchNotification,
  });
}
