import { MathUtils, Matrix4, Vector3 } from 'three'
import { Buffer, Primitive, Rasterizer } from './Rasterizer.js'
import { CanvasRenderer } from './Renderer.js'

/**
 * 获取视图矩阵
 * @param {Vector3} eyePos
 * @returns {Matrix4}
 */
function getViewMatrix(eyePos) {
  const view = new Matrix4()
  view.set(
    1,
    0,
    0,
    -eyePos.x, //
    0,
    1,
    0,
    -eyePos.y, //
    0,
    0,
    1,
    -eyePos.z, //
    0,
    0,
    0,
    1, //
  )
  return view
}

/**
 * 获取model矩阵
 * @param {number} rotate
 * @returns {Matrix4}
 */
function getModelMatrix(rotate) {
  const model = new Matrix4()
  const rad = MathUtils.degToRad(rotate)
  model.makeRotationZ(rad)
  return model
}

function getProjectionMatrix(eyeFov, aspectRatio, zNear, zFar) {
  const projection = new Matrix4()
  const top = zNear * Math.tan(MathUtils.DEG2RAD * 0.5 * eyeFov)
  const height = top * 2
  const width = height * aspectRatio
  const left = width * -0.5

  projection.makePerspective(left, left + width, top, top - height, zNear, zFar)
  return projection
}

function main() {
  const renderer = new CanvasRenderer()
  document.body.appendChild(renderer.canvas)

  let angle = 0
  const rasterizer = new Rasterizer(renderer.width, renderer.height)
  const eyePos = new Vector3(0, 0, 5)
  const pos = [new Vector3(2, 0, -2), new Vector3(0, 2, -2), new Vector3(-2, 0, -2)]

  const ind = [new Vector3(0, 1, 2)]
  const posIdx = rasterizer.loadPositions(pos)
  const indIdx = rasterizer.loadIndices(ind)

  let updateAngle = null

  function handleKeyPress(e) {
    updateAngle?.(e.key)
  }

  window.addEventListener('keydown', handleKeyPress)

  function render(_delta) {
    rasterizer.clear(Buffer.Color | Buffer.Depth)
    rasterizer.setModel(getModelMatrix(angle))
    rasterizer.setView(getViewMatrix(eyePos))
    rasterizer.setProjection(getProjectionMatrix(45, 1, 0.1, 100))
    rasterizer.draw(posIdx, indIdx, Primitive.Triangle)

    updateAngle = (key) => {
      if (key === 'ArrowUp') {
        angle = (angle + _delta * 45) % 360
      } else if (key === 'ArrowDown') {
        angle = (angle - _delta * 45) % 360
      }
    }

    renderer.fill(rasterizer.frameBuffer)
  }

  renderer.startRenderLoop(render)
}

main()
