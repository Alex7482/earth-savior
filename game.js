
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const weaponDisplay = document.getElementById("weapon");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayMessage = document.getElementById("overlay-message");
const startButton = document.getElementById("start-button");
const statusDisplay = document.getElementById("status");

let width = 800;
let height = 500;
let running = false;
let paused = false;
let gameOver = false;
let score = 0;
let lives = 3;
let nextUpgrade = 5000;
let lastTime = 0;
let lastShot = 0;
let invulnerableUntil = 0;
let upgradeChoices = [];
let upgradeCount = 0;

const keys = {};
const asteroids = [];
const bullets = [];
const orbs = [];
const particles = [];

const ship = {
  x: 400,
  y: 250,
  vx: 0,
  vy: 0,
  angle: -Math.PI / 2,
  radius: 15,
  thrust: 220,
  turnSpeed: 3.5,
  weapon: "BLASTER",
  fireDelay: 260,
  spread: 1,
  shield: 0
};

const upgrades = [
  {
    name: "Rapid Fire",
    description: "Shoot 25% faster.",
    apply() {
      ship.fireDelay = Math.max(75, ship.fireDelay * 0.75);
    }
  },
  {
    name: "Spread Shot",
    description: "Fire more projectiles.",
    apply() {
      ship.spread = Math.min(5, ship.spread + 1);
      ship.weapon = "SPREAD";
    }
  },
  {
    name: "Engine Boost",
    description: "Increase ship acceleration.",
    apply() {
      ship.thrust *= 1.2;
    }
  },
  {
    name: "Agile Thrusters",
    description: "Turn your ship faster.",
    apply() {
      ship.turnSpeed *= 1.2;
    }
  },
  {
    name: "Energy Shield",
    description: "Block one future collision.",
    apply() {
      ship.shield += 1;
    }
  },
  {
    name: "Plasma Rounds",
    description: "Upgrade your projectile power.",
    apply() {
      ship.weapon = "PLASMA";
      ship.spread = Math.max(ship.spread, 2);
    }
  }
];

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  width = rect.width || 800;
  height = rect.height || 500;

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function wrap(object) {
  if (object.x < 0) object.x += width;
  if (object.x > width) object.x -= width;
  if (object.y < 0) object.y += height;
  if (object.y > height) object.y -= height;
}

function createAsteroid(x, y, radius, vx, vy) {
  const vertices = [];
  const count = Math.floor(random(9, 15));

  for (let i = 0; i < count; i++) {
    vertices.push(random(0.72, 1.25));
  }

  return {
    x, y, radius, vx, vy,
    angle: random(0, Math.PI * 2),
    spin: random(-1.2, 1.2),
    vertices
  };
}

function spawnAsteroids(count = 6) {
  for (let i = 0; i < count; i++) {
    let x;
    let y;

    do {
      x = random(0, width);
      y = random(0, height);
    } while (Math.hypot(x - ship.x, y - ship.y) < 100);

    const angle = random(0, Math.PI * 2);
    const speed = random(35, 85);

    asteroids.push(
      createAsteroid(
        x, y, random(23, 42),
        Math.cos(angle) * speed,
        Math.sin(angle) * speed
      )
    );
  }
}

function resetGame() {
  score = 0;
  lives = 3;
  nextUpgrade = 5000;
  upgradeCount = 0;

  asteroids.length = 0;
  bullets.length = 0;
  orbs.length = 0;
  particles.length = 0;

  ship.x = width / 2;
  ship.y = height / 2;
  ship.vx = 0;
  ship.vy = 0;
  ship.angle = -Math.PI / 2;
  ship.thrust = 220;
  ship.turnSpeed = 3.5;
  ship.weapon = "BLASTER";
  ship.fireDelay = 260;
  ship.spread = 1;
  ship.shield = 0;

  invulnerableUntil = performance.now() + 2000;
  updateHUD();
  spawnAsteroids();
}

function updateHUD() {
  scoreDisplay.textContent = score.toLocaleString();
  livesDisplay.textContent = lives;
  weaponDisplay.textContent = ship.weapon;
}

