import { shuffle, makeArray, getRandom, getLast } from '@jamesrock/rockjs';
import { Card } from './Card';

export class Cards {
  constructor(game, map) {

    // console.log(`new Cards()`, this);
    this.game = game;
    this.cards = this.make();
    this.map = this.makeMap();
    this.shuffledMap = map ? map : this.makeShuffledMap();

  };
  make() {

    var
    out = [];

    makeArray(13).forEach((value) => {
      makeArray(4).forEach((suit) => {
        out.push(new Card(this, suit, value));
      });
    });

    return out;

  };
  makeMap() {
    
    var out = {};
    this.cards.forEach((card) => {
      out[card.id] = card;
    });
    return out;

  };
  shuffle(cards) {

    return shuffle(cards);

  };
  makeShuffledMap() {

    // const suits = [getRandom(['C', 'S']), getRandom(['D', 'H'])];
    const suits = ['C', 'S', 'D', 'H'];
    return this.shuffle(this.cards.filter((card) => {
      return suits.includes(card.suit);
    }).map((card) => {
      return card.id;
    }));
    
  };
  render() {

    const { table } = this.game;

    this.shuffledMap.forEach((id) => {
      this.map[id].appendTo(table.node);
    });

    return this;

  };
  deal() {

    const { game } = this;

    this.render();

    const arranged = this.game.columns.arrange();
    
    arranged.forEach((id, index) => {
      this.map[id].preDeal(index);
    });

    setTimeout(() => {
      game.render();
    }, 0);

    const eventHandler = (e) => {
      this.clearDelays();
      e.target.removeEventListener('transitionend', eventHandler);
    };

    this.map[getLast(arranged)].node.addEventListener('transitionend', eventHandler);

  };
  clearDelays() {

    this.game.cards.cards.forEach((card) => {
      card.setDelay(0);
    });

    this.game.table.setProp('animate', true);

    return this;

  };
  destroy() {
    
    this.shuffledMap.forEach((id) => {
      this.map[id].destroy();
    });

    return this;

  };
  dealt = 0;
};
