import type { UseQueryResult } from "@tanstack/react-query";
import type { Category } from "@prisma/client";
import type { CategoriesResponse } from "@/model/category";

type Categories = CategoriesResponse["categories"];

interface Props {
  query: UseQueryResult<Categories>;
  activeId: number;
  onTabChange: (id: Category["id"]) => void;
}

export default function Tabs({ query, activeId, onTabChange }: Props) {
  const stateVariants = {
    active: "text-red-700 bg-red-100 hover:bg-red-100",
    inactive: "text-gray-700 hover:bg-red-50 hover:text-red-700",
  };

  const categories: Categories = [
    { id: 0, name: "All" },
    ...(query.data ?? []),
  ];

  return (
    <>
      {query.status === "loading" ? (
        <div className="flex gap-2 animate-pulse">
          {[...Array(5)].map((_el, i) => (
            <div key={i} className="h-9 w-28 bg-slate-200 rounded"></div>
          ))}
        </div>
      ) : query.status === "error" ? (
        <span>Failed fetching categories</span>
      ) : (
        <>
          <ul className="flex items-center gap-2 text-sm font-medium">
            {categories.map((category) => (
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
          </ul>
        </>
      )}
    </>
  );
}
