import { AxiosError } from "axios";
import useSWR from "swr";
import { ApiError } from "../types/common-api";
import { WheelStats } from '../types/stats';
import fetcher from '../util/fetcher';



export default function useWheelStats(wheelId: string, gameId?: string) {
  const { data, mutate, error: _error } = useSWR<WheelStats, AxiosError<ApiError>>(`/api/wheels/${wheelId}/stats${gameId ? `?gameId=${gameId}` : ''}`, fetcher);
  const error = _error && (typeof _error.response?.data == 'object' ? _error.response.data : { error: _error.message || 'Unknown Error', status: +(_error.status || 500) })
  const loading = !data && !error;
  const loggedOut = error && error.status === 403;

  return {
    loading,
    loggedOut,
    stats: data,
    mutate,
    error
  };
}
