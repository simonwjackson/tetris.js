/* HOTFIX: Parcel full reload for canvas */
if (module.hot) {
  module.hot.dispose(() => {
    window.location.reload();
    throw 'whatever'
  })
}

import './main.css'
import { createMatrix, rand } from './utils'
import { hasCollision, createPiece } from './core'

const scale = 20
const border = scale * .1 
const canvas = document.getElementById('tetris')
const context = canvas.getContext('2d')
const arena = createMatrix(10, 20)
const player = {
  pos: {
    x: 0,
    y: 0
  },
  matrix: null,
  score: 0
}

const themes = Object.seal({
  ocean: [
    null,
    'hsl(0, 0%, 99%)',
    'hsl(203, 100%, 67%)',
    'hsl(226, 96%, 56%)',
  ],
  grass: [
    null,
    'hsl(0, 0%, 99%)',
    'hsl(81, 100%, 41%)',
    'hsl(102, 100%, 33%)', 
  ],
  love: [
    null,
    'hsl(0, 0%, 99%)',
    'hsl(295, 94%, 73%)',
    'hsl(301, 100%, 42%)', 
  ], 
  xp: [
    null,
    'hsl(0, 0%, 99%)',
    'hsl(106, 66%, 58%)',
    'hsl(225, 97%, 57%)', 
  ], 
  berlin: [
    null,
    'hsl(0, 0%, 99%)',
    'hsl(135, 91%, 71%)',
    'hsl(336, 100%, 44%)', 
  ], 
  diablo: [
    null,
    'hsl(0, 0%, 99%)',
    'hsl(0, 0%, 50%)',
    'hsl(13, 100%, 47%)', 
  ], 
  diablo: [
    null,
    'hsl(0, 0%, 99%)',
    'hsl(349, 100%, 32%)',
    'hsl(252, 100%, 64%)', 
  ], 
  usa: [
    null,
    'hsl(0, 0%, 99%)',
    'hsl(13, 100%, 47%)',
    'hsl(225, 97%, 57%)', 
  ], 
  crush: [
    null,
    'hsl(0, 0%, 99%)',
    'hsl(33, 93%, 60%)',
    'hsl(13, 100%, 47%)', 
  ], 
})

let colors = themes['love'] 
let dropCounter = 0
let dropInterval = 1000
let lastDraw = 0

const event = new Event('tetris')

const arenaSweep = () => {
  let rowCount = 1
  outer: for (let y = arena.length - 1; y > 0; --y) {
    for (let x = 0; x < arena[y].length; ++x) {
      if (arena[y][x] === 0) {
        continue outer;
      }
    }

    const row = arena.splice(y, 1)[0].fill(0)
    arena.unshift(row)
    ++y

    player.score += rowCount * 10
    rowCount *= 2
  }
}

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
    arenaSweep()
    updateScore(player.score)
    player.pos.y = 0
  }

  dropCounter = 0 
}

const updateScore = score => { 
  const tetris = new CustomEvent('tetris', { detail: { score: player.score } });
  document.body.dispatchEvent(tetris, { detail: score })
}

const draw = player => {
  context.fillStyle = '#000'
  context.fillRect(0, 0, canvas.width, canvas.height)

  drawMatrix(arena, { x: 0, y: 0 }) // Existing blocks
  drawMatrix(player.matrix, player.pos) // Current block
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
        drawSquare(colors[value], x, y, offset, scale, border)
      }
    })
  })
}

const drawSquare = (color, x, y, offset, scale, border) => {
  const squareSize = scale - border
  const startX = (x + offset.x) * scale
  const startY = (y + offset.y) * scale
  context.fillStyle = color
  context.fillRect(startX, startY, squareSize, squareSize)

  // TL Shadow
  context.fillStyle = colors[1]
  context.fillRect(startX, startY, 2, 2)

  // Inner Shadow 
  context.fillRect(startX + 2, startY + 2, 2, 4)
  context.fillRect(startX + 2, startY + 2, 4, 2)

  if (color === 'hsl(0, 0%, 99%)') {
    context.strokeStyle = colors[3];
    context.lineWidth = 1;
    context.strokeRect(startX + 1, startY + 1, squareSize - 2, squareSize - 2);
  }
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
  const num = rand(0, pieces.length - 1)
  const letter = pieces[num]

  player.matrix = createPiece(letter)
  player.pos.y = 0
  player.pos.x = (arena[0].length / 2 | 0) -
    (player.matrix[0].length / 2 | 0)

  // Clear Screen
  if (hasCollision(arena, player)) {
    arena.map(row => row.fill(0))
    player.score = 0
    updateScore()
  }
}

const bindControls = player => {
  document.addEventListener('keydown', ({ key }) => {
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
  playerReset()
  updateScore(player.score)
}

init()
update(player)
