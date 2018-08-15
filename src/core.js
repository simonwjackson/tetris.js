export const hasCollision = (arena, player) => {
  const m = player.matrix
  const o = player.pos

  return m.some((yVal, yIdx) => (
    yVal.some((xVal, xIdx) => {
      if (m[yIdx][xIdx] !== 0 &&
        (arena[yIdx + o.y] &&
          arena[yIdx + o.y][xIdx + o.x]) !== 0) {
        return true
      } 

      return false
    })
  ))
}