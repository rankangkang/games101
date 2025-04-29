import { Vector3 } from 'three'

const _2PI = 2 * Math.PI
const _DIVIDE4 = 1 / 4
const _DIVIDE1000 = 1 / 1000

export class CanvasRenderer {
  /**
   * @type {HTMLCanvasElement}
   */
  canvas = undefined
  /**
   * @type {CanvasRenderingContext2D}
   */
  context = undefined

  width = 0
  height = 0
  imageData
  pixels

  constructor(canvas) {
    if (!canvas) {
      canvas = document.createElement('canvas')
    }
    this.canvas = canvas
    this.context = this.canvas.getContext('2d', { willReadFrequently: true })

    this.width = this.canvas.width
    this.height = this.canvas.height

    this.imageData = this.context.getImageData(0, 0, this.width, this.height)
    this.pixels = this.imageData.data
    this.clear()
  }

  clear() {
    this.context.fillStyle = 'black'
    this.context.fillRect(0, 0, this.width, this.height)
  }

  fill(colors) {
    for (let ii = 0, il = this.pixels.length; ii < il; ii += 4) {
      const color = colors[ii * _DIVIDE4]

      if (!color) {
        continue
      }

      this.pixels[ii] = color.x * 255
      this.pixels[ii + 1] = color.y * 255
      this.pixels[ii + 2] = color.z * 255
      this.pixels[ii + 3] = 255
    }

    this.context.putImageData(this.imageData, 0, 0)
  }

  drawPoint(coord, size, color) {
    this.context.fillStyle = `rgb( ${color.x * 255}, ${color.y * 255}, ${color.z * 255} )`

    this.context.beginPath()

    this.context.arc(coord.x, coord.y, size, 0, _2PI)

    this.context.fill()
  }

  drawLine(start, end, width, color) {
    this.context.strokeStyle = `rgb( ${color.x * 255}, ${color.y * 255}, ${color.z * 255} )`
    this.context.lineWidth = width

    this.context.beginPath()

    this.context.moveTo(start.x, start.y)
    this.context.lineTo(end.x, end.y)

    this.context.stroke()
    return this
  }

  readPixel(coord, target = new Vector3()) {
    const imageData = this.context.getImageData(coord.x, coord.y, 1, 1)
    const pixels = imageData.data

    target.x = pixels[0] / 255
    target.y = pixels[1] / 255
    target.z = pixels[2] / 255

    return target
  }

  drawPixel(coord, color) {
    this.context.fillStyle = `rgb( ${color.x * 255}, ${color.y * 255}, ${color.z * 255} )`

    this.context.fillRect(coord.x, coord.y, 1, 1)

    return this
  }

  startRenderLoop(frameCallback) {
    let elapsed = 0
    let delta = 0

    function render(time) {
      time *= _DIVIDE1000
      delta = time - elapsed
      elapsed = time

      delta = Math.min(delta, 0.1)

      frameCallback(delta)

      requestAnimationFrame(render)
    }

    render(0)
  }
}
