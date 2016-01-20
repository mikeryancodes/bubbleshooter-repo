(function () {
  if (typeof Snood === "undefined") {
    window.Snood = {};
  }

  var Game = Snood.Game = function (xDim, yDim) {
    this.state = "displayStartScreen";

    this.xDim = xDim;
    this.yDim = yDim;
    this.fallingSnoods = {};
    this.renderableObjects = [];
    this.snoods = {};
  };

  Game.prototype.render = function (ctx) {
    ctx.clearRect(0, 0, this.xDim, this.yDim);

    switch (this.state) {
      case "loadNextLevel":
        this.loadNextLevel();
        break;
      case "displayLevel":
        this.displayLevel(ctx);
        break;
      case "displayBetweenLevel":
        this.displayBetweenLevel(ctx);
        break;
      case "displayStartScreen":
        this.displayStartScreen(ctx);
        break;
      case "displayGameOver":
        this.displayGameOver(ctx);
        break;
      case "displayVictory":
        this.displayVictory(ctx);
        break;
      case "advanceLevel":
        this.advanceLevel(ctx);
        break;
    };

  };

  Game.prototype.displayVictory = function(ctx) {
    this.renderableObjects.forEach(function(renderableObject){
      renderableObject.render(ctx);
    }.bind(this));

    ctx.beginPath();

    ctx.rect(this.leftWallX + 10, (this.yDim - this.deadLineY), this.rightWallX - this.leftWallX - 20, (2 * (this.yDim - this.deadLineY)));

    ctx.fillStyle = 'grey';
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "blue";
    ctx.font = "bold 40px Arial";
    ctx.fillText("Congratulations!", this.leftWallX + 185, 252);

    ctx.font = "bold 30px Arial";
    ctx.fillText("You beat the game!", this.leftWallX + 210, 302);

    ctx.font = "bold 20px Arial";
    ctx.fillText("Press Enter to start over!", this.leftWallX + 225, 402);

    key('enter', function() {
      key.unbind('enter');
      this.state = "displayStartScreen";
    }.bind(this));

  };

  Game.prototype.displayBetweenLevel = function(ctx) {
    if (levels[this.level + 1] === undefined) {
      this.state = "displayVictory";
      this.level = -1;
      return;
    };

    this.renderableObjects.forEach(function(renderableObject){
      renderableObject.render(ctx);
    }.bind(this));

    ctx.beginPath();

    ctx.rect(this.leftWallX + 10, this.topLine.y + 10, this.rightWallX - this.leftWallX - 20, this.deadLineY - this.topLine.y - 20);

    ctx.fillStyle = 'grey';
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "blue";
    ctx.font = "bold 40px Arial";
    ctx.fillText("Nice Job!", this.leftWallX + 260, this.topLine.y + 150);

    ctx.font = "bold 20px Arial";
    ctx.fillText("Press Enter when you're ready to move on to the next level.", this.leftWallX + 65, this.topLine.y + 300);

    key('enter', function() {
      key.unbind('enter');
      this.state = "loadNextLevel";
    }.bind(this));

  };

  Game.prototype.displayStartScreen = function(ctx) {
    this.level = -1;
    this.snoodCount = 0;

    this.movingSnood = null;
    this.fallingSnoods = {};

    this.deadRow = 9;

    this.renderableObjects = [];
    this.snoods = {};
    this.addWalls();
    this.addDeadLine();
    this.addTopLine();
    this.addBackGround();
    this.launcher = new Snood.Launcher(this);
    key('a', function() {this.launcher.fire()}.bind(this));

    this.nextSnood = this.launcher.getNextSnood();
    this.meter = null;

    this.renderableObjects.forEach(function(renderableObject){
      renderableObject.render(ctx);
    }.bind(this));

    this.level = -1;
    this.snoods = {};

    ctx.beginPath();

    ctx.rect(this.leftWallX + 10, this.topLine.y + 10, this.rightWallX - this.leftWallX - 20, this.deadLineY - this.topLine.y - 20);

    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "blue";
    ctx.font = "bold 40px Arial";
    ctx.fillText("Welcome to my bubble shooter", this.leftWallX + 50, this.topLine.y + 150);

    ctx.font = "bold 20px Arial";
    ctx.fillText("Press A to fire", this.leftWallX + 260, this.topLine.y + 270);

    ctx.fillText("Press Enter to Begin", this.leftWallX + 230, this.topLine.y + 300);

    key('enter', function() {
      key.unbind('enter');
      this.state = "loadNextLevel";
    }.bind(this));

  };

  Game.prototype.addBackGround = function() {

    var leftSide = {};
    leftSide.render = function(ctx) {
      ctx.beginPath();
      ctx.rect(0, 0, this.leftWallX, this.yDim);
      ctx.fillStyle = 'grey';
      ctx.fill();
      ctx.stroke();
    }.bind(this);
    this.renderableObjects.push(leftSide);

    var rightSide = {};
    rightSide.render = function(ctx) {
      ctx.beginPath();
      ctx.rect(this.rightWallX, 0, this.xDim, this.yDim);
      ctx.fillStyle = 'grey';
      ctx.fill();
      ctx.stroke();
    }.bind(this);
    this.renderableObjects.push(rightSide);
  };

  Game.prototype.loadNextLevel = function() {
    //radius = 30

    this.level += 1;
    this.topLine = {y: 102};
    this.deadRow = 9;

    list = levels[this.level].board;
    this.meter = new Meter(levels[this.level].meterOptions);
    this.meter.setGame(this);

    this.snoodCount = list.length;

    for (var i = 0; i < list.length; i++) {
      var coords = this.coords(list[i].loc, 30);
      var center = {x: coords[0], y: coords[1]};
      var options = {
        trajectory: null,
        radius: 30,
        center: center,
        velocity: 0,
        color: list[i].color
      }
      this.snoods[list[i].loc] = new Projectile(options);
    }

    this.state = "displayLevel";
  };

  Game.prototype.detectMatchingRegion = function(snoodKey) {
    var color = this.snoods[snoodKey].getColor();
    var keysToProcess = [snoodKey];
    var result = [];
    var visitedKeys = {};
    while (keysToProcess.length !== 0) {
      var nextKey = keysToProcess.shift();
      if (this.snoods[nextKey].getColor() === color && visitedKeys[nextKey] === undefined) {
        result.push(nextKey);
        var offsets = [[-1, -1], [-1, 1], [0, -2], [0, 2], [1, -1], [1, 1]];
        offsets.forEach(function(offset) {
          var r = nextKey[0];
          var c = nextKey[1];
          var possibleKey = [r + offset[0], c + offset[1]];
          if (this.snoods[possibleKey] !== undefined) {
            if (visitedKeys[possibleKey] === undefined && r > -1 && c > -1 && c < 22) {
              keysToProcess.push(possibleKey);
            }
          }
        }.bind(this));

      }
      visitedKeys[nextKey] = true;
    }
    return result;
  };

  Game.prototype.detectFallingRegion = function() {
    var keysToProcess = [];
    var safeRegion = {};
    var visitedKeys = {};
    for (var i = 0; i < 30; i += 2) {
      if (this.snoods[[0, i]] !== undefined) {
        keysToProcess.push([0, i]);
      }
    }
    while (keysToProcess.length !== 0) {
      var nextKey = keysToProcess.shift();
      safeRegion[nextKey] = true;
      var offsets = [[-1, -1], [-1, 1], [0, -2], [0, 2], [1, -1], [1, 1]];
      for (var i = 0; i < offsets.length; i++) {
        var offset = offsets[i];
        var r = nextKey[0];
        var c = nextKey[1];
        var possibleKey = [r + offset[0], c + offset[1]];
        if (this.snoods[possibleKey] !== undefined && visitedKeys[possibleKey] === undefined) {
          if (visitedKeys[possibleKey] === undefined) {
            keysToProcess.push(possibleKey);
          }
        }
      };
      visitedKeys[nextKey] = true;
    }
    var fallingRegion = [];
    for (var snoodKey in this.snoods) {
      if (this.snoods.hasOwnProperty(snoodKey)) {
        if (safeRegion[snoodKey] === undefined) {
          fallingRegion.push(snoodKey);
        }
      }
    }
    return fallingRegion;
  };

  Game.prototype.coords = function(pair, radius) {
    var r = pair[0];
    var c = pair[1];
    var x = radius + this.leftWallX + c * radius
    var y = radius + this.topLine.y + (Math.sqrt(3)) * radius * r
    return [x, y];
  };

  Game.prototype.rowColumn = function(pair, radius) {
    var x = pair[0];
    var y = pair[1];

    var yPlusMargin = y + radius * Math.sqrt(3) / 2;
    var yPlusMarginDistanceToZeroRow = yPlusMargin - (this.topLine.y + radius);
    var r = Math.floor(yPlusMarginDistanceToZeroRow / (radius * Math.sqrt(3)));

    var xPlusMargin = x + radius;
    if (r % 2 === 0) {

      var xPlusMarginDistanceToZeroCol = xPlusMargin - (this.leftWallX + radius);
      var c = 2 * Math.floor(xPlusMarginDistanceToZeroCol / (2 * radius));

    } else {

      var xPlusMarginDistanceToOneCol = xPlusMargin - (this.leftWallX + 2 * radius);
      var c = 2 * Math.floor(xPlusMarginDistanceToOneCol / (2 * radius)) + 1;

    }
    return [r, c];
  };

  Game.prototype.handleCollisions = function() {
    if (this.movingSnood !== null) {
      var x = this.movingSnood.center.x;
      var y = this.movingSnood.center.y;
      var r = this.movingSnood.radius;
      var rowColumn = this.rowColumn([x, y], r);
      var snap = false;


      if (this.movingSnood.center.x - this.leftWallX < this.movingSnood.radius) {
        this.movingSnood.updateTrajectoryOnWallHit();
      }

      if (this.rightWallX - this.movingSnood.center.x < this.movingSnood.radius) {
        this.movingSnood.updateTrajectoryOnWallHit();
      }

      if (this.movingSnood.center.y - this.topLine.y < this.movingSnood.radius) {
        snap = true;
      } else {
        if (this.snoods[rowColumn] === undefined && rowColumn[1] > -1 && rowColumn[1] < 22) {
          var offsets = [[-1, -1], [-1, 1], [0, -2], [0, 2], [1, -1], [1, 1]];
          offsets.forEach(function(offset) {
            var r = rowColumn[0];
            var c = rowColumn[1];
            var possibleKey = [r + offset[0], c + offset[1]];
            if (this.snoods[possibleKey] !== undefined) {
              var x1 = x;
              var y1 = y;
              var x2 = this.snoods[possibleKey].center.x;
              var y2 = this.snoods[possibleKey].center.y;
              var d = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
              if (d <= 2.0 * this.snoods[possibleKey].radius) {
                snap = true;
              }
            }
          }.bind(this));
        }
      }

      if (snap) {
        var coords = this.coords(rowColumn, r);
        var newCenter = {x: coords[0], y: coords[1]};
        this.movingSnood.move(newCenter);
        this.movingSnood.velocity = 0;
        this.movingSnood.velVector = {x: 0, y: 0};
        this.snoods[rowColumn] = this.movingSnood.copy();
        this.movingSnood = null;
        var matchingRegion = this.detectMatchingRegion(rowColumn);
        var fallingRegion = [];
        if (matchingRegion.length >= 3) {
          for(var i = 0; i < matchingRegion.length; i++) {
            delete this.snoods[matchingRegion[i]];
          }
          this.snoodCount -= (matchingRegion.length - 1);

          var fallingRegion = this.detectFallingRegion();
          for(var i = 0; i < fallingRegion.length; i++) {
            this.snoods[fallingRegion[i]].velVector = {x: 0, y: -1};
            this.snoods[fallingRegion[i]].velocity = 1;
            var copy = this.snoods[fallingRegion[i]].copy();
            this.fallingSnoods[fallingRegion[i]] = copy;
            delete this.snoods[fallingRegion[i]];
          }
        } else {
          this.snoodCount += 1;
        }
        this.nextSnood = this.launcher.getNextSnood();
        var bool = this.meter.update(fallingRegion.length + (matchingRegion.length >= 3 ? matchingRegion.length : 0));
        if (bool) {
          this.moveDown();
        }
        this.checkGameOver();
      }
    }
  };

  Game.prototype.displayGameOver = function(ctx) {
    for (var snoodKey in this.snoods) {
      if (this.snoods.hasOwnProperty(snoodKey)) {
        this.snoods[snoodKey].setColor("#000000");
        key.unbind('a');
      }
    }

    this.renderableObjects.forEach(function(renderableObject){
      renderableObject.render(ctx);
    }.bind(this));

    for (var snoodKey in this.snoods) {
      if (this.snoods.hasOwnProperty(snoodKey)) {
        this.snoods[snoodKey].render(ctx);
      }
    }

    ctx.beginPath();

    ctx.rect(
      this.leftWallX + 10,
      this.yDim - this.deadLineY,
      this.rightWallX - this.leftWallX - 20,
      2 * (this.yDim - this.deadLineY)
    );

    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "White";
    ctx.font = "bold 40px Arial";
    ctx.fillText("Game Over!", this.leftWallX + 250, this.topLine.y + 150);

    ctx.fillStyle = "White";
    ctx.font = "bold 20px Arial";
    ctx.fillText("Press Enter to play again!", this.leftWallX + 240, this.topLine.y + 225);

    key('enter', function() {
      key.unbind('enter');
      this.state = "displayStartScreen";
    }.bind(this));
  };

  Game.prototype.checkGameOver = function() {
    for (var snoodKey in this.snoods) {
      if (this.snoods.hasOwnProperty(snoodKey)) {
        var row = parseInt(snoodKey.split(',')[0]);
        if (row >= this.deadRow) {
          this.state = "displayGameOver";
          return;
        }
      }
    }
  };

  Game.prototype.moveDown = function() {
    var verticalDistance = Math.sqrt(3) * 30;
    this.topLine.y += verticalDistance;
    for (var snoodKey in this.snoods) {
      if (this.snoods.hasOwnProperty(snoodKey)) {
        var snood = this.snoods[snoodKey];
        snood.center.y += verticalDistance;
        snood.circle.centerY += verticalDistance;
      }
    }
    this.deadRow -= 1;
  };

  Game.prototype.addWalls = function() {
    var width = 690;
    this.leftWallX = (this.xDim - width) / 2;
    this.rightWallX = (this.xDim + width) / 2;

    var leftWall = {};
    leftWall.render = function(ctx) {
      ctx.beginPath();
      ctx.moveTo(this.leftWallX,0);
      ctx.lineTo(this.leftWallX,this.yDim);
      ctx.stroke();
    }.bind(this);
    this.renderableObjects.push(leftWall);

    var rightWall = {};
    rightWall.render = function(ctx) {
      ctx.beginPath();
      ctx.moveTo(this.rightWallX, 0);
      ctx.lineTo(this.rightWallX, this.yDim);
      ctx.stroke();
    }.bind(this);
    this.renderableObjects.push(rightWall);
  }

  Game.prototype.addDeadLine = function() {
    // warning: needs this.leftWallX and this.rightWallX defined.
    this.deadLineY = this.yDim - 150;
    var deadLine = {};
    deadLine.render = function(ctx) {
      ctx.beginPath();
      ctx.moveTo(this.leftWallX, this.deadLineY);
      ctx.lineTo(this.rightWallX, this.deadLineY);
      ctx.stroke();
    }.bind(this);
    this.renderableObjects.push(deadLine);
  }

  Game.prototype.addTopLine = function() {
    this.topLine = {y: 102};
    //var y = this.topLine.y;
    this.topLine.render = function(ctx) {
      ctx.beginPath();
      ctx.moveTo(this.leftWallX, this.topLine.y);
      ctx.lineTo(this.rightWallX, this.topLine.y);
      ctx.stroke();
    }.bind(this);
    this.renderableObjects.push(this.topLine);
  }

  Game.prototype.dimensions = function() {
    return [this.xDim, this.yDim];
  };

  Game.prototype.addProjectile = function(projectile) {
    if (this.movingSnood === null) {
      this.movingSnood = projectile;
      this.renderableObjects.push(projectile);
    }
  };

  Game.prototype.start = function (canvasEl) {
    canvasEl.addEventListener('mousemove', function(evt) {
      this.mouseX = evt.clientX;
      this.mouseY = evt.clientY;
    }.bind(this), false);
    var ctx = canvasEl.getContext("2d");
    //this.bindKeyHandlers();
    var animateCallback = function() {
      this.render(ctx);
      requestAnimationFrame(animateCallback);
    }.bind(this);
    animateCallback();
  };

  Game.prototype.displayLevel = function(ctx) {
    if (this.snoodCount === 0) {
      this.state = "displayBetweenLevel";
    };

    if (this.movingSnood !== null) {
      this.movingSnood.move();
      this.movingSnood.render(ctx);
    };

    for (var fallingSnood in this.fallingSnoods) {
      if (this.fallingSnoods.hasOwnProperty(fallingSnood)) {
        if (this.fallingSnoods[fallingSnood].circle.centerY > this.yDim) {
          delete this.fallingSnoods[fallingSnood];
          this.snoodCount -= 1;
        } else {
          this.fallingSnoods[fallingSnood].move();
          this.fallingSnoods[fallingSnood].render(ctx);
        }
      }
    }

    this.handleCollisions();

    this.renderableObjects.forEach(function(renderableObject){
      renderableObject.render(ctx);
    }.bind(this));

    this.meter.render(ctx);

    this.launcher.render(ctx, this.mouseX, this.mouseY);

    if (this.nextSnood !== null) {
      this.nextSnood.render(ctx);
    };

    for (var key in this.snoods) {
      if (this.snoods.hasOwnProperty(key)) {
        this.snoods[key].render(ctx);
      }
    }
  };

  Game.prototype.bindKeyHandlers = function() {
    key('1', function() {
      if (this.nextSnood !== null) {
        this.nextSnood.setColor(Projectile.colors.red);
      }
    }.bind(this));

    key('2', function() {
      if (this.nextSnood !== null) {
        this.nextSnood.setColor(Projectile.colors.green);
      }
    }.bind(this));

    key('3', function() {
      if (this.nextSnood !== null) {
        this.nextSnood.setColor(Projectile.colors.blue);
      }
    }.bind(this));

    key('4', function() {
      if (this.nextSnood !== null) {
        this.nextSnood.setColor(Projectile.colors.aqua);
      }
    }.bind(this));

    key('5', function() {
      if (this.nextSnood !== null) {
        this.nextSnood.setColor(Projectile.colors.orange);
      }
    }.bind(this));

    key('6', function() {
      if (this.nextSnood !== null) {
        this.nextSnood.setColor(Projectile.colors.purple);
      }
    }.bind(this));
  }

  window.Game = Game;

})();
