import { DisplayObject, createNode } from '@jamesrock/rockjs';

export class Table extends DisplayObject {
  constructor() {

    super();

    // console.log(`new Table()`, this);
    this.node = createNode('div', 'table');

  };
};
