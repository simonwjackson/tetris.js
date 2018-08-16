export const createPiece = type => {
  switch (type) {
    case "O":
      return [
        [1, 1],
        [1, 1],
      ]
      break

    case "Z":
      return [
        [2, 2, 0],
        [0, 2, 2],
        [0, 0, 0]
      ]
      break

    case "S":
      return [
        [0, 3, 3],
        [3, 3, 0],
        [0, 0, 0]
      ]
      break

    case "J":
      return [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
      ]
      break 

    case "L":
      return [
        [0, 2, 0],
        [0, 2, 0],
        [0, 2, 2]
      ]
      break

    case "I":
      return [
        [0, 2, 0, 0],
        [0, 2, 0, 0],
        [0, 2, 0, 0],
        [0, 2, 0, 0]
      ]
      break

    case "T": 
      return [
        [0, 0, 0],
        [3, 3, 3],
        [0, 3, 0]
      ]
      break
  }
}

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