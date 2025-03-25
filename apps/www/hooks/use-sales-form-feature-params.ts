"use client";

import { parseAsBoolean, useQueryStates } from "nuqs";

export function useSalesFormFeatureParams() {
  const [params, setParams] = useQueryStates({
    newInterface: parseAsBoolean,
  });
  return {
    params,
    setParams,
  };
}
