import { prisma } from "@/db";
import type { NextApiRequest, NextApiResponse } from "next";
import type { CategoriesResponse } from "@/model/category";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<CategoriesResponse>
) {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    where: { active: true },
    orderBy: { rank: "asc" },
  });

  res.status(200).json({ categories });
}
