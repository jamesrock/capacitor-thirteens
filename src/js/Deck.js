import { getLast, DeckOfPlayingCards as BaseDeck } from '@jamesrock/rockjs';
import { Card } from './Card';
import sprite from '/img/sprite.svg';

export class Deck extends BaseDeck {
  constructor(game, saved) {

    super({
      sprite, 
      saved,
      cardMaker: (deck, value, suit) => new Card(deck, value, suit)
    });
    this.game = game;

  };
  render() {

    const { table } = this.game;

    this.appendTo(table.node);

    return this;

  };
  deal() {

    this.render();

    const arranged = this.game.columns.arrange();
    
    arranged.forEach((id, index) => {
      this.map[id].preDeal(index);
    });

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
};
