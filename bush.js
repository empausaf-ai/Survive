// Bush class for hiding
class Bush {
  constructor(x, y, width = 60, height = 50) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isHiding = false;
  }

  // Check if player is colliding with bush
  isPlayerInside(playerX, playerY, playerWidth, playerHeight) {
    return (
      playerX + playerWidth > this.x &&
      playerX < this.x + this.width &&
      playerY + playerHeight > this.y &&
      playerY < this.y + this.height
    );
  }

  // Get hiding state for a player position
  canHide(playerX, playerY, playerWidth, playerHeight) {
    return this.isPlayerInside(playerX, playerY, playerWidth, playerHeight);
  }

  draw(ctx) {
    // Draw main bush body (dark green)
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.ellipse(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw bush highlights/texture (lighter green)
    ctx.fillStyle = '#32CD32';
    ctx.beginPath();
    ctx.ellipse(this.x + this.width / 3, this.y + this.height / 3, this.width / 4, this.height / 4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(this.x + (this.width * 2) / 3, this.y + (this.height * 2) / 3, this.width / 4, this.height / 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw bush bottom (darker for depth)
    ctx.fillStyle = '#1a6b1a';
    ctx.beginPath();
    ctx.ellipse(this.x + this.width / 2, this.y + this.height * 0.7, this.width / 2, this.height / 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Manager for bushes and hiding mechanics
class HidingSystem {
  constructor() {
    this.bushes = [];
    this.hiddenPlayers = new Set(); // Track which players are hidden
  }

  addBush(bush) {
    this.bushes.push(bush);
  }

  addBush(x, y, width = 60, height = 50) {
    this.bushes.push(new Bush(x, y, width, height));
  }

  // Update hiding status for player
  updatePlayerHiding(player) {
    let isHiding = false;
    
    for (let bush of this.bushes) {
      if (bush.canHide(player.x, player.y, player.width, player.height)) {
        isHiding = true;
        break;
      }
    }

    if (isHiding) {
      this.hiddenPlayers.add(player);
      player.isHidden = true;
    } else {
      this.hiddenPlayers.delete(player);
      player.isHidden = false;
    }
  }

  // Check if player is hidden
  isPlayerHidden(player) {
    return this.hiddenPlayers.has(player);
  }

  // Draw bushes
  drawBushes(ctx) {
    for (let bush of this.bushes) {
      bush.draw(ctx);
    }
  }

  // Draw hidden player outlines (visible when hiding in bush)
  drawHiddenPlayerOutline(ctx, player) {
    if (this.isPlayerHidden(player)) {
      // Draw semi-transparent outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 2;
      
      // Draw player outline
      ctx.strokeRect(player.x, player.y, player.width, player.height);

      // Draw additional outline circles for visibility
      ctx.beginPath();
      ctx.arc(player.x + player.width / 2, player.y + player.height / 2, player.width / 2 + 2, 0, Math.PI * 2);
      ctx.stroke();

      // Draw a subtle glow
      ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(player.x + player.width / 2, player.y + player.height / 2, player.width / 2 + 4, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Clear all bushes
  clear() {
    this.bushes = [];
    this.hiddenPlayers.clear();
  }

  // Get all bushes (for collision detection with enemies, etc)
  getBushes() {
    return this.bushes;
  }
}

// Export for use in main game
