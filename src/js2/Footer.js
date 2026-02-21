import { createButton } from '@jamesrock/rockjs';
import { LiveStats } from './LiveStats';
import { StatsScreen } from './StatsScreen';

export class Footer {
  constructor(game) {

    // console.log(`new Footer()`, this);
    this.statsScreen = new StatsScreen(game);
    this.liveStats = new LiveStats(game);
    this.game = game;
    this.node = this.make();

  };
  make() {

    const
    node = document.createElement('div'),
    actionsNode = document.createElement('div');

    node.classList.add('footer');
    actionsNode.classList.add('actions');

    this.liveStats.appendTo(node);
    node.appendChild(actionsNode);
    this.statsScreen.appendTo(node);

    this.getActions().forEach((action) => {

      const button = createButton(action.name, 'action');

      button.addEventListener('click', action.handler);

      actionsNode.appendChild(button);

    });

    return node;

  };
  getActions() {

    return [
      {
        name: 'undo',
        handler: () => { 
          game.undo();
        }
      },
      {
        name: 'new',
        handler: () => {
          game.startNew();
        }
      },
      {
        name: 'restart',
        handler: () => {
          game.restart();
        }
      },
      {
        name: 'stats',
        handler: () => {
          game.footer.statsScreen.toggle();
        }
      }
    ]

  };
  appendTo(node) {

    node.appendChild(this.node);
    return this;

  };
};
