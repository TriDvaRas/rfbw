import { AxiosError } from "axios";
import useSWR from "swr";
import { Game, Wheel } from '../database/db';
import { ApiError } from "../types/common-api";
import fetcher from '../util/fetcher';
import { GameStats } from '../types/stats';



export default function useGameStats(gameId: string) {
  const { data, mutate, error: _error } = useSWR<GameStats, AxiosError<ApiError>>(`/api/games/${gameId}/stats`, fetcher);
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
