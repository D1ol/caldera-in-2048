/**
 * Game Layout
 */
export const containerWidthMobile = 288; // px

export const containerWidthDesktop = 464; // px

export const tileCountPerDimension = 4;

/**
 * Animations
 */
export const mergeAnimationDuration = 100; // ms

export const moveAnimationDuration = 150; // ms

/**
 * Game setup
 */
export const gameWinTileValue = Number(process.env.NEXT_PUBLIC_WIN_TILE_VALUE)||2048;

export const gameTileImages: { [key: number]: string } = {
  2: "/tiles/2.jpg",
  4: "/tiles/4.jpg",
  8: "/tiles/8.jpg",
  16: "/tiles/16.jpg",
  32: "/tiles/32.jpg",
  64: "/tiles/64.jpg",
  128: "/tiles/128.jpg",
  256: "/tiles/256.jpg",
  512: "/tiles/512.jpg",
  1024: "/tiles/1024.jpg",
  2048: "/tiles/2048.jpg",
};
