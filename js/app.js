const Y_POSITIONS = [60, 145, 230, 315];  // enemy starting positions
const DISTANCE = 510;  // pixels enemies travel across canvas
const START_POS = -150;  // off-screen x-coordinate start position
const NUM_OF_ENEMIES = 4;
const SPEED = 250;
const ENEMY_WAIT = 500;  // milliseconds increment to wait
const PLAYER_START_X = 200;
const PLAYER_START_Y = 405;
const PLAYER_END_Y = -20;
const PLAYER_X_INC = 100;  // pixels to move player left or right
const PLAYER_Y_INC = 85;  // pixels to move player up or down
const PLAYER_HEIGHT = 50;
const PLAYER_WIDTH = 80;
const ENEMY_HEIGHT = 50;
const ENEMY_WIDTH = 80;


// Enemies our player must avoid
class Enemy {
    constructor(wait) {
        // Variables applied to each of our instances go here,
        // we've provided one for you to get started

        // The image/sprite for our enemies, this uses
        // a helper we've provided to easily load images
        this.sprite = 'images/enemy-bug.png';
        this.x = START_POS;
        this.y = Enemy.getYPosition();
        this.speed = 0;
        this.wait = wait;
        this.width = ENEMY_WIDTH;
        this.height = ENEMY_HEIGHT;
    }

    // get a random starting y-position from Y_POSITIONS
    static getYPosition() {
        return Y_POSITIONS[Math.floor(Math.random() * Y_POSITIONS.length)];
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.

        if (this.x <= START_POS || this.x >= DISTANCE) {
            setTimeout(() => {
              this.y = Enemy.getYPosition();
              this.speed = SPEED;
              this.x = START_POS + 1;
            }, this.wait);
        }

        this.x += this.speed * dt;

    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

class Player {
    // initialize object properties
    constructor() {
        this.sprite = 'images/char-boy.png';
        this.x = PLAYER_START_X;
        this.y = PLAYER_START_Y;
    }

    // reset game if player has won or lost
    update() {
        let collision = false;
        for (const enemy of allEnemies) {
            if (this.hasCollided(enemy)) {
                collision = true;
                break;
            }
        }
        if (this.y === PLAYER_END_Y || collision) {
            this.x = PLAYER_START_X;
            this.y = PLAYER_START_Y;
        }
    }

    // takes in an object and returns a boolean representing whether or not
    // player has collided with that object
    hasCollided(obj) {
      return !(obj.x > (this.x + PLAYER_WIDTH)  ||
              (obj.x + obj.width) < this.x      ||
               obj.y > (this.y + PLAYER_HEIGHT) ||
              (obj.y + obj.height) <  this.y);
    }

    // move the player while preventing player from moving off screen
    move(x, y) {
      if (!y) {
          if (this.x > 0 && this.x < PLAYER_START_X * 2
          || !this.x && x > 0
          || this.x === PLAYER_START_X * 2 && x < 0) {
              this.x += x;
          }
      }
      else if (!x) {
          if (this.y < PLAYER_START_Y && this.y > PLAYER_END_Y
          || this.y === PLAYER_START_Y && y < 0
          || this.y === PLAYER_END_Y && y > 0) {
              this.y += y;
          }
      }
    }

    // render the player's sprite on the canvas
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    // call the move method based on which arrow key was pressed
    handleInput(key) {
        if (key === 'left') {
            this.move(-PLAYER_X_INC, 0);
        }
        else if (key === 'right') {
            this.move(PLAYER_X_INC, 0);
        }
        else if (key === 'down') {
            this.move(0, PLAYER_Y_INC);
        }
        else if (key === 'up') {
            this.move(0, -PLAYER_Y_INC);
        }
    }

}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const player = new Player();
const allEnemies = [];
let ms = 0;
for (let i = 0; i < NUM_OF_ENEMIES; i++) {
    allEnemies.push(new Enemy(ms));
    ms += ENEMY_WAIT;
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
