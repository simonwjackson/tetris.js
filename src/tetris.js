/* HOTFIX: Parcel full reload for canvas */
if (module.hot) {
  module.hot.dispose(() => {
    window.location.reload();
    throw 'whatever'
  })
}

import './main.css'
import { createMatrix } from './utils'
import { hasCollision, createPiece } from './core'

const canvas = document.getElementById('tetris')
const context = canvas.getContext('2d')
const arena = createMatrix(12, 20)
// const matrix = [
//   [0, 0, 0],
//   [1, 1, 1],
//   [0, 1, 0]
// ]
const player = {
  pos: {
    x: 5,
    y: 5
  },
  matrix: createPiece('I')
}

let dropCounter = 0
let dropInterval = 1000
let lastDraw = 0

context.scale(20, 20)

const merge = (arena, player) => {
  player.matrix.map((row, y) => {
    row.map((value, x) => {
      if (value !== 0) arena[y + player.pos.y][x + player.pos.x] = value
    })
  })
}

const playerDrop = () => {
  player.pos.y++

  if (hasCollision(arena, player)) {
    player.pos.y--
    merge(arena, player)
    playerReset()
    player.pos.y = 0
  }

  dropCounter = 0
}

const draw = player => {
  context.fillStyle = '#000'
  context.fillRect(0, 0, canvas.width, canvas.height)

  drawMatrix(arena, { x: 0, y: 0 })
  drawMatrix(player.matrix, player.pos)
}

const update = (player, time = 0) => {
  const deltaTimeDraw = time - lastDraw
  lastDraw = time

  dropCounter += deltaTimeDraw
  if (dropCounter > dropInterval) playerDrop()

  draw(player)
  requestAnimationFrame(update.bind(null, player))
}

const drawMatrix = (matrix, offset) => {
  matrix.map((row, y) => {
    row.map((value, x) => {
      if (value !== 0) {
        context.fillStyle = 'hsl(226, 96%, 56%)'
        context.fillRect(x + offset.x, y + offset.y, 1, 1)
      }
    })
  })
}

const move = direction => {
  player.pos.x += direction
  if (hasCollision(arena, player))
    player.pos.x -= direction
}

const rotate = (matrix, direction) => {
  for (let yIdx = 0; yIdx < matrix.length; ++yIdx) {
    for (let xIdx = 0; xIdx < yIdx; ++xIdx) {
      [
        matrix[xIdx][yIdx],
        matrix[yIdx][xIdx]
      ] = [
          matrix[yIdx][xIdx],
          matrix[xIdx][yIdx]
        ]
    }
  }

  if (direction > 0) matrix.map(r => r.reverse())
  else matrix.reverse()
}

const playerRotate = direction => {
  const pos = player.pos.x
  let offset = 1
  rotate(player.matrix, direction)

  while (hasCollision(arena, player)) {
    player.pos.x += offset
    offset = -(offset + (offset > 0 ? 1 : -1))
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -dir)
      player.pos.x = pos
      return
    }
  }
  // const { x: pos } = player.pos
  // let offset = 1
  // rotate(player.matrix, direction) 
  // console.table(hasCollision(arena, matrix))
  // while (hasCollision(arena, matrix)) {
  //   player.pos.x += offset
  //   offset = -(offset + (offset > 0 ? 1 : -1))
  //   if (offset > player.matrix[0].length) {
  //     rotate(player.matrix, -dir)
  //     player.pos.x = pos
  //     return
  //   }
  // }
}

const playerReset = () => {
  const pieces = 'ILJOTSZ'
  player.matrix = createPiece(pieces[pieces.length * Math.random() | 0])
  player.pos.y = 0
  player.pos.x = (arena[0].length / 2 | 0) - 
                 (player.matrix[0].length / 2 | 0)

  // Clear Screen
  if (hasCollision(arena, player)) {
    arena.map(row => row.fill(0))
  }
}

const bindControls = player => {
  document.addEventListener('keydown', ({ key }) => {
    console.log(key)

    switch (key) {
      case "ArrowLeft":
        move(-1)
        break
      case "ArrowRight":
        move(1)
        break
      case "ArrowDown":
        playerDrop()
        break
      case "q":
        playerRotate(1)
        break
      case "w":
        playerRotate(-1)
        break
    }
  })
}

const init = () => {
  bindControls(player)
}

init()
update(player)
