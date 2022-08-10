import { AxiosError } from "axios";
import { useMemo, useRef } from "react";
import useSWRInfinite from 'swr/infinite';
import { GameEvent } from '../database/db';
import { ApiError } from "../types/common-api";
import fetcher from '../util/fetcher';


export default function useGameEvents(gameId?: string, options?: {
  date?: string,
  playerId?: string,
}) {
  const isFetching = useRef(false);
  // const maxPages = useRef(1);
  const { data, mutate, size, error: _error, setSize, isValidating } = useSWRInfinite<GameEvent[], AxiosError<ApiError>>((page, previousPageData) => {
    // if (maxPages.current < page + 1) return null;
    if (previousPageData?.length === 0) return null;
    if (isFetching.current && page) return null
    if (!gameId) return null;
    let _options: string[] = [`page=${page + 1}`]
    if (options?.date)
      _options.push(`date=${options.date}`)
    if (options?.playerId)
      _options.push(`playerId=${options.playerId}`)

    return `/api/games/${gameId}/events?${_options.join('&')}`
  }, fetcher, { revalidateAll: false });
  // const { data, mutate, error: _error } = useSWR<GameEvent[], AxiosError<ApiError>>(gameId ? `/api/games/${gameId}/wheels` : null, fetcher);
  const error = _error && (typeof _error.response?.data == 'object' ? _error.response.data : { error: _error.message || 'Unknown Error', status: +(_error.status || 500) })
  const isLoading = !data && !error;
  const isLoadingMore = isLoading ||
    (isValidating && size > 1 && data && typeof data[size - 1] === 'undefined');
  const loggedOut = error && error.status === 403;
  const canLoadMore = !isLoading && !isLoadingMore && data && data[data.length - 1].length !== 0
  const flat = useMemo(() => {
    if (!isNaN(data as any))
      return [];
    return data?.flat(1)
  }, [data])

  return {
    isLoading,
    isLoadingMore,
    loggedOut,
    events: flat,
    mutate,
    error,
    canLoadMore,
    loadMore: () => setSize(size + 1)
  };
}
