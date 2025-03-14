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
  constructor(suit, value) {

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

    var
    node = document.createElement('div');

    node.innerHTML = this.getDisplayName();

    node.classList.add('card');
    node.classList.add(this.color);
    node.setAttribute('data-id', this.id);
    node.setAttribute('data-dropped', this.dropped);

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
  deal(index, adder) {

    const
    card = this;

    this.setDropped(false).setPosition((adder * this.column), -500);

    setTimeout(function() {
      card.setDelay(50 * index).setDropped(true);
    }, 0);

  };
  setDelay(delay) {

    this.node.style.transitionDelay = `${delay}ms`;
    return this;

  };
  column = null;
  dropped = true;
};