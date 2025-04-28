import {
  Scene,
  PerspectiveCamera,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  WebGLRenderer,
} from 'three'

const scene = new Scene()
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const geometry = new BoxGeometry(1, 1, 1)
const material = new MeshBasicMaterial({ color: 0x00ff00 })
const cube = new Mesh(geometry, material)
scene.add(cube)

camera.position.z = 5

const renderer = new WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
const container = document.getElementById('game-container')
container?.appendChild(renderer.domElement)

renderer.render(scene, camera)
