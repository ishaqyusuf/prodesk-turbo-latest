import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsJson,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import { useOnCloseQuery } from "./use-on-close-query";

export function useCustomerOverviewQuery() {
  const onClose = useOnCloseQuery();
  const [params, setParams] = useQueryStates({
    viewCustomer: parseAsBoolean,
    accountNo: parseAsString,
    tab: parseAsStringEnum([
      "general",
      "sales",
      "quotes",
      "transactions",
      "pay-portal",
    ] as const),
    onCloseQuery: parseAsJson(),
    "pay-selections": parseAsArrayOf(parseAsInteger),
  });
  const opened = params.viewCustomer && !!params.accountNo;

  return {
    open(accountNo, onCloseQuery?) {
      setParams({
        accountNo,
        viewCustomer: true,
        tab: "general",
        onCloseQuery: onCloseQuery || undefined,
      });
    },
    ...params,
    params,
    setParams,
    opened,
    close() {
      onClose.handle(params, setParams);
    },
  };
}