function startGame() {
  resetGame();
  overlay.style.display = "none";
  running = true;
  paused = false;
  gameOver = false;
  statusDisplay.textContent = "Mission active. Protect Earth!";
  lastTime = performance.now();
  requestAnimationFrame(loop);
}

function endGame() {
  running = false;
  gameOver = true;
  overlay.style.display = "flex";
  overlayTitle.textContent = "MISSION FAILED";
  overlayMessage.textContent =
    `Earth's fate is uncertain. Final score: ${score.toLocaleString()}`;
  startButton.textContent = "RETRY MISSION";
  statusDisplay.textContent = "Mission ended.";
}

function togglePause() {
  if (!running || gameOver) return;

  paused = !paused;

  if (paused) {
    overlay.style.display = "flex";
    overlayTitle.textContent = "MISSION PAUSED";
    overlayMessage.textContent = "Take a breath, pilot.";
    startButton.textContent = "RESUME MISSION";
  } else {
    overlay.style.display = "none";
    lastTime = performance.now();
    requestAnimationFrame(loop);
  }
}

startButton.addEventListener("click", () => {
  if (paused) {
    paused = false;
    overlay.style.display = "none";
    lastTime = performance.now();
    requestAnimationFrame(loop);
  } else {
    startGame();
  }
});

window.addEventListener("keydown", event => {
  if (
    ["ArrowUp", "ArrowLeft", "ArrowRight", "Space"].includes(event.code)
  ) {
    event.preventDefault();
  }

  keys[event.code] = true;

  if (event.code === "KeyP") togglePause();

  if (
    event.code === "Enter" &&
    (!running || gameOver)
  ) {
    startGame();
  }
});

window.addEventListener("keyup", event => {
  keys[event.code] = false;
});

function shoot(now) {
  if (!keys.Space || now - lastShot < ship.fireDelay) return;

  lastShot = now;

  const count = ship.spread;
  const spacing = 0.15;

  for (let i = 0; i < count; i++) {
    const offset = (i - (count - 1) / 2) * spacing;
    const angle = ship.angle + offset;

    bullets.push({
      x: ship.x + Math.cos(angle) * ship.radius,
      y: ship.y + Math.sin(angle) * ship.radius,
      vx: Math.cos(angle) * 460 + ship.vx * 0.3,
      vy: Math.sin(angle) * 460 + ship.vy * 0.3,
      life: 1.2,
      radius: ship.weapon === "PLASMA" ? 5 : 3
    });
  }
}

function spawnOrb(x, y) {
  if (Math.random() > 0.2) return;

  const choices = ["SPREAD", "RAPID FIRE", "PLASMA"];

  orbs.push({
    x, y,
    type: choices[Math.floor(Math.random() * choices.length)],
    life: 10,
    pulse: 0
  });
}

function addScore(points) {
  score += points;
  updateHUD();

  while (score >= nextUpgrade) {
    nextUpgrade += 5000;
    showUpgradeChoices();
  }
}

function showUpgradeChoices() {
  paused = true;
  upgradeCount++;

  const available = [...upgrades];

  upgradeChoices = [];

  while (upgradeChoices.length < 3 && available.length) {
    const index = Math.floor(Math.random() * available.length);
    upgradeChoices.push(available.splice(index, 1)[0]);
  }

  overlay.style.display = "flex";
  overlayTitle.textContent = `UPGRADE UNLOCKED: ${upgradeCount}`;
  overlayMessage.textContent = `Choose one upgrade at ${score.toLocaleString()} points.`;

  startButton.style.display = "none";

  const panel = document.createElement("div");
  panel.id = "upgrade-options";
  panel.style.display = "flex";
  panel.style.flexWrap = "wrap";
  panel.style.justifyContent = "center";
  panel.style.gap = "10px";
  panel.style.marginTop = "15px";

  upgradeChoices.forEach(upgrade => {
    const button = document.createElement("button");
    button.textContent = `${upgrade.name} — ${upgrade.description}`;
    button.style.maxWidth = "230px";
    button.style.lineHeight = "1.5";

    button.addEventListener("click", () => {
      upgrade.apply();
      panel.remove();
      startButton.style.display = "";
      overlay.style.display = "none";
      paused = false;
      updateHUD();
      lastTime = performance.now();
      requestAnimationFrame(loop);
    });

    panel.appendChild(button);
  });

  document.getElementById("upgrade-options")?.remove();
  overlay.appendChild(panel);
}

