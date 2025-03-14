export class Columns {
  constructor(game, columns) {

    console.log(`new Columns()`, this);
    this.game = game;
    this.columns = columns ? columns : this.make();

  };
  make() {

    return [[], [], [], [], [], [], [], []];

  };
  flatten() {

    let out = [];
    this.columns.forEach((column) => {
      out = out.concat(column);
    });
    return out;

  };
  render() {

    const $this = this;

    this.flattenedColumns = this.flatten();
    
    this.columns.forEach(function(column, index) {
      $this.renderColumn(index);
    });

  };
  renderColumn(column) {

    const {
      cards,
      xGap,
      yGap,
      cardWidth
    } = this.game;

    const {
      flattenedColumns
    } = this;

    this.columns[column].forEach(function(id, index) {
      cards.map[id].setPosition(((cardWidth + xGap) * column), (yGap * index)).setZIndex(flattenedColumns.indexOf(id));
    });

  };
  fakeWin() {
    this.columns = [[], [], [], [], this.columns[0], this.columns[1], this.columns[2], this.columns[3]];
  };
};