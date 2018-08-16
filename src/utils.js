// Refactor as reducer
export const createMatrix = (w, h) => { 
  const matrix = []
  while (h--) {
    matrix.push(new Array(w).fill(0))
  }
  return matrix 
}

export const rand = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)

  return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive
}
