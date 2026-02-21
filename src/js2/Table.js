import { createNode } from '@jamesrock/rockjs';

export class Table {
  constructor() {

    // console.log(`new Table()`, this);
    this.node = this.make();

  };
  make() {

    return createNode('div', 'table');

  };
  appendTo(node) {

    node.appendChild(this.node);
    return this;

  };
};
