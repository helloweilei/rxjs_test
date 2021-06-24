import { generate, interval, of, range, Subject, timer } from 'rxjs';
import { scan, switchMap, takeUntil, withLatestFrom, map, startWith, takeWhile, concatMap, filter } from 'rxjs/operators';
import ImageSpirit from './spirit/ImageSpirit';
import { randomInt, loadImage } from './utils';
import cloudImage from './img/cloud.png';
import treeImage from './img/tree.png';
import stoneImage from './img/stone.png';
import playerImage from './img/player.png';
import JumpableSpirit from './spirit/Jumpable';

export class Game {
  constructor(option) {
    this._ctx = option.context;
    this.width = option.width;
    this.height = option.height;

    this.fps = 60;
    this.timer$ = interval(this.msPerFrame);
    this.stop$ = null;
    this.skyHeight = this.height * 0.9;

    loadImage(playerImage).subscribe(img => {
      const width = 50;
      const height = width * img.height / img.width;
      this.player = new JumpableSpirit(
        img,
        this.width * 0.4,
        this.skyHeight - height,
        width,
        height,
        {interval: this.msPerFrame}
      );
    });
  }

  get msPerFrame() {
    return 1000 / this.fps;
  }

  start() {
    this.stop$ = new Subject();
    const speed$ = timer(0, 5000).pipe(
      map(val => val + 2),
      takeWhile(value => value <= 10),
    );

    this.timer$.pipe(
      takeUntil(this.stop$),
      withLatestFrom(
        this.createClouds(),
        this.createTrees(),
        this.createObstacles(),
        speed$
      )
    ).subscribe(([, clouds, trees, obstacles, moveSpeed]) => {
      this.paintAll(clouds, trees, obstacles, { moveSpeed });
    });
  }

  createObstacles() {
    return loadImage(stoneImage).pipe(
      switchMap(image => {
        return timer(0, 1000).pipe(
          map(() => randomInt(1, 100)),
          filter(val => val < 40),
          scan(stones => {
            const stoneHeight = randomInt(100, 150);
            const stoneWidth = 100;
            const stone = new ImageSpirit(
              image,
              this.width,
              this.skyHeight - stoneHeight + 10,
              stoneWidth,
              stoneHeight
            );
            return [...stones, stone];
          }, []),
          map(stones => stones.filter(stone => stone.x > -stone.width))
        )
      })
    );
  }

  createClouds(count = 10) {
    const space = this.width / count;
    return loadImage(cloudImage).pipe(
      switchMap(image => {
        return range(0, count).pipe(
          scan((clouds, value) => {
            const cloud = new ImageSpirit(
              image,
              value * space,
              randomInt(0, this.skyHeight - 200),
              randomInt(100, 300),
              randomInt(50, 100),
            )
            return [ ...clouds, cloud ];
          }, [])
        );
      })
    );
  }

  createTrees(count = 6) {
    const space = this.width / count;
    return loadImage(treeImage).pipe(
      switchMap(image => {
        return range(0, count).pipe(
          scan((trees, value) => {
            const ratio = image.height / image.width;
            const treeWidth = randomInt(100, 200);
            const treeHeight = treeWidth * ratio;
            const tree = new ImageSpirit(
              image,
              value * space,
              this.skyHeight - treeHeight + 5,
              treeWidth,
              treeHeight
            )
            return [ ...trees, tree ];
          }, [])
        );
      })
    );
  }

  paintAll(clouds, trees, obstacles, { moveSpeed }) {
    this.drawBackground();
    if (this.checkCollide(obstacles)) {
      this.onover && this.onover.call(this);
    }

    clouds.forEach(cloud => {
      cloud.paint(this._ctx);
      cloud.update({
        vx: moveSpeed * 0.25,
        viewWidth: this.width,
      });
    });

    trees.forEach(tree => {
      tree.paint(this._ctx);
      tree.update({
        vx: moveSpeed,
        viewWidth: this.width,
      });
    });
    obstacles.forEach(stone => {
      stone.paint(this._ctx, { loop: false });
      stone.update({
        vx: moveSpeed,
        loop: false
      });
    });

    if (this.player) {
      this.player.paint(this._ctx);
      this.player.update();
    }  
  }

  drawBackground() {
    let linearGradient= this._ctx.createLinearGradient(0, 0, 0, this.skyHeight);
    linearGradient.addColorStop(0, "skyblue");
    linearGradient.addColorStop(1, "white");
    this._ctx.fillStyle = linearGradient;
    this._ctx.fillRect(0, 0, this.width, this.skyHeight);

    this._ctx.fillStyle = '#999';
    this._ctx.fillRect(0, this.skyHeight, this.width, this.height - this.skyHeight);
  }

  stop() {
    if (this.stop$) {
      this.stop$.next();
      this.stop$.complete();
    }
  }

  checkCollide(obstacles) {
    const p = this.player;
    return obstacles.some(o => {
      return p.x + p.width > o.x && p.x < o.x + o.width &&
        p.y + p.height > o.y && p.y < o.y + o.height;
    });
  }
}