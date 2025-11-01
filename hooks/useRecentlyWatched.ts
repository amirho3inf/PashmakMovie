import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Poster } from "../types";
import * as recentlyWatchedService from "../services/recentlyWatched";

// Query key for recently watched
export const recentlyWatchedQueryKey = ["recentlyWatched"] as const;

/**
 * Hook to get all recently watched items
 */
export function useRecentlyWatched() {
  return useQuery<Poster[]>({
    queryKey: recentlyWatchedQueryKey,
    queryFn: () => recentlyWatchedService.getRecentlyWatched(),
    staleTime: 0, // Always fetch fresh from localStorage
  });
}

/**
 * Hook to add an item to recently watched
 */
export function useAddRecentlyWatched() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: Poster) => {
      recentlyWatchedService.addRecentlyWatched(item);
      return recentlyWatchedService.getRecentlyWatched();
    },
    onSuccess: (newRecentlyWatched) => {
      // Update the recently watched cache
      queryClient.setQueryData(recentlyWatchedQueryKey, newRecentlyWatched);

      // Invalidate home query to update recently watched section
      queryClient.invalidateQueries({ queryKey: ["home"] });
    },
  });
}
