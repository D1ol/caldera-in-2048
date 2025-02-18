import React, { useEffect, useState } from "react";
import LeaderboardTable from "@/components/leaderboard";
import styles from "@/styles/index.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

const Leaderboard = () => {
  const [data, setData] = useState([]);
  const router = useRouter();

  const { type } = router.query;
  const leaderboardType = type || "win";

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const response = await fetch("/api/leaderboard?type=" + leaderboardType);
      const leaderboardData = await response.json();
      setData(leaderboardData);
    };

    fetchLeaderboard();
  }, [leaderboardType]);

  return (
    <div className={styles.leaderboard}>
      <header>
        <h1>Leaderboard</h1>
        <Link href="/">
          <button className={styles.backButton}>Back</button>
        </Link>
      </header>
      <main>
        <LeaderboardTable data={data} />
      </main>
    </div>
  );
};

export default Leaderboard;
