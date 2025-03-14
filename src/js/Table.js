export class Table {
  constructor() {

    // console.log(`new Table()`, this);
    this.node = this.make();

  };
  make() {

    const out = document.createElement('div');
    out.classList.add('table');
    return out;

  };
  appendTo(node) {

    node.appendChild(this.node);
    return this;

  };
};