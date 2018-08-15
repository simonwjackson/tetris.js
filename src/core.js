// Refactor: should return true ASAP
export const hasCollision = (arena, player) => {
  const m = player.matrix
  const o = player.pos
  let found = false

  m.map((yVal, yIdx) => {
    yVal.map((xVal, xIdx) => {
      if (m[yIdx][xIdx] !== 0 &&
        (arena[yIdx + o.y] &&
          arena[yIdx + o.y][xIdx + o.x]) !== 0) {
        found = true;
      }
    })
  })

  return found;
}