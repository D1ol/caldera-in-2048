import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from "@upstash/redis";
import {formatTime} from "@/components/timer"

const redis = new Redis({
  url: process.env.REDIS_URL || "",
  token: process.env.REDIS_TOKEN || "",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { name, score, status, time } = req.body;

      const keyHash = `game:${Date.now()}`;

      await redis.hset(keyHash, {
        "keyHash": keyHash,
        "name": name,
        "score": score,
        "status": status,
        "time": formatTime(time),
        "win": status == "won",
        "seconds": time
      });

      return res.status(200).json({ message: "Score saved successfully!" });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
