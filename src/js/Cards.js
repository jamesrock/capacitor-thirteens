import { Card } from './Card.js';

export class Cards {
  constructor(game) {

    // console.log(`new Cards()`, this);
    this.game = game;
    this.cards = this.make();
    this.map = this.makeMap();
    this.shuffledMap = this.makeShuffledMap();

  };
  make() {

    var
    out = [],
    maxValue = 13,
    maxSuit = 4;

    for (var suit = 0; suit < maxSuit; suit++) {
      for (var value = 0; value < maxValue; value++) {
        out.push(new Card(suit, value));
      };
    };

    return out;

  };
  makeMap() {

    var out = {};
    this.cards.forEach(function(card) {
      out[card.id] = card;
    });
    return out;

  };
  shuffle(cards) {

    for (let i = 0; i < cards.length; i++) {
      let shuffle = Math.floor(Math.random() * (cards.length));
      [cards[i], cards[shuffle]] = [cards[shuffle], cards[i]];
    };

    return cards;

  };
  makeShuffledMap() {

    return this.shuffle(this.cards.map(function(card) {
      return card.id;
    }));

  };
  render(table) {

    this.cards.forEach(function(card) {
      card.appendTo(table.node);
    });

  };
  deal() {

    const $this = this;
    const game = this.game;

    const { cardWidth, xGap } = this.game;

    this.dealt = 0;

    game.shuffledMap.forEach(function(id) {
      game.cards.map[id].deal($this.dealt, (cardWidth + xGap));
      $this.dealt ++;
    });

    setTimeout(function () {
      game.render();
    }, 0);

    const eventHandler = (e) => {
      // console.log('eventHandler', this, e.target);
      this.clearDelays();
      e.target.removeEventListener('transitionend', eventHandler);
    };

    this.lastCard = game.cards.map[game.shuffledMap[game.shuffledMap.length - 1]];
    this.lastCard.node.addEventListener('transitionend', eventHandler);

  };
  clearDelays() {

    // console.log('clearDelays');
    this.game.cards.cards.forEach(function(card) {
      card.setDelay(0);
    });

  };
  dealt = 0;
};