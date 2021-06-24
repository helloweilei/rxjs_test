import ImageSpirit from "./ImageSpirit";

export default class JumpableSpirit extends ImageSpirit {
  constructor(image, x, y, width, height, { interval }) {
    super(image, x, y, width, height);
    this.initY = this.y;
    this.initVy = 8;
    this.timer = 0;
    this.interval = interval;
    this.isJumping = false;
    this._g = 9.8;
    this._meterToPixelRatio = 50;
    this._jumpTimes = 0;
    this.lastY = this.initY;
  }

  update(...args) {
    super.update(...args);

    if (!this.isJumping) {
      return;
    }

    this.timer += this.interval;
    const timeInSecond = this.timer / 1000;
    const dy = this.initVy * timeInSecond - 0.5 * this._g * Math.pow(timeInSecond, 2);
    
    this.y = this.lastY - dy * this._meterToPixelRatio;
    if (this.y > this.initY) {
      this.y = this.initY;
      this.isJumping = false;
      this._jumpTimes = 0;
      this.lastY = this.initY;
    }
  }

  jump() {
    if (this.isJumping) {
      if (this._jumpTimes >= 3) {
        return;
      }
      this.lastY = this.y;
      this._jumpTimes++;
      this.timer = 0;
      return;
    };
    this.isJumping = true;
    this._jumpTimes++;
    this.timer = 0;
  }
}