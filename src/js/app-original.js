(function() {

	var
	save = function() {

		const stringified = JSON.stringify(columns);
		
		if(saves.length === 0 || saves[saves.length - 1] !== stringified) {
			saves.push(stringified);
			moves ++;
		};

		localStorage.setItem(namespace, JSON.stringify([
			saves,
			moves,
			shuffledMap,
			time ? time : duration.get(),
			bestMoves,
			bestTime
		]));

		log && console.log(`saves[${saves.length}]`, saves);
		log && console.log(`moves`, moves);

		return saves;

	},
	startNewGame = function() {

		log && console.log('startNewGame');
		columns = makeColumns();
		shuffledMap = makeShuffledMap();
		reset();
		updateColumns(true);

	},
	openSavedGame = function() {

		log && console.log('openSavedGame');
		saves = savedGame[0];
		columns = JSON.parse(saves[saves.length - 1]);
		moves = savedGame[1];
		shuffledMap = savedGame[2];
		duration = new Duration(savedGame[3]);
		bestMoves = savedGame[4];
		bestTime = savedGame[5];
		updateColumns();

		log && console.log('time/duration', savedGame[3]);

	},
	makeCards = function() {

		var
		out = [],
		maxValue = 13,
		maxSuit = 4;

		for(var suit=0;suit<maxSuit;suit++) {
			for(var value=0;value<maxValue;value++) {
				out.push(new Card(suit, value));
			};
		};

		return out;

	},
	mapCards = function(cards) {

		var out = {};
		cards.forEach(function(card) {
			out[card.id] = card;
		});
		return out;

	},
	shuffle = function(cards) {

		for (let i = 0; i < cards.length; i++) {
			let shuffle = Math.floor(Math.random() * (cards.length));
			[cards[i], cards[shuffle]] = [cards[shuffle], cards[i]];
		};

		return cards;

	},
	makeTable = function() {
		
		const out = document.createElement('div');
		out.classList.add('table');
		return out;

	},
	makeShuffledMap = function() {

		return shuffle(cards.map(function(card) {
			return card.id;
		}));

	},
	makeColumns = function() {

		return [[], [], [], [], [], [], [], []];

	},
	makeFooter = function() {

		const
		node = document.createElement('div'),
		actionsNode = document.createElement('div');

		node.classList.add('footer');
		actionsNode.classList.add('actions');

		liveStats.appendTo(node);
		node.appendChild(actionsNode);
		statsScreen.appendTo(node);

		actions.forEach(function(action) {

			const
			button = document.createElement('button');

			button.innerHTML = action.name;
			button.addEventListener('click', action.handler);

			button.classList.add('action');

			actionsNode.appendChild(button);

		});

		return node;

	},
	renderColumn = function(column) {

		columns[column].forEach(function(id, index) {
			cardsMap[id].setPosition(((cardWidth + xGap) * column), (yGap * index)).setZIndex(flattenedColumns.indexOf(id));
		});

	},
	render = function() {

		flattenedColumns = flattenColumns();

		columns.forEach(function(column, index) {
			renderColumn(index);
		});

		if(checkForWin()) {
			
			log && console.log('win!');

			time = duration.get();

			if(!bestMoves || moves < bestMoves) {
				bestMoves = moves;
				newBest = true;
				newBestMoves = true;
			};

			if(!bestTime || time < bestTime) {
				bestTime = time;
				newBest = true;
				newBestTime = true;
			};

			statsScreen.render();

		};
		
		save();

	},
	renderColumns = function() {

		let x = 0;

		columns.forEach(function(column, index) {

			var
			node = document.createElement('div');

			node.style.left = `${x}px`;

			node.classList.add('column');
			node.setAttribute('data-id', index);

			table.appendChild(node);

			const lastCol = (index + 1) % 8;

			if (lastCol === 0) {
				x = 0;
			}
			else {
				x += (cardWidth + xGap);
			};

		});

	},
	renderCards = function() {

		cards.forEach(function(card) {
			card.appendTo(table);
		});

	},
	updateColumns = function(toDeal) {

		flattenedColumns = flattenColumns();
		log && console.log('flattenedColumns', flattenedColumns);

		if(flattenedColumns.length) {

			log && console.log('columns already defined');

			columns.forEach(function(column, index) {
				column.forEach(function(id) {
					cardsMap[id].setColumn(index);
				});
			});

		}
		else {

			log && console.log('columns NOT already defined');

			let column = 0;

			shuffledMap.forEach(function(id, index) {

				const
				card = cardsMap[id];

				card.setColumn(column);
				columns[column].push(id);

				const lastCol = (index + 1) % 4;

				if(lastCol === 0) {
					column = 0;
				}
				else {
					column += 1;
				};

			});

		};
		
		toDeal ? deal() : render();

	},
	restart = function() {

		if(moves <= 0) {
			return;
		};
		
		log && console.log('restart');
		columns = JSON.parse(saves[0]);
		reset();
		updateColumns(true);

	},
	reset = function() {

		saves = [];
		moves = -1;
		duration = new Duration();
		time = null;
		newBestMoves = false;
		newBestTime = false;
		newBest = false;

	},
	undo = function() {
		
		if(saves.length <= 1) {
			return;
		};
		
		log && console.log('undo');
		saves.pop();
		columns = JSON.parse(saves.pop());
		updateColumns();

	},
	deal = function() {

		dealt = 0;

		shuffledMap.forEach(function(id) {
			cardsMap[id].deal();
		});

		setTimeout(function() {
			render();
		}, 0);

		cardsMap[shuffledMap[shuffledMap.length - 1]].node.addEventListener('transitionend', transitionendHandler);

	},
	clearDelays = function() {

		console.log('clearDelays');

		cards.forEach(function(card) {
			card.setDelay(0);
		});

	},
	transitionendHandler = function() {

		clearDelays();
		cardsMap[shuffledMap[shuffledMap.length - 1]].node.removeEventListener('transitionend', transitionendHandler);

	},
	flattenColumns = function() {

		let out = [];
		columns.forEach((column) => {
			out = out.concat(column);
		});
		return out;

	},
	checkForWin = function() {

		let count = 0;

		columnsToCheckForWin.forEach((index) => {
			count += columns[index].length;
		});

		return count === 0;

	},
	getSavedGame = function() {
		
		return JSON.parse(localStorage.getItem(namespace));

	},
	getNewBestNotification = function() {

		let out = '';

		if(newBestMoves && newBestTime) {
			out = 'MOVES AND TIME';
		}
		else if(newBestMoves) {
			out = 'MOVES';
		}
		else if(newBestTime) {
			out = 'TIME';
		};

		return `NEW BEST ${out}`;

	},
	log = true,
	columnsToCheckForWin = [0, 1, 2, 3],
	root = document.querySelector(':root'),
	namespace = 'thirteens.jamesrock.me',
	savedGame = getSavedGame(),
	saves = [],
	dealt,
	moves,
	bestMoves = 0,
	bestTime = 0,
	newBestMoves = false,
	newBestTime = false,
	newBest = false,
	time,
	duration,
	Card = class Card {
		constructor(suit, value) {

			this.suit = suits[suit];
			this.value = values[value];
			this.rawValue = rawValues[value];
			this.id = `${this.value}${this.suit}`;
			this.color = suitColours[this.suit];
			this.icon = suitIcons[this.suit];
			this.node = this.toHTML();

		};
		getDisplayName() {

			return `<div class="card-value"><span>${this.value}</span><span>${this.icon}</span></div><div class="card-suit">${this.icon}</div>`;

		};
		setColumn(column) {

			// console.log(`setColumn(${column})`);
			this.column = column;
			return this;

		};
		toHTML() {

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
				setTimeout(function() {
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
		deal() {
			
			const 
			card = this,
			delay = (50 * dealt);

			this.setDropped(false).setPosition(((cardWidth + xGap) * this.column), -500);

			setTimeout(function() {
				card.setDelay(delay).setDropped(true);
			}, 0);

			dealt ++;

		};
		setDelay(delay) {
			
			this.node.style.transitionDelay = `${delay}ms`;
			return this;

		};
		column = null;
		dropped = true;
	},
	Time = class Time {
		constructor(time) {

			// log && console.log(`new Time()`, this);
			this.time = time;

		}
		toDisplay() {

			const
			minutes = Math.floor(this.time / 60000),
			seconds = Math.floor((this.time / 1000) % 60);

			return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

		}
	},
	Duration = class Duration {
		constructor(lapsed = 0) {
			
			log && console.log(`new Duration(${lapsed})`, this);
			this.started = this.getTime();
			this.lapsed = lapsed;

		}
		get() {
			
			return ((this.getTime() - this.started) + this.lapsed);

		};
		getTime() {
			
			return new Date().getTime();

		};
		getDisplay() {

			return new Time(this.get()).toDisplay();

		};
	},
	StatsScreen = class StatsScreen {
		constructor() {

			this.node = this.toHTML();
			this.update();
			this.render();

		};
		toHTML() {

			var
			node = document.createElement('div');

			node.classList.add('stats-screen');

			return node;

		};
		update() {
			
			this.node.setAttribute('data-open', this.active);

		};
		appendTo(node) {

			node.appendChild(this.node);
			return this;

		};
		render() {
			
			this.node.innerHTML = `\
				<div>
					<div>best time: ${bestTime ? new Time(bestTime).toDisplay() : '-'}</div>\
					<div>best moves: ${bestMoves ? bestMoves : '-'}</div>\
				</div>`;

		};
		toggle() {
			
			this.active = !this.active;
			this.update();

		};
		active = false;
	},
	LiveStats = class LiveStats {
		constructor() {

			this.node = this.toHTML();

		};
		toHTML() {

			const node = document.createElement('div');
			node.classList.add('stats');
			return node;

		};
		appendTo(node) {

			node.appendChild(this.node);
			return this;

		};
		render() {

			const $this = this;
			this.node.innerHTML = `\
				<div>moves: ${moves}</div>\
				${newBest ? `<div>${getNewBestNotification()}</div>` : ''}\
				<div>${time ? new Time(time).toDisplay() : duration.getDisplay()}</div>`;

			this.frameRequest = requestAnimationFrame(function () {
				$this.render();
			});

		};
		stop() {
			
			cancelAnimationFrame(this.frameRequest);

		};
		frameRequest = null;
	},
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
	],
	table = makeTable(),
	cards = makeCards(),
	cardsMap = mapCards(cards),
	shuffledMap,
	columns = makeColumns(),
	flattenedColumns,
	group = [],
	statsScreen = new StatsScreen(),
	liveStats = new LiveStats(),
	query = window.matchMedia('(max-width: 600px)'),
	mobile = query.matches,
	fontSize = mobile ? 17 : 20,
	iconSize = mobile ? 2.25 : 3.5,
	padding = mobile ? 5 : 20,
	cardPadding = mobile ? 3 : 7,
	borderRadius = mobile ? 5 : 10,
	xGap = mobile ? 2 : 4,
	yGap = (fontSize + (cardPadding * 2)),
	cardWidth = ((window.innerWidth - (padding * 2) - (xGap * (columns.length - 1))) / columns.length),
	cardHeight = (cardWidth * 1.4),
	columnHeight = (window.innerHeight - (padding * 2)),
	bottomMargin = navigator.standalone ? 40 : padding,
	actions = [
		{
			name: 'undo',
			handler: undo
		},
		{
			name: 'new',
			handler: startNewGame
		},
		{
			name: 'restart',
			handler: restart
		},
		{
			name: 'stats',
			handler: () => {
				statsScreen.toggle();
			}
		}
	];

	root.style.setProperty('--icon-size', `${iconSize}em`);
	root.style.setProperty('--card-width', `${cardWidth}px`);
	root.style.setProperty('--card-height', `${cardHeight}px`);
	root.style.setProperty('--card-padding', `${cardPadding}px`);
	root.style.setProperty('--border-rdius', `${borderRadius}px`);
	root.style.setProperty('--column-height', `${columnHeight}px`);
	root.style.setProperty('--body-padding', `${padding}px`);
	root.style.setProperty('--font-size', `${fontSize}px`);
	root.style.setProperty('--bottom-margin', `${bottomMargin}px`);

	document.body.appendChild(table);
	document.body.appendChild(makeFooter());

	renderColumns();
	renderCards();

	if(savedGame) {
		openSavedGame();
	}
	else {
		startNewGame();
	};

	statsScreen.render();
	liveStats.render();

	log && console.log('cards', cards);
	log && console.log('cardsMap', cardsMap);
	log && console.log('shuffledMap', shuffledMap);
	log && console.log('columns', columns);

	let position = { x: 0, y: 0 };

	interact('.card').draggable({
		listeners: {
			start(event) {
				
				log && console.log(event.type, event.target);
				position = { x: event.target.offsetLeft, y: event.target.offsetTop };

				const card = cardsMap[event.target.dataset.id];
				const index = columns[card.column].indexOf(card.id);
				let plus = 1;
				let next = cardsMap[columns[card.column][index + plus]];
				log && console.log('card', card);
				log && console.log('next', next);

				group = [card];

				while(next && ((cardsMap[group[plus - 1].id].rawValue - next.rawValue) >= 1) && next.color !== cardsMap[group[plus - 1].id].color) {
					log && console.log('is at least one less and alternate colour!');
					group.push(next);
					plus += 1;
					next = cardsMap[columns[card.column][index + plus]];
				};

				if(group[group.length - 1].id === columns[card.column][columns[card.column].length - 1]) {
					log && console.log('last card is last, good to go!');
				}
				else {
					log && console.log('cannot move!');
					group = [];
					return;
				};

				group.forEach((card, index) => {
					card.setDropped(false).setZIndex(52 + index);
				});
				
				log && console.log(group);

			},
			move(event) {
				position.x += event.dx;
				position.y += event.dy;
				group.forEach(function(card, index) {
					card.setPosition((position.x), (position.y + (yGap * index)));
				});
			},
		}
	});

	interact('.column').dropzone({
		accept: '.card',
		ondrop: function(event) {

			log && console.log('dropped onto column', event.target);
			const column = columns[event.target.dataset.id];
			const firstCard = group.length && group[0];
			const lastCard = column.length && cardsMap[column[column.length - 1]];
			const diff = firstCard && lastCard ? (firstCard.rawValue - (lastCard.rawValue)) : -1;
			const isColorMatch = firstCard && lastCard ? firstCard.color === lastCard.color : false;
			// log && console.log('diff', diff, isColorMatch);
			// log && console.log('firstCard', firstCard);
			// log && console.log('lastCard', lastCard);
			
			if(diff >= 0 || isColorMatch) {
				log && console.log('cannot be moved into this column!');
				group.forEach(function(card) {
					card.setDropped(true);
				});
				group = [];
			};
			
			group.forEach(function(card) {
				const index = columns[card.column].indexOf(card.id);
				columns[card.column].splice(index, 1);
				columns[event.target.dataset.id].push(card.id);
				card.setColumn(event.target.dataset.id).setDropped(true);
			});
			
			render();

			log && console.log('columns', columns);
			
		}
	});

	interact('.table').dropzone({
		accept: '.card',
		ondrop: function(event) {
			log && console.log('dropped onto table', event.target);
			group.forEach(function(card) {
				card.setDropped(true);
			});
			render();
			console.log('columns', columns);
		}
	});

	document.addEventListener('visibilitychange', function() {
		if(document.hidden) {
			log && console.log('hidden');
			liveStats.stop();
			save();
		} 
		else {
			log && console.log('shown');
			savedGame = getSavedGame();
			duration = new Duration(savedGame[3]);
			liveStats.render();
		};
	});

	window.fakeWin = () => {
		columns = [[], [], [], [], columns[0], columns[1], columns[2], columns[3]];
		render();
	};

})();
