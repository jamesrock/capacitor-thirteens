import { createNode, makeArray } from '@jamesrock/rockjs';

export class VisualColumns {
  constructor(game) {

    // console.log(`new Columns()`, this);
    this.game = game;
    this.columns = this.make();

  };
  make() {

    return makeArray(8, () => []);

  };
  render() {

    const { table } = this.game;
    const xValues = this.game.getXValues();
    const yValues = this.game.getYValues();

    this.columns.forEach((column, index) => {

      const node = createNode('div', 'column');

      node.style.left = `${xValues[index]}px`;
      node.style.top = `${yValues[index]}px`;

      node.setAttribute('data-id', index);

      table.node.appendChild(node);

    });

  };
};
