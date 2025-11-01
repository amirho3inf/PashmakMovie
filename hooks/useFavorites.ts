import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Poster } from "../types";
import * as favoritesService from "../services/favorites";

// Query key for favorites
export const favoritesQueryKey = ["favorites"] as const;

/**
 * Hook to get all favorites
 */
export function useFavorites() {
  return useQuery<Poster[]>({
    queryKey: favoritesQueryKey,
    queryFn: () => favoritesService.getFavorites(),
    staleTime: 0, // Always fetch fresh from localStorage
  });
}

/**
 * Hook to toggle favorite status of an item
 */
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      item,
      isFavorite,
    }: {
      item: Poster;
      isFavorite: boolean;
    }) => {
      if (isFavorite) {
        favoritesService.removeFavorite(item.id);
      } else {
        favoritesService.addFavorite(item);
      }
      return favoritesService.getFavorites();
    },
    onSuccess: (newFavorites) => {
      // Update the favorites cache
      queryClient.setQueryData(favoritesQueryKey, newFavorites);

      // Optionally invalidate other queries that might show favorite status
      // This ensures favorite buttons update across the app
      queryClient.invalidateQueries({ queryKey: ["home"] });
    },
  });
}
