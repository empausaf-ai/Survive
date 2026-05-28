// Black Bear enemy class
class BlackBear {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.velocityY = 0;
    this.velocityX = 0;
    this.isJumping = false;
    
    // Health and combat
    this.maxHealth = 50;
    this.health = 50;
    this.attackDamage = 10;
    this.attackCooldown = 0;
    this.attackCooldownMax = 25; // frames between attacks
    this.attackRange = 40;
    
    // Movement
    this.moveSpeed = 3.5;
    this.gravity = 0.6;
    this.direction = 1; // 1 for right, -1 for left
    this.patrolDistance = 180;
    this.patrolStart = x;
    
    // State
    this.state = 'patrol'; // patrol, chase, attack, hit, scared
    this.hitCooldown = 0;
    this.scaredCooldown = 0;
    this.scaredDuration = 180; // frames to stay scared
  }

  update(playerX, playerY) {
    // Update cooldowns
    if (this.attackCooldown > 0) {
      this.attackCooldown--;
    }
    if (this.hitCooldown > 0) {
      this.hitCooldown--;
    }
    if (this.scaredCooldown > 0) {
      this.scaredCooldown--;
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

    // If scared, run away
    if (this.scaredCooldown > 0) {
      this.state = 'scared';
      if (playerX > this.x) {
        this.velocityX = -this.moveSpeed * 1.5; // Run away faster
        this.direction = -1;
      } else {
        this.velocityX = this.moveSpeed * 1.5;
        this.direction = 1;
      }
    } else if (distToPlayer < this.attackRange && !playerAboveOrBelow) {
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
      if (distToPlayer < 35 && this.attackCooldown === 0) {
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

  scare() {
    this.scaredCooldown = this.scaredDuration;
    this.state = 'scared';
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

    // Draw body (black)
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.ellipse(baseX + w / 2, baseY + h / 2 + 2, 18, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw head
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(baseX + w / 2 + 6, baseY + h / 2 - 6, 10, 0, Math.PI * 2);
    ctx.fill();

    // Draw ears
    ctx.beginPath();
    ctx.arc(baseX + w / 2 - 2, baseY + h / 2 - 14, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(baseX + w / 2 + 14, baseY + h / 2 - 14, 4, 0, Math.PI * 2);
    ctx.fill();

    // Draw snout
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.ellipse(baseX + w / 2 + 12, baseY + h / 2 - 3, 6, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw eyes
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(baseX + w / 2 + 2, baseY + h / 2 - 8, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(baseX + w / 2 + 12, baseY + h / 2 - 8, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Draw legs
    ctx.fillStyle = '#000000';
    ctx.fillRect(baseX + w / 2 - 12, baseY + h / 2 + 14, 6, 12);
    ctx.fillRect(baseX + w / 2 - 2, baseY + h / 2 + 14, 6, 12);
    ctx.fillRect(baseX + w / 2 + 8, baseY + h / 2 + 14, 6, 12);
    ctx.fillRect(baseX + w / 2 + 18, baseY + h / 2 + 14, 6, 12);

    // Draw health bar
    const barWidth = 35;
    const barHeight = 3;
    const barX = baseX + (w - barWidth) / 2;
    const barY = baseY - 8;

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
      ctx.ellipse(baseX + w / 2, baseY + h / 2 + 2, 18, 16, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw scared state (wavy lines around bear)
    if (this.scaredCooldown > 0) {
      ctx.strokeStyle = 'rgba(255, 165, 0, 0.6)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(baseX + w / 2, baseY + h / 2, w / 2 + 4 + i * 3, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }
}

// Export for use in main game
