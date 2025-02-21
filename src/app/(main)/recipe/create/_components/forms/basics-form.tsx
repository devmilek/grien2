"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { RecipeBasicsSchema, recipeBasicsSchema } from "./schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CategoryCombobox } from "../comboboxes/category-combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimeCombobox } from "../comboboxes/time-combobox";
import { Button } from "@/components/ui/button";
import { useRecipeStore } from "../use-recipe-store";

const BasicsForm = () => {
  const { basics, setBasics, setCurrentStep } = useRecipeStore();
  const form = useForm<RecipeBasicsSchema>({
    resolver: zodResolver(recipeBasicsSchema),
    defaultValues: {
      description: basics.description,
      difficulty: basics.difficulty,
      preparationTime: basics.preparationTime,
      portions: basics.portions,
      categoryId: basics.categoryId,
      name: basics.name,
    },
  });

  const onSubmit = (data: RecipeBasicsSchema) => {
    setBasics(data);
    setCurrentStep("ingredients");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="font-display text-3xl">Podstawy</h2>
      <div className="bg-white rounded-xl p-12 mt-6">
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="np. Gyros w picie" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Opis</FormLabel>
                    <p className="text-sm text-gray-500">
                      {field.value.length}/500 znaków
                    </p>
                  </div>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Opisz swój przepis..."
                      className="h-32"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-4 gap-8">
              <FormField
                name="categoryId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Kategoria</FormLabel>
                    </div>
                    <FormControl>
                      <CategoryCombobox {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="portions"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ilość porcji</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Podaj liczbe porcji..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="difficulty"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poziom trudności</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz poziom..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="easy">Łatwy</SelectItem>
                        <SelectItem value="medium">Średni</SelectItem>
                        <SelectItem value="hard">Trudny</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="preparationTime"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Czas przygotowania</FormLabel>
                    <FormControl>
                      <TimeCombobox {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <div className="justify-end w-full mt-10 flex">
          <Button onClick={form.handleSubmit(onSubmit)}>Dalej</Button>
        </div>
      </div>
    </div>
  );
};

export default BasicsForm;
