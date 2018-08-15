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

const update = player => {
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