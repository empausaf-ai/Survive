// Day/Night cycle system
class DayNightCycle {
  constructor() {
    this.dayDuration = 10 * 60 * 1000; // 10 minutes in milliseconds
    this.nightDuration = 10 * 60 * 1000; // 10 minutes in milliseconds
    this.cycleTime = 0; // Current time in current cycle
    this.isDay = true;
    this.startTime = Date.now();
    this.totalTime = 0;
    
    // Cycle tracking
    this.dayCount = 1;
    this.nightCount = 0;
    this.cyclePhase = 'day'; // 'day' or 'night'
  }

  update() {
    const currentTime = Date.now();
    this.totalTime = currentTime - this.startTime;
    
    // Calculate position in current cycle
    const cycleDuration = this.dayDuration + this.nightDuration;
    const positionInCycle = this.totalTime % cycleDuration;
    
    // Determine if day or night
    if (positionInCycle < this.dayDuration) {
      this.isDay = true;
      this.cyclePhase = 'day';
      this.cycleTime = positionInCycle;
    } else {
      this.isDay = false;
      this.cyclePhase = 'night';
      this.cycleTime = positionInCycle - this.dayDuration;
    }
    
    // Update day/night count
    const completeCycles = Math.floor(this.totalTime / cycleDuration);
    this.dayCount = completeCycles + 1;
    this.nightCount = completeCycles;
  }

  // Get time remaining in current cycle (in seconds)
  getTimeRemaining() {
    if (this.isDay) {
      return Math.ceil((this.dayDuration - this.cycleTime) / 1000);
    } else {
      return Math.ceil((this.nightDuration - this.cycleTime) / 1000);
    }
  }

  // Get current cycle progress (0 to 1)
  getPhaseProgress() {
    if (this.isDay) {
      return this.cycleTime / this.dayDuration;
    } else {
      return this.cycleTime / this.nightDuration;
    }
  }

  // Get brightness level (0 = night, 1 = day)
  getBrightness() {
    const progress = this.getPhaseProgress();
    if (this.isDay) {
      // Fade in at start, stay bright, fade out at end
      if (progress < 0.1) {
        return progress * 10; // Fade in
      } else if (progress > 0.9) {
        return (1 - progress) * 10; // Fade out
      } else {
        return 1; // Full brightness
      }
    } else {
      // Fade out at start, stay dark, fade in at end
      if (progress < 0.1) {
        return 1 - (progress * 10); // Fade to dark
      } else if (progress > 0.9) {
        return (progress - 0.9) * 10; // Fade back to bright
      } else {
        return 0; // Full darkness
      }
    }
  }

  // Get overlay color and opacity
  getOverlayColor() {
    const brightness = this.getBrightness();
    if (this.isDay) {
      // During day: light blue overlay (minimal)
      return {
        r: 200,
        g: 220,
        b: 255,
        a: (1 - brightness) * 0.2 // Minimal overlay during day
      };
    } else {
      // During night: dark blue/black overlay
      return {
        r: 30,
        g: 30,
        b: 60,
        a: 0.6 + ((1 - brightness) * 0.3) // Darker at full night
      };
    }
  }

  draw(ctx, canvasWidth, canvasHeight) {
    const overlay = this.getOverlayColor();
    
    // Draw overlay
    ctx.fillStyle = `rgba(${overlay.r}, ${overlay.g}, ${overlay.b}, ${overlay.a})`;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw time display
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px Arial';
    const timeRemaining = this.getTimeRemaining();
    const phaseText = this.isDay ? 'DAY' : 'NIGHT';
    ctx.fillText(`${phaseText} - ${timeRemaining}s`, canvasWidth - 200, 30);

    // Draw day counter
    ctx.font = '14px Arial';
    ctx.fillText(`Day ${this.dayCount}`, canvasWidth - 200, 55);

    // Draw brightness bar
    const brightness = this.getBrightness();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(canvasWidth - 210, 70, 200, 15);
    
    ctx.fillStyle = this.isDay ? '#FFD700' : '#4169E1';
    ctx.fillRect(canvasWidth - 210, 70, 200 * brightness, 15);
    
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.strokeRect(canvasWidth - 210, 70, 200, 15);
  }

  // Check if transitioning (used for special events)
  isTransitioning() {
    const progress = this.getPhaseProgress();
    return progress < 0.1 || progress > 0.9;
  }

  // Get sun/moon position for visual effects
  getSkyObjectPosition(canvasWidth, canvasHeight) {
    const progress = this.getPhaseProgress();
    let x, y;
    
    if (this.isDay) {
      // Sun moves across sky
      x = (progress * canvasWidth * 0.8) + (canvasWidth * 0.1);
      y = canvasHeight * 0.2 - Math.sin(progress * Math.PI) * (canvasHeight * 0.15);
    } else {
      // Moon moves across sky
      x = (progress * canvasWidth * 0.8) + (canvasWidth * 0.1);
      y = canvasHeight * 0.8 - Math.sin(progress * Math.PI) * (canvasHeight * 0.15);
    }
    
    return { x, y };
  }

  drawSkyObject(ctx, canvasWidth, canvasHeight) {
    const { x, y } = this.getSkyObjectPosition(canvasWidth, canvasHeight);
    const radius = 30;

    if (this.isDay) {
      // Draw sun
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Sun rays
      ctx.strokeStyle = '#FFA500';
      ctx.lineWidth = 3;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const startX = x + Math.cos(angle) * (radius + 10);
        const startY = y + Math.sin(angle) * (radius + 10);
        const endX = x + Math.cos(angle) * (radius + 20);
        const endY = y + Math.sin(angle) * (radius + 20);
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    } else {
      // Draw moon
      ctx.fillStyle = '#E0E0E0';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Moon craters
      ctx.fillStyle = '#A9A9A9';
      ctx.beginPath();
      ctx.arc(x - 8, y - 5, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 5, y + 8, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x - 3, y + 10, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Stars during night
      if (this.cycleTime > this.nightDuration * 0.2) {
        ctx.fillStyle = '#FFFFFF';
        // Pseudorandom stars based on time
        const starCount = 30;
        for (let i = 0; i < starCount; i++) {
          const seed = i * 12345;
          const starX = (seed * 73856093) % canvasWidth;
          const starY = (seed * 19349663) % canvasHeight;
          const opacity = Math.sin(this.totalTime / 1000 + i) * 0.3 + 0.7;
          ctx.globalAlpha = opacity;
          ctx.fillRect(starX % canvasWidth, starY % canvasHeight, 1, 1);
        }
        ctx.globalAlpha = 1;
      }
    }
  }
}

// Export for use in main game
