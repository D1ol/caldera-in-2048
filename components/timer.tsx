import { useContext, useEffect } from "react";
import { GameContext } from "@/context/game-context";

function Timer() {
  const { time } = useContext(GameContext);

  return (
    <div style={{ fontSize: "20px", fontWeight: "bold", margin: "10px" }}>
      🚀 Played time: {formatTime(time)}
    </div>
  );
}

export function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}


export default Timer;
