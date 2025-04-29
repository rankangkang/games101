export class Triangle {
  constructor(a, b, c) {
    this.v = [a, b, c]
  }

  setVertex(i, v) {
    this.v[i] = v
  }

  getVertex(i) {
    return this.v[i]
  }
}
