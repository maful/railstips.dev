import type { UseQueryResult } from "@tanstack/react-query";
import type { Category } from "@prisma/client";
import { CategoriesResponse } from "@/model/category";

interface Props {
  query: UseQueryResult<CategoriesResponse["categories"]>;
  activeId: number;
  onTabChange: (id: Category["id"]) => void;
}

export default function Tabs({ query, activeId, onTabChange }: Props) {
  const stateVariants = {
    active: "text-red-700 bg-red-100 hover:bg-red-100",
    inactive: "text-gray-700 hover:bg-red-50 hover:text-red-700",
  };

  return (
    <ul className="flex items-center gap-2 text-sm font-medium">
      {query.status === "loading" ? (
        <span>Loading categories</span>
      ) : query.status === "error" ? (
        <span>Failed fetching categories</span>
      ) : (
        <>
          {query.data.map((category) => (
            <li key={category.id}>
              <a
                onClick={() => onTabChange(category.id)}
                className={`relative inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 ${
                  stateVariants[
                    activeId === category.id ? "active" : "inactive"
                  ]
                }`}
              >
                {category.name}
              </a>
            </li>
          ))}
        </>
      )}
    </ul>
  );
}
