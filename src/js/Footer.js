import { LiveStats } from './LiveStats.js';
import { StatsScreen } from './StatsScreen.js';

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

    this.getActions().forEach(function(action) {

      const
      button = document.createElement('button');

      button.innerHTML = action.name;
      button.addEventListener('click', action.handler);

      button.classList.add('action');

      actionsNode.appendChild(button);

    });

    return node;

  };
  getActions() {

    const $this = this;

    return [
      {
        name: 'undo',
        handler: () => { 
          $this.game.undo();
        }
      },
      {
        name: 'new',
        handler: () => {
          $this.game.startNew();
        }
      },
      {
        name: 'restart',
        handler: () => {
          $this.game.restart();
        }
      },
      {
        name: 'stats',
        handler: () => {
          $this.game.footer.statsScreen.toggle();
        }
      }
    ]

  };
  appendTo(node) {

    node.appendChild(this.node);
    return this;

  };
};