import type { Category } from "@prisma/client";

export type CategoriesResponse = {
  categories: Array<Pick<Category, "id" | "name">>;
};
