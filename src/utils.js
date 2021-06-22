import { Observable } from "rxjs";

export function randomInt(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}

export function loadImage(url) {
  return new Observable(observer => {
    const img = new Image();
    img.src = url;
    img.onload = function() {
      observer.next(img);
      observer.complete();
    }
    img.onerror = function() {
      observer.error('loadError');
    }
  });
}