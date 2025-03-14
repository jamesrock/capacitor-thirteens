export class VisualColumns {
  constructor(game) {

    console.log(`new VisualColumns()`, this);
    this.game = game;
    this.columns = this.make();

  };
  make() {

    return [[], [], [], [], [], [], [], []];

  };
  render(table) {

    const { cardWidth, xGap } = this.game;
    let x = 0;

    this.columns.forEach(function(column, index) {

      var
      node = document.createElement('div');

      node.style.left = `${x}px`;

      node.classList.add('column');
      node.setAttribute('data-id', index);

      table.node.appendChild(node);

      const lastCol = (index + 1) % 8;

      if(lastCol === 0) {
        x = 0;
      }
      else {
        x += (cardWidth + xGap);
      };

    });

  };
};