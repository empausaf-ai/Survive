// Backpack inventory system
class Backpack {
  constructor() {
    this.maxCapacity = 20;
    this.items = {
      food: 5,
      water: 5,
      knife: 1,
      blowhorn: 1,
      wood: 0,
      twigs: 0
    };
  }

  addItem(itemName, quantity = 1) {
    if (itemName in this.items) {
      const currentWeight = this.getTotalWeight();
      if (currentWeight + quantity <= this.maxCapacity) {
        this.items[itemName] += quantity;
        return true;
      }
      return false; // Not enough space
    }
    return false;
  }

  removeItem(itemName, quantity = 1) {
    if (itemName in this.items && this.items[itemName] >= quantity) {
      this.items[itemName] -= quantity;
      return true;
    }
    return false;
  }

  useFood() {
    if (this.items.food > 0) {
      this.items.food--;
      return true;
    }
    return false;
  }

  useWater() {
    if (this.items.water > 0) {
      this.items.water--;
      return true;
    }
    return false;
  }

  useBlowhorn() {
    if (this.items.blowhorn > 0) {
      return true; // Blowhorn doesn't consume, just triggers scare
    }
    return false;
  }

  getKnife() {
    return this.items.knife > 0;
  }

  getTotalWeight() {
    return Object.values(this.items).reduce((a, b) => a + b, 0);
  }

  getCapacityPercent() {
    return this.getTotalWeight() / this.maxCapacity;
  }

  isFull() {
    return this.getTotalWeight() >= this.maxCapacity;
  }

  draw(ctx, x = 10, y = 10) {
    // Draw backpack UI
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x, y, 200, 150);

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, 200, 150);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('BACKPACK', x + 10, y + 20);

    // Draw items
    const itemsDisplay = [
      `Food: ${this.items.food}`,
      `Water: ${this.items.water}`,
      `Knife: ${this.items.knife}`,
      `Blowhorn: ${this.items.blowhorn}`,
      `Wood: ${this.items.wood}`,
      `Twigs: ${this.items.twigs}`
    ];

    ctx.font = '11px Arial';
    for (let i = 0; i < itemsDisplay.length; i++) {
      ctx.fillText(itemsDisplay[i], x + 10, y + 40 + (i * 15));
    }

    // Draw capacity bar
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(x + 10, y + 130, 180, 8);
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(x + 10, y + 130, 180 * this.getCapacityPercent(), 8);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 10, y + 130, 180, 8);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '9px Arial';
    ctx.fillText(`${this.getTotalWeight()}/${this.maxCapacity}`, x + 70, y + 143);
  }
}

// Export for use in main game
