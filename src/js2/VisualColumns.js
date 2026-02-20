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

    const { columnWidth, columnHeight, xGap, table } = this.game;
    let x = 0;
    let y = 0;

    this.columns.forEach((column, index) => {

      const node = createNode('div', 'column');

      node.style.left = `${x}px`;
      node.style.top = `${y}px`;

      node.setAttribute('data-id', index);

      table.node.appendChild(node);

      if((index + 1) % 4 === 0) {
        y += columnHeight;
        x = 0;
      }
      else {
        x += (columnWidth + xGap);
      };

    });

  };
};
