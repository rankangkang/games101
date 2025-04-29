import { Matrix4, Vector2, Vector3, Vector4 } from 'three'
import { Triangle } from './Triangle.js'

export const Primitive = Object.freeze({
  Line: 0,
  Triangle: 1,
})

export const Buffer = Object.freeze({
  Color: 1,
  Depth: 2,
})

/**
 * 获取齐次坐标
 * @param {Vector3} v3
 * @param {number} w
 * @returns {Vector4}
 */
function getVector4(v3, w = 1) {
  return new Vector4(v3.x, v3.y, v3.z, w)
}

/**
 * 获取 MVP 矩阵
 * @param {Matrix4} model
 * @param {Matrix4} view
 * @param {Matrix4} projection
 * @returns {Matrix4}
 */
function getMvpMatrices(model, view, projection) {
  const mvp = new Matrix4()
  mvp.multiplyMatrices(view, model)
  mvp.multiplyMatrices(projection, mvp)
  return mvp
}

export class Rasterizer {
  /** @type {Vector3[][]} */
  buffers = []
  /** @type {Vector3[]} */
  frameBuffer = []
  /** @type {number[]} */
  depthBuffer = []

  width = 0
  height = 0

  /** @type {Matrix4} */
  model
  /** @type {Matrix4} */
  view
  /** @type {Matrix4} */
  projection

  constructor(width, height) {
    this.width = width
    this.height = height

    const bufferSize = width * height
    for (let i = 0; i < bufferSize; i++) {
      this.frameBuffer.push(new Vector3())
      this.depthBuffer.push(Infinity)
    }
  }

  loadPositions(positions) {
    this.buffers.push(positions)
    return this.buffers.length - 1
  }

  loadIndices(indices) {
    this.buffers.push(indices)
    return this.buffers.length - 1
  }

  clear(flag) {
    const bufferSize = this.width * this.height
    if ((flag & Buffer.Color) === Buffer.Color) {
      for (let i = 0; i < bufferSize; i++) {
        this.frameBuffer[i].set(0, 0, 0)
      }
    }

    if ((flag & Buffer.Depth) === Buffer.Depth) {
      for (let i = 0; i < bufferSize; i++) {
        this.depthBuffer[i] = Infinity
      }
    }
  }

  /**
   * @param {Matrix4} model
   */
  setModel(model) {
    this.model = model
  }

  /**
   * @param {Matrix4} view
   */
  setView(view) {
    this.view = view
  }

  /**
   * @param {Matrix4} projection
   */
  setProjection(projection) {
    this.projection = projection
  }

  draw(posBufInd, indBufInd, type) {
    if (type !== Primitive.Triangle) {
      throw new Error('Unsupported primitive type')
    }

    const buffers = this.buffers[posBufInd]
    const indices = this.buffers[indBufInd]

    const f1 = (100 - 0.1) / 2
    const f2 = (100 + 0.1) / 2
    const mvp = getMvpMatrices(this.model, this.view, this.projection)

    for (const item of indices) {
      const triangle = new Triangle()
      const v = [
        getVector4(buffers[item.x]).applyMatrix4(mvp),
        getVector4(buffers[item.y]).applyMatrix4(mvp),
        getVector4(buffers[item.z]).applyMatrix4(mvp),
      ]

      for (const vec of v) {
        vec.divideScalar(vec.w)
      }

      for (const vec of v) {
        vec.x = this.width * 0.5 * (vec.x + 1)
        vec.y = this.height * 0.5 * (vec.y + 1)
        vec.z = vec.z * f1 + f2
      }

      triangle.setVertex(0, v[0])
      triangle.setVertex(1, v[1])
      triangle.setVertex(2, v[2])
      this.rasterizeFrame(triangle)
    }
  }

  drawLine(start, end) {
    const segX = Math.ceil(Math.abs(start.x - end.x))
    const segY = Math.ceil(Math.abs(start.y - end.y))
    const seg = Math.max(segX, segY)

    const point = new Vector2()
    const color = new Vector3(1, 1, 1)

    for (let i = 0; i < seg; i++) {
      const alpha = i / (seg - 1)
      point.copy(start).lerp(end, alpha).round()
      const index = (this.height - 1 - point.y) * this.width + point.x
      this.setPixelColor(index, color)
    }
  }

  /**
   * 设置像素颜色
   * @param {number} idx
   * @param {Vector3} color
   */
  setPixelColor(idx, color) {
    if (!this.frameBuffer[idx]) {
      return
    }

    this.frameBuffer[idx].copy(color)
  }

  /**
   * 光栅化三角形
   * @param {Triangle} triangle
   */
  rasterizeFrame(triangle) {
    this.drawLine(triangle.getVertex(2), triangle.getVertex(0))
    this.drawLine(triangle.getVertex(0), triangle.getVertex(1))
    this.drawLine(triangle.getVertex(1), triangle.getVertex(2))
  }
}
