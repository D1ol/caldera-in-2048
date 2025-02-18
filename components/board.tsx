import React from "react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Tile as TileModel } from "@/models/tile";
import styles from "@/styles/board.module.css";
import Tile from "./tile";
import { GameContext } from "@/context/game-context";
import MobileSwiper, { SwipeInput } from "./mobile-swiper";
import Splash from "./splash";
import { moveAnimationDuration } from "@/constants";

export default function Board() {
  const { getTiles, moveTiles, startGame, status } = useContext(GameContext);
  const initialized = useRef(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleKeyDown = useCallback(
    async (e: KeyboardEvent) => {
      if (document.activeElement instanceof HTMLInputElement) {
        return;
      }

      if (isAnimating) return;

      setIsAnimating(true);

      if (animationTimeout.current) {
        clearTimeout(animationTimeout.current);
      }

      e.preventDefault();

      try {
        if (status == "ongoing") {
          switch (e.code) {
            case "ArrowUp":
              await moveTiles("move_up");
              break;
            case "ArrowDown":
              await moveTiles("move_down");
              break;
            case "ArrowLeft":
              await moveTiles("move_left");
              break;
            case "ArrowRight":
              await moveTiles("move_right");
              break;
          }
        }
      } finally {
        animationTimeout.current = setTimeout(() => {
          setIsAnimating(false);
        }, moveAnimationDuration);
      }
    },
    [isAnimating, moveTiles, status]
  );

  const handleSwipe = useCallback(
    ({ deltaX, deltaY }: SwipeInput) => {
      if (isAnimating) return;

      setIsAnimating(true);

      if (animationTimeout.current) {
        clearTimeout(animationTimeout.current);
      }

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          moveTiles("move_right");
        } else {
          moveTiles("move_left");
        }
      } else {
        if (deltaY > 0) {
          moveTiles("move_down");
        } else {
          moveTiles("move_up");
        }
      }

      animationTimeout.current = setTimeout(() => {
        setIsAnimating(false);
      }, moveAnimationDuration);
    },
    [isAnimating, moveTiles]
  );

  const renderGrid = () => {
    const cells: React.JSX.Element[] = [];
    const totalCellsCount = 16;

    for (let index = 0; index < totalCellsCount; index += 1) {
      cells.push(<div className={styles.cell} key={index} />);
    }

    return cells;
  };

  const renderTiles = () => {
    return getTiles().map((tile: TileModel) => (
      <Tile key={`${tile.id}`} {...tile} />
    ));
  };

  useEffect(() => {
    if (initialized.current === false) {
      startGame();
      initialized.current = true;
    }
  }, [startGame]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <MobileSwiper onSwipe={handleSwipe}>
      <div className={styles.board}>
        {status === "won" && <Splash heading="You won!" type="won" />}
        {status === "lost" && <Splash heading="You lost!" />}
        <div className={styles.tiles}>{renderTiles()}</div>
        <div className={styles.grid}>{renderGrid()}</div>
      </div>
    </MobileSwiper>
  );
}
