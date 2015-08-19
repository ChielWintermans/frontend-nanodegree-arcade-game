/*

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

*/

/* to do list:
  - add character select screen + start button
  - add secondary target/star collection point 
  - game over on impact
*/

// this is custom code
// global variables
var playerScore = 0;

// common functions
function getDifficulty() {
  var step = 25;
  return playerScore * step;
}

function randomInteger(minimum, maximum) {
  return Math.floor(Math.random()*(maximum - minimum + 1) + minimum);
}

//functions for variation in enemy movement

function getRandomSpeed() {
  return randomInteger(100, 200);
}
function selectRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

//check if player gets hit by bugs or reaches prize:

function checkCollision(object, player) {
  return (player.x > object.x - object.hitBox.x/2 &&
          player.x < object.x + object.hitBox.x/2 &&
          player.y > object.y - object.hitBox.y/2 &&
          player.y < object.y + object.hitBox.y/2);
}
// Actor (prototype for all classes)

var Actor = function(x, y, sprite) {
  this.sprite = sprite;
  this.x = x;
  this.y = y;
};
Actor.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemy
var Enemy = function(x, y, sprite) {
  sprite = 'images/enemy-bug.png';
  Actor.call(this, x, y, sprite);
  this.speed = getRandomSpeed();
};
Enemy.prototype = Object.create(Actor.prototype);
Enemy.prototype.hitBox = {'x': 101, 'y': 83};
Enemy.prototype.startY = [68, 151, 234];
Enemy.prototype.constructor = Enemy;
Enemy.prototype.update = function(dt) {
  // update position and wrap-around if past edge
  if (this.x <= (canvas.width + this.hitBox.x/2)) {
    this.x += (this.speed + getDifficulty()) * dt;
  } else {
    this.x = -this.hitBox.x;
    this.y = selectRandom(this.startY);
    this.speed = getRandomSpeed();
  }
  // handle collisions with player
  if (checkCollision(this, player)) {
    player.reset();
    console.log("ew bugs");
    playerScore = 0;
    $('#score').text(playerScore);
  }
};

// Player
var Player = function(x, y, sprite) {
  sprite = 'images/char-boy.png';
  x = 200;
  y = 400;
  Actor.call(this, x, y, sprite);
};
Player.prototype = Object.create(Actor.prototype);
Player.prototype.constructor = Player;
Player.prototype.update = function() {
  // move player
  var stepX = 101;
  var stepY = 83;
  switch(this.action) {
    case 'up':
      if (this.y > canvas.boundaries.up) {
        this.y -= stepY;
      }
      break;
    case 'right':
      if (this.x < canvas.boundaries.right) {
        this.x += stepX;
      }
      break;
    case 'down':
      if (this.y < canvas.boundaries.down) {
        this.y += stepY;
      }
      break;
    case 'left':
      if (this.x > canvas.boundaries.left) {
        this.x -= stepX;
      }
      break;
  }
  // log position shift
  if (this.position !== this.x + ',' + this.y) {
    this.position = this.x + ',' + this.y;
    console.log(this.position);
  }
  // reset action
  this.action = null;

  // reset player if on water
  if (this.y < 25) {
    this.reset();
    playerScore = 0;
    $('#score').text(playerScore);
  }
};
Player.prototype.handleInput = function(e) {
  this.action = e;
};
Player.prototype.reset = function() {
  this.x = 200;
  this.y = 400;
};

// Star
var Star = function(x, y, sprite) {
  sprite = 'images/Star.png';
  x = selectRandom(this.startX);
  y = selectRandom(this.startY);
  Actor.call(this, x, y, sprite); 
};
Star.prototype = Object.create(Actor.prototype);
Star.prototype.hitBox = {'x': 101, 'y': 83};
Star.prototype.startX = [-2, 99, 200, 301, 402];
Star.prototype.startY = [68, 151, 234];
Star.prototype.constructor = Star;
Star.prototype.update = function(dt) {
  // handle collisions with player
    if (checkCollision(this, player)) {
        player.reset();
        console.log("yay winner");
        this.x = selectRandom(this.startX);
        this.y = selectRandom(this.startY);
        playerScore += 1;
        $('#score').text(playerScore);
        console.log("new Star");
    }
};

// Start area
var Start = function(x, y, sprite) {
  sprite = 'images/Selector.png';
  x = 200;
  y = 375;
  Actor.call(this, x, y, sprite);
};
Start.prototype = Object.create(Actor.prototype);
Start.prototype.constructor = Start;
Start.prototype.update = function(dt) {};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [
  new Enemy(-100, 68),
  new Enemy(-100, 151),
  new Enemy(-100, 234)
];
var player = new Player();
var star = new Star();
var start = new Start();

// this is default code
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

