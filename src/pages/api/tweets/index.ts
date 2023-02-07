import { prisma } from "@/db";
import type { NextApiRequest, NextApiResponse } from "next";
import type { TweetsResponse } from "@/model/tweet";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TweetsResponse>
) {
  const query: { nextId?: string } = req.query;
  let skip = undefined;
  let cursor = undefined;
  if (query.nextId !== undefined && query.nextId !== "0") {
    skip = 1;
    cursor = { id: parseInt(query.nextId) };
  }

  const tweets = await prisma.tweet.findMany({
    select: { id: true, tweetId: true },
    where: { active: true },
    orderBy: { id: "desc" },
    skip,
    take: 6,
    cursor,
  });
  const nextId = tweets.length == 6 ? tweets[5].id : null;

  res.status(200).json({
    data: tweets,
    nextId,
  });
}
