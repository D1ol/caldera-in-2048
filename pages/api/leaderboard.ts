import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.REDIS_URL || "",
  token: process.env.REDIS_TOKEN || ""
});

export enum LeaderboardType {
  Win = 'win',
  Score = 'score'
}

interface DbData {
  name: string,
  score: number,
  seconds: number,
  time: string,
  win: false,
  status: string,
  keyHash: string,
}

const leaderboardHandler =  async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { type } = req.query||'score';
    const keys = await redis.keys("game:*");

    if (!keys.length) {
      return res.status(200).json([]);
    }

    const pipeline = redis.pipeline();
    keys.forEach((key) => pipeline.hgetall(key));
    const allData = await pipeline.exec();

    const mappedData = allData
      .map((data, index) => ({ key: keys[index], ...data as DbData }));

    const result = Object.values(type == LeaderboardType.Score ? prepareScoreData(mappedData) : prepareWinData(mappedData));

    if (req.method === "GET") {
      return res.status(200).json(result);
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Fetch error" });
  }
};


function prepareWinData(mappedData: DbData[]) {
  const filteredData = mappedData.filter((game: DbData) => (game.win));

  const bestGames: { [key: string]: DbData } = {};

  for (const game of filteredData) {
    const { name, score, seconds } = game;

    if (!bestGames[name] || seconds < bestGames[name].seconds || (seconds === bestGames[name].seconds && score > bestGames[name].score)) {
      bestGames[name] = game;
    }
  }

  return bestGames;
}

function prepareScoreData(mappedData:DbData[]) {
  const bestScores: { [key: string]: DbData } = {};

  for (const game of mappedData) {
    const { name, score} = game;

    if (!bestScores[name] || score > bestScores[name].score) {
      bestScores[name] = game;
    }
  }

  return bestScores;
}

export default leaderboardHandler;
