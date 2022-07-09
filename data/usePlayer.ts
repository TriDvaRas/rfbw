import useSWR from "swr";
import { Player } from "../database/db";
import { ApiError } from "../types/common-api";
import fetcher from '../util/fetcher';



export default function usePlayer(playerId?: string) {
  const { data, mutate, error } = useSWR<Player, ApiError>(`/api/players/${playerId || 'me'}`, fetcher);
  
  const loading = !data && !error;
  const loggedOut = error && error.status === 403;

  return {
    loading,
    loggedOut,
    player: data,
    mutate,
    error
  };
}
