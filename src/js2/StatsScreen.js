import { Time } from '@jamesrock/rockjs';
import { DisplayObject } from './DisplayObject';

const time = new Time();

export class StatsScreen extends DisplayObject {
  constructor(game) {

    super();

    this.game = game;
    this.node = this.make();
    this.update();
    this.render();

  };
  make() {

    var
    node = document.createElement('div');

    node.classList.add('stats-screen');

    return node;

  };
  update() {

    this.setProp('open', this.active);

  };
  render() {

    const {
      bestTime,
      bestMoves
    } = this.game;

    this.node.innerHTML = `\
      <div>
        <div>best time: ${bestTime ? time.format(bestTime) : '-'}</div>\
        <div>best moves: ${bestMoves ? bestMoves : '-'}</div>\
      </div>`;

  };
  toggle() {

    this.active = !this.active;
    this.update();

  };
  active = false;
};
