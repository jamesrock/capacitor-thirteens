import { Time } from './Time.js';

export class Duration {
  constructor(lapsed = 0) {

    // console.log(`new Duration(${lapsed})`, this);
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
};