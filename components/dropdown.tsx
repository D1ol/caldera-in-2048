import React, { useState } from "react";
import styles from "@/styles/dropdown.module.css";
import { gameTileImages } from "@/constants";
import Image from "next/image";

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.dropdown}>
      <button onClick={toggleMenu} className={styles.dropdownToggle}>
        How to Play
      </button>
      {isOpen && (
        <div className={styles.dropdownMenu}>
          <button className={styles.closeButton} onClick={toggleMenu}>✖</button>
          <h2 className={styles.heading}>How to Play</h2>
          <p>Use arrow keys or swipe to move tiles.</p>
          <p>When two tiles with the same number touch, they merge!</p>
          <p>Goal: Reach the final 2048 tile to WIN!</p>
          <p>Don't forget: Save your result!</p>

          <h3 className={styles.heading}>Tile Values:</h3>
          <div className={styles.tileGrid}>
            {Object.entries(gameTileImages).map(([value, src]) => (
              <div key={value} className={styles.tile}>
                <div className={styles.tileImage}>
                  <Image src={src} alt={`Tile ${value}`} width={50} height={50} />
                </div>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
