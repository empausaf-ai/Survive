// Updated Controls with W, A, I, B keys
const Controls = {
  LEFT_ARROW: 'ArrowLeft',
  RIGHT_ARROW: 'ArrowRight',
  UP_ARROW: 'ArrowUp',
  SWING_AXE: 'a', // A key to swing axe
  BREAK_BRANCHES: 'w', // W key to break branches/twigs
  OPEN_BACKPACK: 'i', // I key to open backpack
  BUILD: 'b', // B key to build
  
  keys: {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    'a': false,
    'w': false,
    'i': false,
    'b': false
  },

  init() {
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));
  },

  handleKeyDown(event) {
    const key = event.key.toLowerCase();
    if (key in this.keys) {
      this.keys[key] = true;
      if (key === 'a' || key === 'w' || key === 'i' || key === 'b') {
        event.preventDefault();
      }
    }
    if (event.key in this.keys) {
      this.keys[event.key] = true;
      event.preventDefault();
    }
  },

  handleKeyUp(event) {
    const key = event.key.toLowerCase();
    if (key in this.keys) {
      this.keys[key] = false;
    }
    if (event.key in this.keys) {
      this.keys[event.key] = false;
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
  },

  isSwingingAxe() {
    return this.keys['a'];
  },

  isBreakingBranches() {
    return this.keys['w'];
  },

  isOpeningBackpack() {
    return this.keys['i'];
  },

  isBuilding() {
    return this.keys['b'];
  }
};

// Initialize controls when script loads
Controls.init();
