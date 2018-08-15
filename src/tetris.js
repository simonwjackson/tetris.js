/* HOTFIX: Parcel full reload for canvas */
if (module.hot) {
  module.hot.dispose(() => {
    window.location.reload();
    throw 'whatever'
  })
}

import './main.css'
import { createMatrix } from './utils'
import { hasCollision } from './core'

const canvas = document.getElementById('tetris')
const context = canvas.getContext('2d')
const arena = createMatrix(12, 20)
const matrix = [
  [0, 0, 0],
  [1, 1, 1],
  [0, 1, 0]
]
const player = {
  pos: {
    x: 5,
    y: 5
  },
  matrix
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

const bindControls = player => { 
  document.addEventListener('keydown', ({ key }) => {
    switch (key) {
      case "ArrowLeft":
        move(-1)
        break
      case "ArrowRight":
        move(1)
        // player.pos.x++
        break
      case "ArrowDown":
        playerDrop()
        break
    }
  }) 
}

const init = () => {
  bindControls(player)
}

init() 
update(player)
