import Spirit from './Spirit.js';

export default class ImageSpirit extends Spirit {
  constructor(image, x, y, width, height) {
    super(x, y, width, height);
    this._img = image;
  }

  paint(ctx, { loop = true } = {}) {
    ctx.drawImage(this._img, this.x, this.y, this.width, this.height);
    if (loop && this.x < 0) {
      ctx.drawImage(this._img, this.x + ctx.canvas.width, this.y, this.width, this.height);
    }
  }

  update({ vx = 0, viewWidth, loop = true }) {
    this.x -= vx;
    if (loop && this.x < -this.width) {
      this.x = viewWidth - this.width;
    }
  }
}