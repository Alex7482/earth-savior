# Earth Savior — Game Requirements

## 1. Project Overview

Earth Savior is a futuristic, browser-based space arcade game. The player pilots an advanced spaceship and destroys asteroids to protect Earth. The game features realistic deep-space visuals, asteroid physics, collectible weapon orbs, and upgrade choices.

## 2. Technology

- HTML for the game structure.
- CSS for layout, interface, and visual effects.
- JavaScript for gameplay and physics.
- HTML5 Canvas for rendering the game.
- GitHub Pages for publishing the game online.
- No paid services required.

## 3. Visual Design

- Show a dark, realistic deep-space background with stars.
- Use a detailed futuristic spaceship with glowing engines.
- Give asteroids different sizes, irregular rocky shapes, and rotation.
- Use glowing projectiles and energy orbs.
- Keep the interface readable and uncluttered.
- Maintain a good experience on desktop and smaller screens.

## 4. Player Controls

- Left Arrow: Rotate left.
- Right Arrow: Rotate right.
- Up Arrow: Accelerate forward.
- Spacebar: Fire the equipped weapon.
- P: Pause or resume.
- Enter: Start or restart when appropriate.
- Display the controls on the start screen.
- Prevent browser scrolling when gameplay keys are pressed.

## 5. Spaceship Movement

- The spaceship rotates smoothly.
- Forward thrust accelerates the ship in the direction it faces.
- The ship retains momentum and gradually slows down through space friction.
- The ship and asteroids wrap around the edges of the playfield.
- Ship collisions reduce lives.
- Provide temporary invulnerability after respawning to prevent repeated immediate collisions.

## 6. Asteroids and Physics

- Spawn asteroids in different sizes.
- Asteroids move and rotate independently.
- Detect collisions between asteroids.
- Asteroids bounce off one another using their movement directions and velocities.
- Prevent overlapping asteroids from sticking together.
- Large asteroids split into smaller asteroids when destroyed.
- Smaller asteroids award fewer points than larger asteroids.
- Asteroids can collide with the spaceship and projectiles.
- Use stable collision handling to prevent objects from becoming trapped or moving unpredictably.

## 7. Weapons and Projectiles

- The basic weapon fires projectiles in the direction the spaceship faces.
- Projectiles have a limited lifetime.
- Projectiles can destroy asteroids.
- Destroyed asteroids award points.
- The player can collect weapon orbs dropped by destroyed asteroids.
- Weapon upgrades change the player's shooting behavior.

### Weapon Types

- Spread Shot: Fires multiple projectiles in different directions.
- Rapid Fire: Reduces the time between shots.
- Laser: Fires a focused beam with appropriate range and cooldown.
- Plasma: Fires powerful energy projectiles.

- The starting weapon is the basic blaster.
- Weapon effects must be visually distinct.
- All weapons must have balanced limits to keep gameplay challenging.

## 8. Weapon Orbs

- Some destroyed asteroids have a chance to drop a glowing weapon orb.
- Orbs appear at the asteroid's destruction location.
- The player collects an orb by touching it with the spaceship.
- Orbs disappear after collection or after a defined time.
- Each orb grants a weapon effect or a temporary weapon enhancement.
- Display a notification when a weapon changes.
- Orb drop rates must be balanced so that upgrades feel rewarding without being guaranteed after every asteroid.

## 9. Upgrade System

- Track the player's score.
- Offer an upgrade selection whenever the score crosses a new 5,000-point milestone.
- Milestones are 5,000, 10,000, 15,000, 20,000, and every additional 5,000 points.
- Pause active gameplay while the upgrade selection is open.
- Present three different eligible upgrade options.
- Let the player select one option.
- Resume gameplay after the selection.
- Do not offer the same milestone upgrade twice.
- If a single score increase crosses multiple milestones, process each milestone without skipping any.

### Possible Upgrades

- Increased firing rate.
- Additional spread-shot projectiles.
- Increased projectile damage.
- Improved ship acceleration.
- Improved turning speed.
- Longer-lasting weapon orbs or weapon effects.
- A defensive shield.
- Improved laser performance.

- Show the upgrade name and a short description for each choice.
- Keep upgrades balanced and clearly communicate their effects.

## 10. Scoring and Lives

- Display the current score.
- Display remaining lives.
- Award points for destroying asteroids.
- Give different asteroid sizes different point values.
- Start each new game with a clean score and the configured starting number of lives.
- End the game when all lives are lost.
- Display the final score and a restart option.

## 11. Game States and Interface

- Start screen with the game title Earth Savior.
- Start button or keyboard start option.
- Gameplay screen with score, lives, and weapon information.
- Pause screen.
- Upgrade selection screen.
- Game-over screen.
- Restart functionality.
- Clear feedback for collecting orbs and unlocking upgrades.

## 12. Functional Requirements

- All controls respond reliably.
- The spaceship moves in the direction it faces.
- Projectiles collide correctly with asteroids.
- Asteroids bounce off one another.
- Destroyed large asteroids split into smaller ones.
- Asteroid destruction updates the score.
- Collecting weapon orbs changes the equipped weapon or its effects.
- Reaching each score milestone opens the upgrade selection.
- Selecting an upgrade applies its effect.
- Pause and restart work correctly.
- The game can be played again after game over.

## 13. Nonfunctional Requirements

- Run in modern desktop browsers.
- Maintain responsive controls and smooth animation.
- Keep the code organized into index.html, style.css, and game.js.
- Avoid unnecessary external libraries and paid dependencies.
- Handle collisions and object cleanup efficiently.
- Ensure interface text remains readable.
- Keep gameplay usable at different window sizes.

## 14. Acceptance Tests

1. The start screen appears when the game loads.
2. Starting the game displays the spaceship and asteroids.
3. Arrow keys rotate and accelerate the spaceship correctly.
4. Spacebar fires the current weapon.
5. Projectiles can destroy asteroids.
6. Colliding asteroids bounce apart instead of passing through each other.
7. Large asteroids split into smaller asteroids.
8. Destroying asteroids increases the score.
9. Collecting a weapon orb changes the weapon or weapon effect.
10. Reaching 5,000 points presents three upgrade options.
11. Selecting an upgrade applies its effect and resumes play.
12. Further milestones trigger upgrades at every additional 5,000 points.
13. Pause, lives, game over, and restart work correctly.
14. The game runs without major console errors.

## 15. Development Plan

Phase 1: Create the game screen and realistic space background.

Phase 2: Implement spaceship movement and keyboard controls.

Phase 3: Add asteroids, movement, collisions, bouncing, and splitting.

Phase 4: Add projectiles, weapons, scoring, and lives.

Phase 5: Add collectible weapon orbs.

Phase 6: Add the three-choice upgrade system at every 5,000-point milestone.

Phase 7: Add start, pause, game-over, and restart screens.

Phase 8: Test gameplay, fix bugs, and publish using GitHub Pages.

## 16. Implementation Rules

- Build and test one phase at a time.
- Keep the code compatible with GitHub Pages.
- Explain which file each change belongs in.
- Do not replace working features unnecessarily.
- Verify controls, physics, scoring, and upgrades after changes.
- Ask for clarification if a major design decision is unclear.