function update(dt, now) {
  if (keys.ArrowLeft) ship.angle -= ship.turnSpeed * dt;
  if (keys.ArrowRight) ship.angle += ship.turnSpeed * dt;

  if (keys.ArrowUp) {
    ship.vx += Math.cos(ship.angle) * ship.thrust * dt;
    ship.vy += Math.sin(ship.angle) * ship.thrust * dt;
  }

  ship.vx *= Math.pow(0.985, dt * 60);
  ship.vy *= Math.pow(0.985, dt * 60);

  ship.x += ship.vx * dt;
  ship.y += ship.vy * dt;
  wrap(ship);

  shoot(now);

  for (const bullet of bullets) {
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;
    bullet.life -= dt;
    wrap(bullet);
  }

  for (const asteroid of asteroids) {
    asteroid.x += asteroid.vx * dt;
    asteroid.y += asteroid.vy * dt;
    asteroid.angle += asteroid.spin * dt;
    wrap(asteroid);
  }

  // Asteroids bounce off one another.
  for (let i = 0; i < asteroids.length; i++) {
    for (let j = i + 1; j < asteroids.length; j++) {
      const a = asteroids[i];
      const b = asteroids[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const distance = Math.hypot(dx, dy);
      const minimum = a.radius + b.radius;

      if (distance > 0 && distance < minimum) {
        const nx = dx / distance;
        const ny = dy / distance;
        const relative = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;

        if (relative < 0) {
          const impulse = relative;
          a.vx += impulse * nx;
          a.vy += impulse * ny;
          b.vx -= impulse * nx;
          b.vy -= impulse * ny;
        }

        const overlap = (minimum - distance) / 2;
        a.x -= nx * overlap;
        a.y -= ny * overlap;
        b.x += nx * overlap;
        b.y += ny * overlap;
      }
    }
  }

  for (let i = asteroids.length - 1; i >= 0; i--) {
    const asteroid = asteroids[i];

    for (let j = bullets.length - 1; j >= 0; j--) {
      const bullet = bullets[j];

      if (
        Math.hypot(asteroid.x - bullet.x, asteroid.y - bullet.y)
        < asteroid.radius + bullet.radius
      ) {
        asteroids.splice(i, 1);
        bullets.splice(j, 1);

        addScore(asteroid.radius > 30 ? 100 : asteroid.radius > 18 ? 50 : 20);
        spawnOrb(asteroid.x, asteroid.y);

        if (asteroid.radius > 22) {
          for (let k = 0; k < 2; k++) {
            const angle = random(0, Math.PI * 2);
            const speed = random(45, 100);
            asteroids.push(
              createAsteroid(
                asteroid.x,
                asteroid.y,
                asteroid.radius * 0.55,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
              )
            );
          }
        }

        break;
      }
    }
  }

  for (let i = orbs.length - 1; i >= 0; i--) {
    const orb = orbs[i];
    orb.life -= dt;
    orb.pulse += dt * 5;

    if (Math.hypot(ship.x - orb.x, ship.y - orb.y) < ship.radius + 12) {
      ship.weapon = orb.type;

      if (orb.type === "RAPID FIRE") {
        ship.fireDelay = Math.max(80, ship.fireDelay * 0.8);
      }

      if (orb.type === "SPREAD") {
        ship.spread = Math.min(5, ship.spread + 1);
      }

      statusDisplay.textContent = `Weapon orb collected: ${orb.type}`;
      orbs.splice(i, 1);
      updateHUD();
    } else if (orb.life <= 0) {
      orbs.splice(i, 1);
    }
  }

  for (const asteroid of asteroids) {
    if (
      now > invulnerableUntil &&
      Math.hypot(ship.x - asteroid.x, ship.y - asteroid.y)
        < ship.radius + asteroid.radius
    ) {
      if (ship.shield > 0) {
        ship.shield--;
        invulnerableUntil = now + 1200;
        statusDisplay.textContent = "Energy shield absorbed a collision!";
      } else {
        lives--;
        invulnerableUntil = now + 1800;
        ship.x = width / 2;
        ship.y = height / 2;
        ship.vx = 0;
        ship.vy = 0;
        updateHUD();

        if (lives <= 0) {
          endGame();
          return;
        }
      }

      break;
    }
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    if (bullets[i].life <= 0) bullets.splice(i, 1);
  }
}

function drawBackground() {
  ctx.fillStyle = "#02050d";
  ctx.fillRect(0, 0, width, height);

  // Stable star positions based on a simple repeatable pattern.
  for (let i = 0; i < 100; i++) {
    const x = (i * 137.5) % width;
    const y = (i * 79.7) % height;
    const size = i % 7 === 0 ? 1.8 : 1;

    ctx.fillStyle = i % 5 === 0 ? "#8acfff" : "#d5e6ff";
    ctx.globalAlpha = 0.35 + (i % 4) * 0.15;
    ctx.fillRect(x, y, size, size);
  }

  ctx.globalAlpha = 1;
}

function drawShip(now) {
  if (now < invulnerableUntil && Math.floor(now / 100) % 2 === 0) return;

  ctx.save();
  ctx.translate(ship.x, ship.y);
  ctx.rotate(ship.angle);

  ctx.strokeStyle = "#bceaff";
  ctx.lineWidth = 2;
  ctx.shadowBlur = 12;
  ctx.shadowColor = "#25aaff";

  ctx.beginPath();
  ctx.moveTo(19, 0);
  ctx.lineTo(-12, -11);
  ctx.lineTo(-6, 0);
  ctx.lineTo(-12, 11);
  ctx.closePath();
  ctx.stroke();

  ctx.fillStyle = "#3b8ebd";
  ctx.beginPath();
  ctx.moveTo(11, 0);
  ctx.lineTo(-8, -6);
  ctx.lineTo(-4, 0);
  ctx.lineTo(-8, 6);
  ctx.closePath();
  ctx.fill();

  if (keys.ArrowUp) {
    ctx.fillStyle = "#55dfff";
    ctx.beginPath();
    ctx.moveTo(-9, -5);
    ctx.lineTo(-23 - random(0, 8), 0);
    ctx.lineTo(-9, 5);
    ctx.fill();
  }

  ctx.restore();
}

function drawAsteroid(asteroid) {
  ctx.save();
  ctx.translate(asteroid.x, asteroid.y);
  ctx.rotate(asteroid.angle);
  ctx.strokeStyle = "#9aabbf";
  ctx.lineWidth = 1.5;
  ctx.fillStyle = "#252e3a";

  ctx.beginPath();

  asteroid.vertices.forEach((scale, index) => {
    const angle = index / asteroid.vertices.length * Math.PI * 2;
    const x = Math.cos(angle) * asteroid.radius * scale;
    const y = Math.sin(angle) * asteroid.radius * scale;

    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function draw() {
  drawBackground();

  for (const asteroid of asteroids) drawAsteroid(asteroid);

  for (const bullet of bullets) {
    ctx.beginPath();
    ctx.fillStyle = ship.weapon === "PLASMA" ? "#d99cff" : "#76eaff";
    ctx.shadowBlur = 12;
    ctx.shadowColor = ctx.fillStyle;
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.shadowBlur = 0;

  for (const orb of orbs) {
    ctx.beginPath();
    ctx.fillStyle = orb.type === "PLASMA" ? "#d99cff" :
      orb.type === "SPREAD" ? "#66ffcc" : "#ffd36e";
    ctx.shadowBlur = 18;
    ctx.shadowColor = ctx.fillStyle;
    ctx.arc(orb.x, orb.y, 7 + Math.sin(orb.pulse) * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.shadowBlur = 0;
  drawShip(performance.now());
}

function loop(now) {
  if (!running || paused) return;

  const dt = Math.min((now - lastTime) / 1000, 0.033);
  lastTime = now;

  update(dt, now);
  draw();

  if (running && !paused) {
    requestAnimationFrame(loop);
  }
}

draw();
