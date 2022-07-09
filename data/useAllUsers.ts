import useSWR from "swr";
import { Player, User } from '../database/db';
import { ApiError } from "../types/common-api";
import fetcher from '../util/fetcher';



export default function useAllUsers(playerId?: string) {
  const { data, mutate, error } = useSWR<User[], ApiError>(`/api/admin/users`, fetcher);

  const loading = !data && !error;
  const loggedOut = error && error.status === 403;

  return {
    loading,
    loggedOut,
    users: data,
    mutate,
    error
  };
}
