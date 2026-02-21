import { Time, createContainer } from '@jamesrock/rockjs';
import { DisplayObject } from './DisplayObject';

const time = new Time();

export class LiveStats extends DisplayObject {
  constructor(game) {

    super();

    this.game = game;
    this.node = this.make();

  };
  make() {

    return createContainer('stats');

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
