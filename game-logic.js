export function classifyLane(row) {
  const phase = row % 12;
  return {
    road: row > 2 && [3, 4, 5, 10].includes(phase),
    river: row > 2 && (phase === 6 || phase === 8),
  };
}

export function findSupportingLog(playerX, logs) {
  return logs.find(log => playerX > log.x + .12 && playerX < log.x + log.width - .12);
}

export function isTrafficCollision(player, lanes) {
  // Check the interpolated footprint, including during hops.
  const front = player.y + .2;
  const back = player.y - .2;
  for (let row = Math.floor(back); row <= Math.floor(front); row++) {
    const lane = lanes.get(row);
    if (
      lane?.road &&
      front > row + .16 &&
      back < row + .84 &&
      lane.cars.some(car => player.x + .22 > car.x + .06 &&
        player.x - .22 < car.x + car.width - .06)
    ) {
      return true;
    }
  }
  return false;
}
