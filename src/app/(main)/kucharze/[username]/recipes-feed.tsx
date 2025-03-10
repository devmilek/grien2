"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import React, { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { getInfiniteScrollRecipes } from "./actions";
import SmallRecipeCard from "@/components/cards/small-recipe-card";
import { FileQuestion, Loader2Icon } from "lucide-react";

const RecipesFeed = ({ userId }: { userId: string }) => {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["user-recipes", userId],
      queryFn: async ({ pageParam }) =>
        await getInfiniteScrollRecipes(pageParam, userId),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages, lastPageParam) => {
        if (lastPage.length === 0) {
          return undefined;
        }
        return lastPageParam + 1;
      },
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage]);
  return (
    <div className="p-6 rounded-xl bg-white">
      <h2 className="text-3xl font-display mb-6">
        {data?.pages[0].length !== 0 && "Przepisy"}
      </h2>
      {data?.pages[0].length === 0 && (
        <div className="text-center pb-6">
          <FileQuestion className="text-muted-foreground mx-auto mb-4" />
          <p className="font-semibold">Brak przepisów</p>
          <p className="text-sm text-muted-foreground">
            Ten użytkownik nie dodał jeszcze żadnych przepisów.
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-6">
        {data?.pages.map((page, index) => (
          <Fragment key={index}>
            {page.map((recipe) => (
              <SmallRecipeCard
                key={recipe.id}
                author={recipe.user}
                category={recipe.category}
                id={recipe.id}
                name={recipe.name}
                slug={recipe.slug}
                src={recipe.image}
                categorySlug={recipe.categorySlug}
                licence={recipe.licence}
              />
            ))}
          </Fragment>
        ))}
      </div>
      {hasNextPage && (
        <div className="p-6 text-center flex justify-center pt-10" ref={ref}>
          <Loader2Icon className="size-4 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default RecipesFeed;
