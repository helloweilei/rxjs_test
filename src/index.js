import { Game } from './Game.js';

const container = document.getElementById('canvas-container');
const { offsetWidth, offsetHeight } = container;

const canvas = document.getElementById('canvas');
canvas.width = offsetWidth;
canvas.height = offsetHeight;
const context = canvas.getContext('2d');
const gameInstance = new Game({ context, width: offsetWidth, height: offsetHeight });

gameInstance.start();

const btn = document.getElementById('btn');
btn.onclick = function() {
  if (btn.textContent === 'Stop') {
    btn.textContent = 'Start';
    gameInstance.stop();
  } else {
    btn.textContent = 'Stop';
    gameInstance.start();
  }
}

document.addEventListener('keydown', (event) => {
  if (event.keyCode === 32) {
    gameInstance.player.jump();
  }
});