import { 
  pluckFirst,
  sort,
  makeArray
} from '@jamesrock/rockjs';

const total = (a) => {
  let bob = 0;
  a.forEach((a) => {
    bob += a;
  });
  return bob;
};

export class Columns {
  constructor(game, columns) {

    // console.log(`new Columns()`, this);
    this.game = game;
    this.columns = columns ? columns : this.make();

  };
  make() {

    return makeArray(8, () => []);

  };
  flatten() {

    return this.columns.flatMap((a) => a);

  };
  arrange() {

    let out = [];
    const columns = [
      [...this.columns[0]], 
      [...this.columns[1]], 
      [...this.columns[2]], 
      [...this.columns[3]], 
      [...this.columns[4]], 
      [...this.columns[5]], 
      [...this.columns[6]], 
      [...this.columns[7]], 
    ];

    const run = () => {
      
      columns.forEach((column) => {

        // console.log(column);

        if(!column.length) {
          return;
        };

        out.push(pluckFirst(column));
        
      });

      if(total([
        columns[0].length, 
        columns[1].length, 
        columns[2].length, 
        columns[3].length, 
        columns[4].length, 
        columns[5].length, 
        columns[6].length,
        columns[7].length
      ])) {

        run();
        
      };

    };
    
    run();
    
    return out;

  };
  update() {
    
    const values = {
      x: this.game.getXValues(),
      y: this.game.getYValues(),
    };
    
    this.columns.forEach((column, index) => {
      this.updateColumn(index, values);
    });

    return this;

  };
  updateColumn(column, values) {

    const {
      cards,
      yGap,
    } = this.game;

    const flattenedColumns = this.flatten();

    // console.log(this.columns[column]);

    this.columns[column].forEach((id) => {
      cards.map[id].setPosition(values.x[column], values.y[column]).setZIndex(flattenedColumns.indexOf(id));
      values.y[column] += yGap;
    });

    return this;

  };
  fakeWin() {
    
    this.columns = [[], [], [], [], this.columns[0], this.columns[1], this.columns[2], this.columns[3]];

  };
  getLongest() {

    return pluckFirst(sort([
      [...this.columns[0]],
      [...this.columns[1]],
      [...this.columns[2]],
      [...this.columns[3]]
    ].map((column) => column.length), (a) => a, '9-0'));

  };
};
