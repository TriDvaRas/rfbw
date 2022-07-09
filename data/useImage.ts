import useSWR from "swr";
import { Player, Image } from '../database/db';
import { ApiError } from "../types/common-api";
import fetcher from '../util/fetcher';



export default function useImage(imageId: string, preview?: boolean) {
  const { data, mutate, error } = useSWR<Image, ApiError>(`/api/images/${imageId || 'me'}${preview ? '' : '/full'}`, fetcher);

  const loading = !data && !error;
  const loggedOut = error && error.status === 403;

  return {
    loading,
    loggedOut,
    image: data,
    mutate,
    error
  };
}
