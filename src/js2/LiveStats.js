import { Time, createContainer } from '@jamesrock/rockjs';
import { DisplayObject } from './DisplayObject';

const time = new Time();

export class LiveStats extends DisplayObject {
  constructor(game) {

    super();

    this.game = game;
    this.node = this.make();
    this.render();
    this.update();

  };
  make() {

    return createContainer('stats');

  };
  render() {

    this.node.innerHTML = `\
      <div>${this.game.moves}</div>\
      ${this.game.newBest ? `<div>${this.getNewBestNotification()}</div>` : ''}\
      <div>${time.format(this.game.time || 0)}</div>`;

    this.animationFrame = requestAnimationFrame(() => {
      this.render();
    });

  };
  stop() {

    cancelAnimationFrame(this.animationFrame);

  };
  toggle() {

    this.active = !this.active;
    this.update();

  };
  show() {
    
    this.active = true;
    this.update();

  };
  hide() {
    
    this.active = false;
    this.update();

  };
  update() {

    this.setProp('active', this.active);

  };
  getNewBestNotification() {

    let out = '';

    if(this.game.newBestMoves && this.game.newBestTime) {
      out = 'MOVES AND TIME';
    }
    else if(this.game.newBestMoves) {
      out = 'MOVES';
    }
    else if(this.game.newBestTime) {
      out = 'TIME';
    };

    return `NEW BEST ${out}`;

  };
  active = false;
  animationFrame = null;
};
