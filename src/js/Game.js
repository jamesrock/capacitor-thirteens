import { 
  Storage,
  getLast,
  getFirst
 } from '@jamesrock/rockjs';
import { Cards } from './Cards.js';
import { Columns } from './Columns.js';
import { Footer } from './Footer.js';
import { Duration } from './Duration.js';
import { VisualColumns } from './VisualColumns.js';
import { Table } from './Table.js';

export class Game {
  constructor(xGap, yGap, cardWidth, cardHeight) {

    // console.log(`new Game()`, this);
    this.xGap = xGap;
    this.yGap = yGap;
    this.cardWidth = cardWidth;
    this.cardHeight = cardHeight;
    this.cards = new Cards(this);
    this.columns = new Columns(this);
    this.visualColumns = new VisualColumns(this);
    this.footer = new Footer(this);
    this.table = new Table();
    this.storage = new Storage(this.namespace);

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
      shuffledMap,
      time,
      duration,
      bestMoves,
      bestTime
    } = this;

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

    this.columns = new Columns(this);
    this.shuffledMap = this.cards.makeShuffledMap();
    this.reset();
    this.updateColumns(true);

  };
  openSaved(game) {

    this.saves = game[0];
    this.columns = new Columns(this, this.getLastSave());
    this.moves = game[1];
    this.shuffledMap = game[2];
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
  updateColumns(toDeal) {

    const flattenedColumns = this.columns.flatten();
    // console.log('flattenedColumns', flattenedColumns);

    const cardsMap = this.cards.map;

    if(flattenedColumns.length) {

      // console.log('columns already defined');

      this.columns.columns.forEach(function(column, index) {
        column.forEach(function(id) {
          cardsMap[id].setColumn(index);
        });
      });

    }
    else {

      // console.log('columns NOT already defined');

      let column = 0;
      const $this = this;

      this.shuffledMap.forEach(function(id, index) {

        const
        card = cardsMap[id];

        card.setColumn(column);
        $this.columns.columns[column].push(id);

        const lastCol = (index + 1) % 4;

        if(lastCol === 0) {
          column = 0;
        }
        else {
          column += 1;
        };

      });

    };

    toDeal ? this.cards.deal() : this.render();

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

    this.columns.render();
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
  columnsToCheckForWin = [0, 1, 2, 3];
  namespace = 'me.jamesrock.thirteens';
  bestMoves = 0;
  bestTime = 0;
};
