import { useInfiniteQuery } from "@tanstack/react-query";
import { useRecipesFilters } from "./use-recipes-filters";
import { honoClient } from "@/lib/hono-client";

export interface UseFilteredRecipesProps {
  categorySlug?: string;
  cuisineSlugs?: string[];
  dietsSlugs?: string[];
  occassionsSlug?: string[];
  username?: string;
  query?: string;
}

export const useFilteredRecipes = ({
  categorySlug,
  cuisineSlugs,
  dietsSlugs,
  occassionsSlug,
  username,
  query,
}: UseFilteredRecipesProps) => {
  const {
    categorySlug: categorySlugParam,
    cuisineSlugs: cuisineSlugsParam,
    dietSlugs: dietsSlugsParam,
    occassionSlugs: occassionSlugParam,
    query: queryParam,
  } = useRecipesFilters();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [
        "recipes",
        {
          categorySlug: categorySlug || categorySlugParam,
          cuisineSlugs: cuisineSlugs || cuisineSlugsParam,
          dietSlugs: dietsSlugs || dietsSlugsParam,
          occassionSlugs: occassionsSlug || occassionSlugParam,
          query: query || queryParam,
          username,
        },
      ],
      queryFn: async ({ pageParam }) => {
        const res = await honoClient.api.recipes.$post({
          json: {
            categorySlug: categorySlug || categorySlugParam,
            cuisineSlugs: cuisineSlugs || cuisineSlugsParam,
            dietSlugs: dietsSlugs || dietsSlugsParam,
            occassionSlugs: occassionsSlug || occassionSlugParam,
            searchQuery: query || queryParam || "",
            username,
            page: pageParam,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch recipes");
        }

        const data = await res.json();

        return data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages, lastPageParam) => {
        if (lastPage.length === 0) {
          return undefined;
        }
        return lastPageParam + 1;
      },
    });

  return { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage };
};
