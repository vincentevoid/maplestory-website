let characterElement, ignElement;
window.upperBound = window.innerWidth - 100;

class Character {
  constructor() {
    this.status = 'idle'; // Initial status is idle
    this.direction = 'right';
    this.coordinate = 0;
    this.previousCoordinate = 0;
  }

  changeAnimation() {
    characterElement.style.backgroundImage = `url('./public/images/animations/${this.status}.gif')`;
  }

  turn(direction) {
    this.direction = direction;
    if (this.direction === 'left') {
      characterElement.style.transform = 'none';
      ignElement.style.transform = 'none';
    } else if (this.direction === 'right') {
      characterElement.style.transform = 'scaleX(-1)';
      ignElement.style.transform = 'scaleX(-1)';
    }
  }

  setStatus(newStatus) {
    if (newStatus === 'idle' || newStatus === 'walking') {
      this.status = newStatus;
      this.turn(this.direction)
      this.changeAnimation();
    }
  }

  move(coordinate) {
    this.previousCoordinate = this.coordinate;
    this.coordinate = coordinate;
    // console.log(`moving to ${this.coordinate} from ${this.previousCoordinate}`, window.upperBound)
    this.setStatus('walking');

    if (this.coordinate > this.previousCoordinate) {
      this.turn('right');
    } else {
      this.turn('left');
    }

    const distance = Math.abs(coordinate - this.previousCoordinate);
    const duration = distance * 10;

    characterElement.style.transition = `left ${duration}ms linear`;
    characterElement.style.left = `${coordinate}px`;

    setTimeout(() => {
      characterElement.style.transition = '';
      this.setStatus('idle');
    }, duration);

    return duration;
  }

  moveRandomly() {
    const randomCoordinate = Math.floor(Math.random() * window.upperBound);
    const randomInterval = Math.floor(Math.random() * 3000) + 1000;

    let time = this.move(randomCoordinate);

    setTimeout(this.moveRandomly.bind(this), time + randomInterval);
  }

  init() {
    characterElement = document.getElementById('character');
    ignElement = document.getElementById('character-ign-container');
    this.setStatus('idle');
    this.turn('right');
  }
}

export default Character;