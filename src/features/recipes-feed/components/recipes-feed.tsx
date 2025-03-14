import React from "react";
import FacatedSearch from "./facated-search";
import RecipesList from "./recipes-list";
import { UseFilteredRecipesProps } from "../hooks/use-filtered-recipes";

const RecipesFeed = ({
  categorySlug,
  cuisineSlugs,
  dietsSlugs,
  occassionsSlug,
  username,
}: UseFilteredRecipesProps) => {
  return (
    <div className="flex gap-8">
      <div className="w-2xs">
        <div className="sticky top-20">
          <FacatedSearch
            showCategories={!categorySlug}
            showCuisines={!cuisineSlugs}
            showDiets={!dietsSlugs}
            showOccasions={!occassionsSlug}
          />
        </div>
      </div>
      <div className="flex-1">
        <RecipesList
          categorySlug={categorySlug}
          cuisineSlugs={cuisineSlugs}
          dietsSlugs={dietsSlugs}
          occassionsSlug={occassionsSlug}
          username={username}
        />
      </div>
    </div>
  );
};

export default RecipesFeed;
