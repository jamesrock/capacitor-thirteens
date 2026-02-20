import '../css/app2.css';
import { 
	minWidth,
	setDocumentHeight,
	floorTo,
	getLast,
	getFirst,
	limit
} from '@jamesrock/rockjs';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { Game } from './Game.js';
import interact from 'interactjs';

setDocumentHeight();

var
root = document.documentElement,
mobile = !minWidth(700),
fontSize = mobile ? 17 : 20,
padding = mobile ? 5 : 20,
cardPadding = mobile ? 3 : 7,
borderRadius = mobile ? 5 : 10,
xGap = mobile ? 10 : 20,
yGap = 18,
fakes = 2,
columnCount = (4 + fakes),
platform = Capacitor.getPlatform(),
checkPlatform = () => {
	return window.navigator.standalone || platform==='ios';
},
safeAreaTop = (checkPlatform() ? 60 : padding),
safeAreaBottom = (checkPlatform() ? 40 : padding),
columnWidth = floorTo((window.innerWidth - (padding * 2) - (xGap * (columnCount - 1))) / columnCount),
columnHeight = ((yGap * 16) + columnWidth*(350/250)),
tableWidth = ((columnWidth * (columnCount - fakes)) + (xGap * (columnCount - (1+fakes)))),
iconSize = floorTo(columnWidth - 10),
game = window.game = new Game(xGap, yGap, columnWidth, columnHeight),
savedGame = game.getSaved(),
group = [],
position = { x: 0, y: 0 };

root.style.setProperty('--icon-size', `${iconSize}px`);
root.style.setProperty('--card-width', `${columnWidth}px`);
root.style.setProperty('--card-padding', `${cardPadding}px`);
root.style.setProperty('--border-radius', `${borderRadius}px`);
root.style.setProperty('--column-height', `${columnHeight}px`);
root.style.setProperty('--body-padding', `${padding}px`);
root.style.setProperty('--safe-area-top', `${safeAreaTop}px`);
root.style.setProperty('--safe-area-bottom', `${safeAreaBottom}px`);
root.style.setProperty('--font-size', `${fontSize}px`);
root.style.setProperty('--table-width', `${tableWidth}px`);

game.table.appendTo(document.body);
game.footer.appendTo(document.body);

if(savedGame) {
	game.openSaved(savedGame);
}
else {
	game.startNew();
};

// game.startNew();

game.footer.statsScreen.render();
game.footer.liveStats.render();

// console.log('game', game);

SplashScreen.hide();

interact('.card').draggable({
	listeners: {
		start(event) {
			
			// console.log(event.type, event.target);
			position = { x: event.target.offsetLeft, y: event.target.offsetTop };

			const card = game.cards.map[event.target.dataset.id];
			const column = game.columns.columns[card.column];
			const index = column.indexOf(card.id);
			let plus = 1;
			let next = game.cards.map[column[index + plus]];
			// console.log('card', card);
			// console.log('next', next);

			group = [card];

			while(next && ((game.cards.map[group[plus - 1].id].rawValue - next.rawValue) >= 1) && next.color !== game.cards.map[group[plus - 1].id].color) {
				// console.log('is at least one less and of alternate colour!');
				group.push(next);
				plus += 1;
				next = game.cards.map[column[index + plus]];
			};

			if(getLast(group).id === getLast(column)) {
				// console.log('last card is last, good to go!');
			}
			else {
				// console.log('cannot move!');
				group = [];
				return;
			};

			group.forEach((card, index) => {
				card.setDropped(false).setZIndex(52 + index);
			});
			
			// console.log(group);

		},
		move(event) {
			position.x += event.dx;
			position.y += event.dy;
			group.forEach((card, index) => {
				card.setPosition((position.x), (position.y + (yGap * index)));
			});
		},
	}
});

interact('.column').dropzone({
	accept: '.card',
	ondrop: (event) => {

		// console.log('dropped onto column', event.target);
		const column = game.columns.columns[event.target.dataset.id];
		const firstCard = group.length && getFirst(group);
		const lastCard = column.length && game.cards.map[getLast(column)];
		const diff = firstCard && lastCard ? (firstCard.rawValue - lastCard.rawValue) : -1;
		const isColorMatch = firstCard && lastCard ? firstCard.color === lastCard.color : false;
		// console.log('diff', diff);
		// console.log('isColorMatch', isColorMatch);
		// console.log('firstCard', firstCard);
		// console.log('lastCard', lastCard);
		
		if(diff >= 0 || isColorMatch) {
			// console.log('cannot be moved into this column!');
			group.forEach((card) => {
				card.setDropped(true);
			});
			group = [];
		};
		
		group.forEach((card) => {
			const index = game.columns.columns[card.column].indexOf(card.id);
			game.columns.columns[card.column].splice(index, 1);
			game.columns.columns[event.target.dataset.id].push(card.id);
			card.setColumn(event.target.dataset.id).setDropped(true);
		});
		
		game.render();
		
	}
});

interact('.table').dropzone({
	accept: '.card',
	ondrop: () => {
		// console.log('dropped onto table', event.target);
		group.forEach((card) => {
			card.setDropped(true);
		});
		game.render();
	}
});

document.addEventListener('visibilitychange', () => {
	if(document.hidden) {
		// console.log('hidden');
		game.footer.liveStats.stop();
		game.save();
	} 
	else {
		// console.log('shown');
		savedGame = game.getSaved();
		game.setDuration(savedGame[3]);
		game.footer.liveStats.render();
	};
});
