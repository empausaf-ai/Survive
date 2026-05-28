// Player class with detailed appearance and axe defense
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 48;
    this.velocityY = 0;
    this.velocityX = 0;
    this.isJumping = false;
    this.moveSpeed = 5;
    this.gravity = 0.6;
    
    // Player appearance
    this.appearance = {
      hairColor: '#654321', // Brown hair
      eyeColor: '#4169E1', // Blue eyes
      skinColor: '#FDBCB4', // Skin tone
      jacketColor: '#556B2F', // Camouflaged jacket (olive green)
      pantsColor: '#D2B48C', // Light brown pants
      shoeColor: '#808080' // Gray shoes
    };
    
    // Axe properties
    this.axe = {
      equipped: true,
      isSwinging: false,
      swingProgress: 0,
      swingDuration: 20, // frames
      damage: 30, // Updated to 30 damage
      range: 40
    };
  }

  update(controls) {
    // Handle movement
    if (controls.isMovingLeft()) {
      this.velocityX = -this.moveSpeed;
    } else if (controls.isMovingRight()) {
      this.velocityX = this.moveSpeed;
    } else {
      this.velocityX = 0;
    }

    // Handle jumping
    if (controls.isJumping() && !this.isJumping) {
      this.velocityY = -15;
      this.isJumping = true;
    }

    // Apply gravity
    this.velocityY += this.gravity;
    this.y += this.velocityY;
    this.x += this.velocityX;

    // Ground collision (assuming ground at y = 400)
    if (this.y >= 400) {
      this.y = 400;
      this.velocityY = 0;
      this.isJumping = false;
    }

    // Update axe swing animation
    if (this.axe.isSwinging) {
      this.axe.swingProgress++;
      if (this.axe.swingProgress >= this.axe.swingDuration) {
        this.axe.isSwinging = false;
        this.axe.swingProgress = 0;
      }
    }
  }

  swing() {
    if (!this.axe.isSwinging && this.axe.equipped) {
      this.axe.isSwinging = true;
      this.axe.swingProgress = 0;
      return true;
    }
    return false;
  }

  getAxePosition() {
    // Returns the position and radius of the axe during a swing
    if (!this.axe.isSwinging) {
      return null;
    }

    const progress = this.axe.swingProgress / this.axe.swingDuration;
    const angle = progress * Math.PI; // Swing from 0 to 180 degrees

    return {
      x: this.x + this.width / 2 + Math.cos(angle) * this.axe.range,
      y: this.y + this.height / 2 + Math.sin(angle) * this.axe.range,
      range: 15,
      damage: this.axe.damage
    };
  }

  draw(ctx) {
    const baseX = this.x;
    const baseY = this.y;
    const w = this.width;
    const h = this.height;

    // Draw backpack (brown, on back)
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(baseX + 6, baseY + 12, 20, 24);
    ctx.fillRect(baseX + 8, baseY + 10, 16, 4); // Backpack top strap

    // Draw camouflaged jacket
    ctx.fillStyle = this.appearance.jacketColor;
    ctx.beginPath();
    ctx.moveTo(baseX + 4, baseY + 12);
    ctx.lineTo(baseX + 28, baseY + 12);
    ctx.lineTo(baseX + 28, baseY + 28);
    ctx.lineTo(baseX + 4, baseY + 28);
    ctx.closePath();
    ctx.fill();

    // Add camouflage pattern to jacket
    ctx.fillStyle = 'rgba(70, 70, 70, 0.3)';
    ctx.fillRect(baseX + 6, baseY + 14, 6, 6);
    ctx.fillRect(baseX + 20, baseY + 18, 6, 6);
    ctx.fillRect(baseX + 10, baseY + 22, 5, 5);

    // Draw light brown pants
    ctx.fillStyle = this.appearance.pantsColor;
    ctx.fillRect(baseX + 6, baseY + 28, 20, 12);

    // Draw gray shoes
    ctx.fillStyle = this.appearance.shoeColor;
    ctx.fillRect(baseX + 6, baseY + 40, 8, 5);
    ctx.fillRect(baseX + 18, baseY + 40, 8, 5);

    // Draw head
    ctx.fillStyle = this.appearance.skinColor;
    ctx.beginPath();
    ctx.arc(baseX + 16, baseY + 8, 6, 0, Math.PI * 2);
    ctx.fill();

    // Draw brown hair
    ctx.fillStyle = this.appearance.hairColor;
    ctx.beginPath();
    ctx.arc(baseX + 16, baseY + 5, 6, 0, Math.PI);
    ctx.fill();
    ctx.fillRect(baseX + 10, baseY + 4, 12, 4);

    // Draw blue eyes
    ctx.fillStyle = this.appearance.eyeColor;
    ctx.beginPath();
    ctx.arc(baseX + 13, baseY + 7, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(baseX + 19, baseY + 7, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Draw axe
    if (this.axe.equipped) {
      ctx.save();
      ctx.translate(baseX + w / 2, baseY + h / 2);

      if (this.axe.isSwinging) {
        const progress = this.axe.swingProgress / this.axe.swingDuration;
        const angle = progress * Math.PI;
        ctx.rotate(angle);
      }

      // Axe handle
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(this.axe.range, 0);
      ctx.stroke();

      // Axe head
      ctx.fillStyle = '#C0C0C0'; // Silver
      ctx.beginPath();
      ctx.arc(this.axe.range, 0, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }
}

// Export for use in main game
