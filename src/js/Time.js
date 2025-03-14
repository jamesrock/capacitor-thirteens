export class Time {
  constructor(time) {

    // console.log(`new Time()`, this);
    this.time = time;

  }
  toDisplay() {

    const
    minutes = Math.floor(this.time / 60000),
    seconds = Math.floor((this.time / 1000) % 60);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  }
};