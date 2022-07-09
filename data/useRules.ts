import useSWR from "swr";
import { Rules } from "../database/db";
import { ApiError } from "../types/common-api";
import fetcher from '../util/fetcher';



export default function useRules() {
  const { data, mutate, error } = useSWR<Rules, ApiError>("/api/rules/latest", fetcher);

  const loading = !data && !error;
  const loggedOut = error && error.status === 403;

  return {
    loading,
    loggedOut,
    rules: data,
    mutate,
    error
  };
}
