import { createNode, createSVGNode } from '@jamesrock/rockjs';
import sprite from '../img/sprite.svg';

const 
suits = [
  'C',
  'D',
  'H',
  'S'
],
suitIcons = {
  'C': '&#9827;&#65038;',
  'D': '&#9830;&#65038;',
  'H': '&#9829;&#65038;',
  'S': '&#9824;&#65038;'
},
suitColours = {
  'C': 'black',
  'D': 'red',
  'H': 'red',
  'S': 'black'
},
values = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K'
],
rawValues = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13
];

export class Card {
  constructor(deck, suit, value) {

    this.deck = deck;
    this.suit = suits[suit];
    this.value = values[value];
    this.rawValue = rawValues[value];
    this.id = `${this.value}${this.suit}`;
    this.color = suitColours[this.suit];
    this.icon = suitIcons[this.suit];
    this.node = this.make();

  };
  getDisplayName() {

    return `<div class="card-value"><span>${this.value}</span><span>${this.icon}</span></div><div class="card-suit">${this.icon}</div>`;

  };
  setColumn(column) {

    // console.log(`setColumn(${column})`);
    this.column = column;
    return this;

  };
  make() {

    // var node = document.createElement('div');

    // node.innerHTML = this.getDisplayName();

    // node.classList.add('card');
    // node.classList.add(this.color);

    const
		node = this.node = createNode('div', 'card'),
    svg = createSVGNode('svg'),
		use = createSVGNode('use');

		use.setAttribute('href', `${sprite}#${this.suit}${this.value}`);

    // node.style.backgroundImage = `url(${sprite}#${this.suit}${this.value})`;

    node.setAttribute('data-id', this.id);
    node.setAttribute('data-dropped', this.dropped);

    svg.append(use);
    node.append(svg);

    return node;

  };
  setDropped(a) {

    this.dropped = a;
    this.node.setAttribute('data-dropped', this.dropped);
    return this;

  };
  setZIndex(zIndex) {

    if(zIndex < this.node.style.zIndex) {

      const node = this.node;
      setTimeout(function () {
        node.style.zIndex = zIndex;
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
  appendTo(node) {

    node.appendChild(this.node);
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
  destroy() {

    this.node.parentNode.removeChild(this.node);
    return this;

  };
  column = null;
  dropped = false;
};