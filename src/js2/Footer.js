import { createButton, createContainer } from '@jamesrock/rockjs';
import { LiveStats } from './LiveStats';
import { StatsScreen } from './StatsScreen';
import { DisplayObject } from './DisplayObject';

export class Footer extends DisplayObject {
  constructor(game) {

    super();

    // console.log(`new Footer()`, this);
    this.statsScreen = new StatsScreen(game);
    this.liveStats = new LiveStats(game);
    this.game = game;
    this.node = this.make();

  };
  make() {

    const
    node = createContainer('footer'),
    actionsNode = createContainer('actions');

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
    ];

  };
};
