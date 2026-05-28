// Tree with branches and twigs
class Tree {
  constructor(x, y, height = 100) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = height;
    
    // Trunk properties
    this.trunkColor = '#8B4513';
    this.maxHealth = 100;
    this.health = 100;
    
    // Branches and twigs
    this.branches = [];
    this.generateBranches();
  }

  generateBranches() {
    // Generate multiple branches at different heights
    for (let i = 0; i < 5; i++) {
      const heightPercent = 0.2 + (i * 0.15);
      const branchY = this.y + (this.height * heightPercent);
      
      // Left branch
      this.branches.push({
        x: this.x,
        y: branchY,
        length: 30 + (Math.random() * 20),
        angle: Math.PI + (Math.random() * 0.6),
        health: 100,
        maxHealth: 100,
        type: 'branch',
        id: `branch-${i}-left`
      });
      
      // Right branch
      this.branches.push({
        x: this.x + this.width,
        y: branchY,
        length: 30 + (Math.random() * 20),
        angle: (Math.random() * 0.6),
        health: 100,
        maxHealth: 100,
        type: 'branch',
        id: `branch-${i}-right`
      });
      
      // Add twigs to branches
      for (let j = 0; j < 3; j++) {
        const twigDistance = this.branches.length - 2;
        const offset = (j + 1) * 0.3;
        
        this.branches.push({
          x: this.x + (Math.random() * this.width),
          y: branchY + (Math.random() * 10),
          length: 10 + (Math.random() * 15),
          angle: (Math.random() * Math.PI * 2),
          health: 50,
          maxHealth: 50,
          type: 'twig',
          id: `twig-${i}-${j}`
        });
      }
    }
  }

  getNearbyBranches(playerX, playerY, range = 50) {
    const nearby = [];
    for (let branch of this.branches) {
      const dist = Math.hypot(branch.x - playerX, branch.y - playerY);
      if (dist < range && branch.health > 0) {
        nearby.push(branch);
      }
    }
    return nearby;
  }

  breakBranch(branchId, damage = 25) {
    for (let branch of this.branches) {
      if (branch.id === branchId) {
        branch.health -= damage;
        if (branch.health < 0) {
          branch.health = 0;
        }
        return branch;
      }
    }
    return null;
  }

  getResourceYield(branch) {
    if (branch.type === 'branch') {
      return { wood: 3, twigs: 1 };
    } else if (branch.type === 'twig') {
      return { twigs: 2 };
    }
    return { wood: 0, twigs: 0 };
  }

  removeBranch(branchId) {
    this.branches = this.branches.filter(b => b.id !== branchId);
  }

  draw(ctx) {
    // Draw trunk
    ctx.fillStyle = this.trunkColor;
    ctx.fillRect(this.x + this.width / 4, this.y, this.width / 2, this.height);

    // Draw bark texture
    ctx.fillStyle = '#654321';
    for (let i = 0; i < 5; i++) {
      const randomX = this.x + this.width / 4 + (Math.random() * this.width / 2);
      const randomY = this.y + (Math.random() * this.height);
      ctx.fillRect(randomX, randomY, 3, 8);
    }

    // Draw branches and twigs
    for (let branch of this.branches) {
      if (branch.health <= 0) continue;

      const healthPercent = branch.health / branch.maxHealth;
      
      // Draw branch/twig
      ctx.save();
      ctx.translate(branch.x, branch.y);
      ctx.rotate(branch.angle);

      if (branch.type === 'branch') {
        // Branch color (brown, gets lighter as it's damaged)
        ctx.strokeStyle = `rgb(${139 + (50 * (1 - healthPercent))}, ${69 + (50 * (1 - healthPercent))}, 19)`;
        ctx.lineWidth = 6;
      } else {
        // Twig color (lighter, thinner)
        ctx.strokeStyle = `rgb(${184 + (40 * (1 - healthPercent))}, ${134 + (40 * (1 - healthPercent))}, 11)`;
        ctx.lineWidth = 2;
      }

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(branch.length, 0);
      ctx.stroke();

      // Draw small leaves on branches
      if (branch.type === 'branch') {
        ctx.fillStyle = '#228B22';
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.ellipse(branch.length * (0.2 + i * 0.2), -3, 3, 2, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(branch.length * (0.2 + i * 0.2), 3, 3, 2, -Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();

      // Draw health indicator for damaged branches
      if (healthPercent < 1) {
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(branch.x - 5, branch.y - 8, 10 * healthPercent, 3);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(branch.x - 5, branch.y - 8, 10, 3);
      }
    }
  }
}

// Tree Manager
class TreeManager {
  constructor() {
    this.trees = [];
  }

  addTree(x, y, height = 100) {
    this.trees.push(new Tree(x, y, height));
  }

  getNearbyBranches(playerX, playerY, range = 50) {
    const nearby = [];
    for (let tree of this.trees) {
      const treeBranches = tree.getNearbyBranches(playerX, playerY, range);
      for (let branch of treeBranches) {
        nearby.push({ tree, branch });
      }
    }
    return nearby;
  }

  breakNearbyBranches(playerX, playerY, damage = 25, range = 50) {
    const resources = { wood: 0, twigs: 0 };
    const nearby = this.getNearbyBranches(playerX, playerY, range);

    for (let { tree, branch } of nearby) {
      const oldHealth = branch.health;
      const brokenBranch = tree.breakBranch(branch.id, damage);
      
      if (brokenBranch && oldHealth > 0 && brokenBranch.health <= 0) {
        // Branch just broke, give resources
        const yield_ = tree.getResourceYield(brokenBranch);
        resources.wood += yield_.wood || 0;
        resources.twigs += yield_.twigs || 0;
        tree.removeBranch(branch.id);
      }
    }

    return resources;
  }

  draw(ctx) {
    for (let tree of this.trees) {
      tree.draw(ctx);
    }
  }
}

// Export for use in main game
