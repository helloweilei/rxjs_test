export default function makeRun(spirit, images) {
  const currentImageIndex = 0;
  const originalUpdate = spirit.__proto__.update;
  const ellipsedTime = 0;
  const prevImg = spirit._img;
  if (images && images.length > 0) {
    spirit.update = function(...args) {
      if (this.isJumping) {
        this._img = prevImg;
      } else {
        ellipsedTime += this.interval;
        if (ellipsedTime >= 300) {
          ellipsedTime = 0;
          this._img = images[(currentImageIndex++) % images.length];
        }
      }
      return originalUpdate.call(this, ...args);
    }
    spirit.setImages = function(_images) {
      images = _images;
    }
  }
  return spirit;
}