// Game Controls Configuration
// Arrow Keys: Left/Right for movement, Up for jumping

const Controls = {
  LEFT_ARROW: 'ArrowLeft',
  RIGHT_ARROW: 'ArrowRight',
  UP_ARROW: 'ArrowUp',
  
  keys: {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false
  },

  init() {
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));
  },

  handleKeyDown(event) {
    if (event.key in this.keys) {
      this.keys[event.key] = true;
      event.preventDefault();
    }
  },

  handleKeyUp(event) {
    if (event.key in this.keys) {
      this.keys[event.key] = false;
      event.preventDefault();
    }
  },

  isMovingLeft() {
    return this.keys[this.LEFT_ARROW];
  },

  isMovingRight() {
    return this.keys[this.RIGHT_ARROW];
  },

  isJumping() {
    return this.keys[this.UP_ARROW];
  }
};

// Initialize controls when script loads
Controls.init();
