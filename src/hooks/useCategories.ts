import { useQuery } from "@tanstack/react-query";
import type { CategoriesResponse } from "@/model/category";

const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
};

const fetchCategories = async () => {
  const response = await fetch("/api/categories");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const body: CategoriesResponse = await response.json();
  return body.categories;
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: fetchCategories,
  });
}
