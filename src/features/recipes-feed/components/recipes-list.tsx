"use client";

import React, { Fragment, useEffect } from "react";
import {
  useFilteredRecipes,
  UseFilteredRecipesProps,
} from "../hooks/use-filtered-recipes";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";
import HorizontalCard from "@/components/cards/horizontal-card";

const RecipesList = ({
  categorySlug,
  cuisineSlugs,
  dietsSlugs,
  occassionsSlug,
}: UseFilteredRecipesProps) => {
  const { ref, inView } = useInView({
    threshold: 0.8,
  });
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isLoading } =
    useFilteredRecipes({
      categorySlug,
      cuisineSlugs,
      dietsSlugs,
      occassionsSlug,
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

  return (
    <section className="p-8 rounded-2xl bg-white">
      <header>
        <h1 className="text-3xl font-display">Wyniki</h1>
      </header>
      {isLoading && (
        <div className="p-4 pt-12 flex justify-center">
          <Loader2 className="size-4 animate-spin" />
        </div>
      )}
      <div className="space-y-4 mt-6">
        {data?.pages.map((page, index) => (
          <Fragment key={index}>
            {page.map((item, itemIndex) => (
              <HorizontalCard key={itemIndex} {...item} />
            ))}
          </Fragment>
        ))}
      </div>
      {hasNextPage && (
        <div ref={ref}>
          {isFetchingNextPage && (
            <div className="p-4 pt-12 flex justify-center">
              <Loader2 className="size-4 animate-spin" />
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default RecipesList;
