import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/db";
import { authOptions } from "../auth/[...nextauth]";
import type { SingleTweet } from "@/model/tweet";

type ResponseData =
  | SingleTweet
  | {
      error?: string;
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "401 Unauthorized" });
  }

  if (req.method === "POST") {
    const body = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { email: session.user?.email ?? undefined },
      });

      const tweet = await prisma.tweet.create({
        select: { id: true, tweetId: true, categoryId: true },
        data: {
          tweetId: body.tweetId,
          categoryId: parseInt(body.categoryId),
          submitterId: user?.id,
        },
      });

      res.status(200).json(tweet);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          res.status(422).json({
            error: "Tweet ID already in use, please submit a different one.",
          });
        } else {
          res
            .status(422)
            .json({ error: "Something went wrong. Try again later." });
        }
      } else {
        res.status(500).json({ error: "failed to create tweet" });
      }
    }
  } else {
    res.status(500).json({ error: "failed to load data" });
  }
}
