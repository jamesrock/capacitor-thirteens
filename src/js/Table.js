import { createNode } from '@jamesrock/rockjs';
import { DisplayObject } from './DisplayObject';

export class Table extends DisplayObject {
  constructor() {

    super();

    // console.log(`new Table()`, this);
    this.node = createNode('div', 'table');

  };
};
