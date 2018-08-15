// Refactor as reducer
export const createMatrix = (w, h) => { 
  const matrix = []
  while (h--) {
    matrix.push(new Array(w).fill(0))
  }
  return matrix 
}