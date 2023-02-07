import { prisma } from "@/db";
import { TweetsResponse } from "@/model/tweet";
import type { NextApiRequest, NextApiResponse } from "next";

// const PER_PAGE = 6;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TweetsResponse>
) {
  const query: { page?: string; cursorId?: string } = req.query;
  console.log(query);
  // const page = parseInt(query.page as string) || 1;
  // const skip = (page - 1) * PER_PAGE;
  // console.log("page", skip);
  let skip = undefined;
  let cursor = undefined;
  if (query.cursorId !== undefined && query.cursorId !== "0") {
    skip = 1;
    cursor = { id: parseInt(query.cursorId) };
  }

  const tweets = await prisma.tweet.findMany({
    select: { id: true, tweetId: true },
    where: { active: true },
    orderBy: { id: "desc" },
    skip,
    take: 6,
    cursor,
  });
  const nextCursor = tweets.length == 6 ? tweets[5].id : null;

  res.status(200).json({
    data: tweets,
    nextCursor,
  });
}
