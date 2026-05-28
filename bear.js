// Grizzly Bear enemy class
class GrizzlyBear {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 48;
    this.height = 48;
    this.velocityY = 0;
    this.velocityX = 0;
    this.isJumping = false;
    
    // Health and combat
    this.maxHealth = 100;
    this.health = 100;
    this.attackDamage = 15;
    this.attackCooldown = 0;
    this.attackCooldownMax = 30; // frames between attacks
    this.attackRange = 50;
    
    // Movement
    this.moveSpeed = 3;
    this.gravity = 0.6;
    this.direction = 1; // 1 for right, -1 for left
    this.patrolDistance = 200;
    this.patrolStart = x;
    
    // State
    this.state = 'patrol'; // patrol, chase, attack, hit
    this.hitCooldown = 0;
  }

  update(playerX, playerY) {
    // Update cooldowns
    if (this.attackCooldown > 0) {
      this.attackCooldown--;
    }
    if (this.hitCooldown > 0) {
      this.hitCooldown--;
    }

    // Calculate distance to player
    const distToPlayer = Math.abs(playerX - this.x);
    const playerAboveOrBelow = Math.abs(playerY - this.y) > 50;

    // AI behavior
    if (this.health <= 0) {
      this.state = 'dead';
      this.velocityX = 0;
      return;
    }

    if (distToPlayer < this.attackRange && !playerAboveOrBelow) {
      // Chase and attack player
      this.state = 'chase';
      
      if (playerX > this.x) {
        this.velocityX = this.moveSpeed;
        this.direction = 1;
      } else {
        this.velocityX = -this.moveSpeed;
        this.direction = -1;
      }

      // Attack if in range and cooldown is ready
      if (distToPlayer < 40 && this.attackCooldown === 0) {
        this.state = 'attack';
        this.attackCooldown = this.attackCooldownMax;
      }
    } else {
      // Patrol back and forth
      this.state = 'patrol';
      
      if (this.x > this.patrolStart + this.patrolDistance) {
        this.direction = -1;
      } else if (this.x < this.patrolStart - this.patrolDistance) {
        this.direction = 1;
      }
      
      this.velocityX = this.moveSpeed * this.direction;
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
  }

  takeDamage(damage) {
    this.health -= damage;
    this.hitCooldown = 10;
    if (this.health < 0) {
      this.health = 0;
    }
  }

  attack() {
    return {
      damage: this.attackDamage,
      range: this.attackRange,
      x: this.x + this.width / 2,
      y: this.y + this.height / 2
    };
  }

  draw(ctx) {
    const baseX = this.x;
    const baseY = this.y;
    const w = this.width;
    const h = this.height;

    // Draw body (brown)
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.ellipse(baseX + w / 2, baseY + h / 2 + 4, 20, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw head
    ctx.fillStyle = '#654321';
    ctx.beginPath();
    ctx.arc(baseX + w / 2 + 8, baseY + h / 2 - 8, 12, 0, Math.PI * 2);
    ctx.fill();

    // Draw ears
    ctx.beginPath();
    ctx.arc(baseX + w / 2 - 2, baseY + h / 2 - 18, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(baseX + w / 2 + 18, baseY + h / 2 - 18, 5, 0, Math.PI * 2);
    ctx.fill();

    // Draw snout
    ctx.fillStyle = '#654321';
    ctx.beginPath();
    ctx.ellipse(baseX + w / 2 + 15, baseY + h / 2 - 5, 8, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw eyes
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(baseX + w / 2 + 4, baseY + h / 2 - 12, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(baseX + w / 2 + 14, baseY + h / 2 - 12, 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw legs
    ctx.fillStyle = '#654321';
    ctx.fillRect(baseX + w / 2 - 14, baseY + h / 2 + 16, 8, 16);
    ctx.fillRect(baseX + w / 2 - 2, baseY + h / 2 + 16, 8, 16);
    ctx.fillRect(baseX + w / 2 + 10, baseY + h / 2 + 16, 8, 16);
    ctx.fillRect(baseX + w / 2 + 22, baseY + h / 2 + 16, 8, 16);

    // Draw health bar
    const barWidth = 40;
    const barHeight = 4;
    const barX = baseX + (w - barWidth) / 2;
    const barY = baseY - 10;

    ctx.fillStyle = '#FF0000';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    ctx.fillStyle = '#00FF00';
    const healthPercent = this.health / this.maxHealth;
    ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

    // Draw border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barWidth, barHeight);

    // Flash if recently hit
    if (this.hitCooldown > 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.ellipse(baseX + w / 2, baseY + h / 2 + 4, 20, 18, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// Export for use in main game
