import { 
  Storage,
  getLast,
  getFirst,
  isPortrait,
  makeArray
 } from '@jamesrock/rockjs';
import { Cards } from './Cards';
import { Columns } from './Columns';
import { VisualColumns } from './VisualColumns';
import { Footer } from './Footer';
import { Duration } from './Duration';
import { Table } from './Table';

export class Game {
  constructor(xGap, yGap, columnWidth) {

    // console.log(`new Game()`, this);
    this.xGap = xGap;
    this.yGap = yGap;
    this.columnWidth = columnWidth;
    this.visualColumns = new VisualColumns(this);
    this.columns = new Columns(this);
    this.footer = new Footer(this);
    this.table = new Table();
    this.storage = new Storage(this.namespace);
    this.cardHeight = (this.columnWidth*(350/250));

    this.visualColumns.render();

  };
  save() {

    const data = JSON.stringify(this.columns.columns);

    if(this.saves.length === 0 || !(getLast(this.saves) === data)) {
      this.saves.push(data);
      this.moves ++;
    };

    const {
      saves,
      moves,
      time,
      duration,
      bestMoves,
      bestTime
    } = this;

    const {
      shuffledMap,
    } = this.cards;

    this.storage.set('game', [
      saves,
      moves,
      shuffledMap,
      time ? time : duration.get(),
      bestMoves,
      bestTime
    ]);

    if(!this.time && this.checkForWin()) {

      // console.log('win!');

      this.time = this.duration.get();

      if(!this.bestMoves || this.moves < this.bestMoves) {
        this.bestMoves = this.moves;
        this.newBest = true;
        this.newBestMoves = true;
      };

      if(!this.bestTime || this.time < this.bestTime) {
        this.bestTime = this.time;
        this.newBest = true;
        this.newBestTime = true;
      };

      this.footer.statsScreen.render();
      this.save();

    };

    // console.log(`saves[${saves.length}]`, saves);
    // console.log(`moves`, moves);

    return saves;

  };
  startNew() {

    this.reset();

    if(this.cards) {
      this.cards.destroy();
    };

    this.columns = new Columns(this);
    this.cards = new Cards(this);
    
    this.updateColumns();

  };
  openSaved(game) {

    this.saves = game[0];
    this.columns = new Columns(this, this.getLastSave());
    this.moves = game[1];
    this.cards = new Cards(this, game[2]);
    this.duration = new Duration(game[3]);
    this.bestMoves = game[4];
    this.bestTime = game[5];

    this.updateColumns();

  };
  getLastSave() {
    
    return JSON.parse(getLast(this.saves));

  };
  getFirstSave() {
    
    return JSON.parse(getFirst(this.saves));

  };
  popSave() {
    
    return JSON.parse(this.saves.pop());

  };
  reset() {

    this.saves = [];
    this.moves = -1;
    this.duration = new Duration();
    this.time = null;
    this.newBestMoves = false;
    this.newBestTime = false;
    this.newBest = false;

  };
  restart() {

    if(this.moves <= 0) {
      return;
    };

    // console.log('restart', this);
    this.columns = new Columns(this, this.getFirstSave());
    this.reset();
    this.updateColumns(true);

  };
  updateColumns() {

    const flattenedColumns = this.columns.flatten();
    // console.log('flattenedColumns', flattenedColumns);

    const cardsMap = this.cards.map;

    if(flattenedColumns.length) {

      // console.log('columns already defined');

      this.columns.columns.forEach((column, index) => {
        column.forEach((id) => {
          cardsMap[id].setColumn(index);
        });
      });

    }
    else {

      // console.log('columns NOT already defined');

      let column = 0;

      this.cards.shuffledMap.forEach((id, index) => {

        const card = cardsMap[id];

        card.setColumn(column);
        this.columns.columns[column].push(id);

        if(((index + 1) % 4) === 0) {
          column = 0;
        }
        else {
          column += 1;
        };

      });

    };

    this.cards.deal();

  };
  undo() {

    if(this.saves.length <= 1) {
      return;
    };

    // console.log('undo');
    this.saves.pop();
    this.columns = new Columns(this, this.popSave());
    this.updateColumns();

  };
  checkForWin() {

    const columns = this.columns.columns;
    let count = 0;

    this.columnsToCheckForWin.forEach((index) => {
      count += columns[index].length;
    });

    return count === 0;

  };
  getSaved() {

    return this.storage.get('game');

  };
  render() {

    this.columns.update();
    this.visualColumns.update();
    this.save();
    return this;

  };
  setDuration(duration) {
    
    this.duration = new Duration(duration);
    return this;

  };
  fakeWin() {
    
    this.columns.fakeWin();
    this.render();
    return this;

  };
  getXValues() {
    
    const {
      xGap,
      columnWidth,
    } = this;

    const bob = isPortrait() ? [0,1,2,3,0,1,2,3] : [0,1,2,3,4,5,6,7];

    return bob.map((a) => ((columnWidth + xGap) * a));

  };
  getYValues() {

    // console.log(this.columns);

    const longest = this.columns.getLongest() || 13;

    const y = ((this.yGap * (longest - 1)) + this.cardHeight + this.xGap);

    console.log(longest);

    return isPortrait() ? [0,0,0,0,y,y,y,y] : [0,0,0,0,0,0,0,0];

  };
  columnsToCheckForWin = [0, 1, 2, 3];
  namespace = 'me.jamesrock.thirteens2';
  bestMoves = 0;
  bestTime = 0;
};
