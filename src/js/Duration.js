import { Time } from '@jamesrock/rockjs';

const time = new Time();

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

    return time.format(this.get());

  };
};
