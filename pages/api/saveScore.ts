import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from "@upstash/redis";
import {formatTime} from "@/components/timer"
import bcrypt from "bcryptjs";

const redis = new Redis({
  url: process.env.REDIS_URL || "",
  token: process.env.REDIS_TOKEN || "",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { name, score, status, time, generatedSalt } = req.body;

      const keyHash = `game:${Date.now()}`;

      const apiSalt = Number(process.env.NEXT_PUBLIC_API_SALT);

      const jsonString = JSON.stringify({name,score, status, time, apiSalt});
      const compared = bcrypt.compareSync(jsonString, generatedSalt);

      await redis.hset(keyHash, {
        "keyHash": keyHash,
        "name": name,
        "score": score,
        "status": status,
        "time": formatTime(time),
        "win": status == "won",
        "seconds": time,
        "dateOfCreation":new Date().toLocaleString("en-US"),
        "cheater": !compared
      });

      return res.status(200).json({ message: "Score saved successfully!" });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
