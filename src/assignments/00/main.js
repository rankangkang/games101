// 齐次坐标变换
import { Matrix3, Euler, Vector3 } from 'three';

function main() {
  const root = document.getElementById('root')
  const canvas = document.createElement('canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  root.appendChild(canvas)

  const originPoint = [2, 1]
  const transformedPoint = transformPoint(originPoint, 45, [1, 2])
  const ctx = canvas.getContext('2d')

  // 绘制将坐标作为文字绘制到屏幕上
  ctx.font = '16px Arial'
  ctx.fillText(`(${originPoint[0]}, ${originPoint[1]})`, 10, 10)
  ctx.fillText(`(${transformedPoint[0]}, ${transformedPoint[1]})`, 10, 30)
}

/**
 * @param {[number, number]} point 
 * @param {number} rotate 
 * @param {[number, number]} translate 
 */
function transformPoint(point, rotate, translate) {
  const [x, y] = point
  const [tx, ty] = translate

  const origin = new Vector3(x, y, 1)
  const transformMatrix = new Matrix3()

  const rotateAngle = rotate * Math.PI / 180
  const cos = Math.cos(rotateAngle)
  const sin = Math.sin(rotateAngle)

  transformMatrix.set(
    cos, -sin, tx,
    sin, cos, ty,
    0, 0, 1,
  )

  const transformed = origin.applyMatrix3(transformMatrix)

  return [transformed.x, transformed.y]
}

main()
