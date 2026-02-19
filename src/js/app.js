import '../css/app.css';
import { minWidth } from '@jamesrock/rockjs';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { Game } from './Game.js';
import interact from 'interactjs';

var
mobile = !minWidth(700),
fontSize = mobile ? 17 : 20,
iconSize = mobile ? 35 : 150,
padding = mobile ? 5 : 20,
cardPadding = mobile ? 3 : 7,
borderRadius = mobile ? 5 : 10,
xGap = mobile ? 2 : 4,
yGap = (fontSize + (cardPadding * 2)),
columnCount = 8,
platform = Capacitor.getPlatform(),
checkPlatform = () => {
	return window.navigator.standalone || platform==='ios';
},
safeAreaTop = (checkPlatform() ? 60 : padding),
safeAreaBottom = (checkPlatform() ? 40 : padding),
cardWidth = ((window.innerWidth - (padding * 2) - (xGap * (columnCount - 1))) / columnCount),
cardHeight = (cardWidth * 1.4),
columnHeight = (window.innerHeight - ((safeAreaTop + safeAreaBottom))),
game = new Game(xGap, yGap, cardWidth, cardHeight),
root = document.documentElement,
savedGame = game.getSaved(),
group = [],
position = { x: 0, y: 0 };

root.style.setProperty('--icon-size', `${iconSize}px`);
root.style.setProperty('--card-width', `${cardWidth}px`);
root.style.setProperty('--card-height', `${cardHeight}px`);
root.style.setProperty('--card-padding', `${cardPadding}px`);
root.style.setProperty('--border-rdius', `${borderRadius}px`);
root.style.setProperty('--column-height', `${columnHeight}px`);
root.style.setProperty('--body-padding', `${padding}px`);
root.style.setProperty('--safe-area-top', `${safeAreaTop}px`);
root.style.setProperty('--safe-area-bottom', `${safeAreaBottom}px`);
root.style.setProperty('--font-size', `${fontSize}px`);

game.table.appendTo(document.body);
game.footer.appendTo(document.body);

game.visualColumns.render(game.table);
game.cards.render(game.table);

if(savedGame) {
	game.openSaved(savedGame);
}
else {
	game.startNew();
};

game.footer.statsScreen.render();
game.footer.liveStats.render();

// console.log('game', game);

SplashScreen.hide();

window.game = game;

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
				// console.log('is at least one less and alternate colour!');
				group.push(next);
				plus += 1;
				next = game.cards.map[column[index + plus]];
			};

			if(group[group.length - 1].id === column[column.length - 1]) {
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
			group.forEach(function(card, index) {
				card.setPosition((position.x), (position.y + (yGap * index)));
			});
		},
	}
});

interact('.column').dropzone({
	accept: '.card',
	ondrop: function(event) {

		// console.log('dropped onto column', event.target);
		const column = game.columns.columns[event.target.dataset.id];
		const firstCard = group.length && group[0];
		const lastCard = column.length && game.cards.map[column[column.length - 1]];
		const diff = firstCard && lastCard ? (firstCard.rawValue - (lastCard.rawValue)) : -1;
		const isColorMatch = firstCard && lastCard ? firstCard.color === lastCard.color : false;
		// console.log('diff', diff);
		// console.log('isColorMatch', isColorMatch);
		// console.log('firstCard', firstCard);
		// console.log('lastCard', lastCard);
		
		if(diff >= 0 || isColorMatch) {
			// console.log('cannot be moved into this column!');
			group.forEach(function(card) {
				card.setDropped(true);
			});
			group = [];
		};
		
		group.forEach(function(card) {
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
	ondrop: function(event) {
		// console.log('dropped onto table', event.target);
		group.forEach(function(card) {
			card.setDropped(true);
		});
		game.render();
	}
});

document.addEventListener('visibilitychange', function() {
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
