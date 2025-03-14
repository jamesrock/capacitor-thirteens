import { Time } from './Time.js';

export class StatsScreen {
  constructor(game) {

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

    this.node.setAttribute('data-open', this.active);

  };
  appendTo(node) {

    node.appendChild(this.node);
    return this;

  };
  render() {

    const {
      bestTime,
      bestMoves
    } = this.game;

    this.node.innerHTML = `\
      <div>
        <div>best time: ${bestTime ? new Time(bestTime).toDisplay() : '-'}</div>\
        <div>best moves: ${bestMoves ? bestMoves : '-'}</div>\
      </div>`;

  };
  toggle() {

    this.active = !this.active;
    this.update();

  };
  active = false;
};