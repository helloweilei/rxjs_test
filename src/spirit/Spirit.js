export default class Spirit {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  update() {
    throw 'should be implement.';
  }
  paint() {
    throw 'should be implement.';
  }
}