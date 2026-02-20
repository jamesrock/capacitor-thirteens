import { Time } from '@jamesrock/rockjs';

const time = new Time();

export class LiveStats {
  constructor(game) {

    this.game = game;
    this.node = this.make();

  };
  make() {

    const node = document.createElement('div');
    node.classList.add('stats');
    return node;

  };
  appendTo(node) {

    node.appendChild(this.node);
    return this;

  };
  render() {

    const $this = this;
    this.node.innerHTML = `\
      <div>moves: ${this.game.moves}</div>\
      ${this.game.newBest ? `<div>${this.getNewBestNotification()}</div>` : ''}\
      <div>${this.game.time ? time.format(this.game.time) : this.game.duration.getDisplay()}</div>`;

    this.frameRequest = requestAnimationFrame(function () {
      $this.render();
    });

  };
  stop() {

    cancelAnimationFrame(this.frameRequest);

  };
  getNewBestNotification() {

    let out = '';

    if (this.game.newBestMoves && this.game.newBestTime) {
      out = 'MOVES AND TIME';
    }
    else if (this.game.newBestMoves) {
      out = 'MOVES';
    }
    else if (this.game.newBestTime) {
      out = 'TIME';
    };

    return `NEW BEST ${out}`;

  };
  frameRequest = null;
};
