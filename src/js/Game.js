import { Cards } from './Cards.js';
import { Columns } from './Columns.js';
import { Footer } from './Footer.js';
import { Duration } from './Duration.js';
import { VisualColumns } from './VisualColumns.js';
import { Table } from './Table.js';

export class Game {
  constructor(xGap, yGap, cardWidth, cardHeight) {

    console.log(`new Game()`, this);
    this.xGap = xGap;
    this.yGap = yGap;
    this.cardWidth = cardWidth;
    this.cardHeight = cardHeight;
    this.cards = new Cards(this);
    this.columns = new Columns(this);
    this.visualColumns = new VisualColumns(this);
    this.footer = new Footer(this);
    this.table = new Table();

  };
  save() {

    const stringified = JSON.stringify(this.columns.columns);

    if(this.saves.length === 0 || this.saves[this.saves.length - 1] !== stringified) {
      this.saves.push(stringified);
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

    localStorage.setItem(this.namespace, JSON.stringify([
      saves,
      moves,
      shuffledMap,
      time ? time : duration.get(),
      bestMoves,
      bestTime
    ]));

    if(!this.time && this.checkForWin()) {

      console.log('win!');

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

    console.log(`saves[${saves.length}]`, saves);
    console.log(`moves`, moves);

    return saves;

  };
  startNew() {

    console.log('startNew');
    this.columns = new Columns(this);
    this.shuffledMap = this.cards.makeShuffledMap();
    this.reset();
    this.updateColumns(true);

  };
  openSaved() {

    const savedGame = this.getSaved();

    console.log('openSaved');
    this.saves = savedGame[0];
    this.columns = new Columns(this, JSON.parse(this.saves[this.saves.length - 1]));
    this.moves = savedGame[1];
    this.shuffledMap = savedGame[2];
    this.duration = new Duration(savedGame[3]);
    this.bestMoves = savedGame[4];
    this.bestTime = savedGame[5];
    this.updateColumns();

    console.log('time/duration', savedGame[3]);

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

    console.log('restart', this);
    this.columns = new Columns(this, JSON.parse(this.saves[0]));
    this.reset();
    this.updateColumns(true);

  };
  updateColumns(toDeal) {

    const flattenedColumns = this.columns.flatten();
    console.log('flattenedColumns', flattenedColumns);

    const cardsMap = this.cards.map;

    if(flattenedColumns.length) {

      console.log('columns already defined');

      this.columns.columns.forEach(function(column, index) {
        column.forEach(function(id) {
          cardsMap[id].setColumn(index);
        });
      });

    }
    else {

      console.log('columns NOT already defined');

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

    console.log('undo');
    this.saves.pop();
    this.columns = new Columns(this, JSON.parse(this.saves.pop()));
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

    return JSON.parse(localStorage.getItem(this.namespace));

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
  namespace = 'thirteens.jamesrock.me';
  bestMoves = 0;
  bestTime = 0;
};