import { AxiosError } from "axios";
import useSWR from "swr";
import { Wheel } from '../database/db';
import { ApiError } from "../types/common-api";
import fetcher from '../util/fetcher';



export default function useWheel(wheelId: string) {
  const { data, mutate, error: _error } = useSWR<Wheel, AxiosError<ApiError>>(wheelId ? `/api/wheels/${wheelId}` : null, fetcher);
  const error = _error && (typeof _error.response?.data == 'object' ? _error.response.data : { error: _error.message || 'Unknown Error', status: +(_error.status || 500) })

  const loading = !data && !error;
  const loggedOut = error && error.status === 403;

  return {
    loading,
    loggedOut,
    wheel: data,
    mutate,
    error
  };
}
