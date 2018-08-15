/* HOTFIX: Parcel full reload for canvas */
if (module.hot) {
  module.hot.dispose(() => {
    window.location.reload();
    throw 'whatever'
  })
}

import './hotfix'
import './main.css'

const canvas = document.getElementById('tetris')
const context = canvas.getContext('2d')

context.scale(20, 20)


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

const draw = player => {
  context.fillStyle = '#000'
  context.fillRect(0, 0, canvas.width, canvas.height)
  drawMatrix(player.matrix, player.pos)
}

let dropCounter = 0
let dropInterval = 1000
let lastDraw = 0

const update = (player, time = 0) => {
  const deltaTimeDraw = time - lastDraw
  lastDraw = time 

  dropCounter += deltaTimeDraw
  if (dropCounter > dropInterval) {
    player.pos.y++
    dropCounter = 0
  }

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

update(player)

document.addEventListener('keydown', ({ key }) => {
  switch (key) { 
    case "ArrowLeft":
      player.pos.x--
    break
    case "ArrowRight":
      player.pos.x++
    break
    case "ArrowDown":
      player.pos.y++ 
      dropCounter = 0
    break
  }
})
