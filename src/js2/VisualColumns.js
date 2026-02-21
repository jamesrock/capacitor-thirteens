import { createNode, makeArray } from '@jamesrock/rockjs';
import { DisplayObject } from './DisplayObject';

class VisualColumn extends DisplayObject {
  constructor(id) {

    super();

    this.id = id;
    
    const node = this.node = createNode('div', 'column');
    node.setAttribute('data-id', this.id);

  };
  setPosition(x, y) {

    this.node.style.left = `${x}px`;
    this.node.style.top = `${y}px`;
    return this;

  };
};

export class VisualColumns {
  constructor(game) {

    // console.log(`new Columns()`, this);
    this.game = game;
    this.columns = this.make();

  };
  make() {

    return makeArray(8, (a, i) => new VisualColumn(i));

  };
  render() {

    const { table } = this.game;

    this.columns.forEach((column) => {
      column.appendTo(table.node);
    });

    this.update();

  };
  update() {

    const xValues = this.game.getXValues();
    const yValues = this.game.getYValues();

    this.columns.forEach((column, index) => {
      column.setPosition(xValues[index], yValues[index]);
    });

    return this;

  };
};
