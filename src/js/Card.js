import { PlayingCard as BaseCard } from '@jamesrock/rockjs';

export class Card extends BaseCard {
  constructor(deck, value, suit) {

    super(deck, value, suit);
    this.setProp('id', this.id);
    this.setProp('dropped', this.dropped);

  };
  setColumn(column) {

    // console.log(`setColumn(${column})`);
    this.column = column;
    return this;

  };
  setDropped(a) {

    this.dropped = a;
    this.setProp('dropped', this.dropped);
    return this;

  };
  setZIndex(zIndex) {

    if(zIndex < this.node.style.zIndex) {

      setTimeout(() => {
        this.node.style.zIndex = zIndex;
      }, 250);

      return this;

    };

    this.node.style.zIndex = zIndex;
    return this;

  };
  setPosition(x, y) {

    this.node.style.left = `${x}px`;
    this.node.style.top = `${y}px`;
    return this;

  };
  preDeal(index) {

    const xValues = this.deck.game.getXValues();
    
    this.setPosition((xValues[this.column]), -500).setDropped(true);
    setTimeout(() => {
      this.setDelay(50 * index);
    }, 0);
    
    return this;

  };
  setDelay(delay) {

    this.node.style.transitionDelay = `${delay}ms`;
    return this;

  };
  column = null;
  dropped = false;
};
