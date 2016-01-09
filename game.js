(function () {
  if (typeof Snood === "undefined") {
    window.Snood = {};
  }

  var Game = Snood.Game = function (xDim, yDim) {
    this.xDim = xDim;
    this.yDim = yDim;

    this.movingSnood = null;
    this.fallingSnoods = {};

    this.moveableObjects = [];
    this.renderableObjects = [];
    this.snoods = {};
    this.addWalls();
    this.addDeadLine();
    this.addTopLine();
    this.addBackGround();
    //this.testSnoods()
    this.launcher = new Snood.Launcher(this);
    this.nextSnood = this.launcher.getNextSnood();
    this.meter = new Meter({
      turnMax: 2,
      snoodsForInc: 3,
      meterInc: 20,
      game: this
    });
    this.renderableObjects.push(this.meter);
    this.renderableObjects.push(this.launcher);

    //meter management variables

    this.meterLevel = 0;   // goes from 0 to 60;
    this.turn = 0;         //
    this.turnMax = 2;      // number of turns before meter increments
    this.snoodsForInc = 3; // number of snoods that have to be cleared every turnMax turns before the meter increments
    this.meterInc = 15;    // how much the meter increments
    this.accSnoods = 0;    // how many accumulated snoods there are for the current increment
  };

  Game.prototype.manageMeter = function(snoods) {
    debugger;
    this.accSnoods += snoods;
    var snoodGroups = Math.floor(this.accSnoods / this.snoodsForInc + 0.5);
    if (snoodGroups === 0) {
      this.turn += 1;
      if (this.turn === this.turnMax) {
        this.meterLevel += this.meterInc;
        this.turn = 0;
        if (this.meterLevel === 60) {
          this.moveDown();
          this.turn = 0;
          this.accSnoods = 0;
          this.meterLevel = 0;
        }
      }
    } else {
      if (snoodGroups === 1) {
        this.turn = 0;
      } else {
        this.meterLevel -= (snoodGroups - 1) * this.meterInc;
        this.turn = 0;
        this.accSnoods = 0;
      }
    }
    debugger;
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

  Game.prototype.testSnoods = function() {
    //radius = 30
    var red = Projectile.colors.red;
    var purple = Projectile.colors.purple;
    var blue = Projectile.colors.blue;
    var aqua = Projectile.colors.aqua;
    var green = Projectile.colors.green;
    var orange = Projectile.colors.orange;

    var list = [
      {loc: [0, 0], color: purple},
      {loc: [0, 2], color: purple},
      {loc: [0, 4], color: purple},
      {loc: [0, 6], color: purple},
      {loc: [0, 8], color: purple},
      {loc: [1, 1], color: purple},
      {loc: [1, 3], color: blue},
      {loc: [1, 5], color: purple},
      {loc: [1, 7], color: aqua},
      {loc: [2, 0], color: purple},
      {loc: [2, 2], color: green},
      {loc: [2, 4], color: green},
      {loc: [2, 6], color: green},
      {loc: [3, 1], color: purple},
      {loc: [3, 3], color: green},
      {loc: [3, 5], color: aqua},
      {loc: [4, 0], color: purple},
      {loc: [4, 2], color: purple},
      {loc: [4, 4], color: red},

      {loc: [0, 12], color: orange},
      {loc: [0, 14], color: purple},
      {loc: [0, 16], color: purple},
      {loc: [0, 18], color: purple},
      {loc: [0, 20], color: purple},   // <--- This is the key!
      {loc: [1, 19], color: green},
      {loc: [1, 21], color: green},
      {loc: [1, 15], color: purple},
      {loc: [1, 17], color: purple},
      {loc: [2, 16], color: purple},
      {loc: [2, 18], color: orange},
      {loc: [2, 20], color: green}
    ]
    // var list = [
    //   [0, 0],   [0, 2],   [0, 4],   [0, 6],   [0, 8],   [0, 10],   [0, 12], [0, 14],    [0, 16],    [0, 18],    [0, 20],    [0, 22],    [0, 24],    [0, 26],
    //        [1, 1],   [1, 3],   [1, 5],   [1, 7],   [1, 9],    [1, 11],   [1, 13], [1, 15],    [1, 17],    [1, 19],    [1, 21],    [1, 23],    [1, 25],
    //   [2, 0],   [2, 2],   [2, 4],   [2, 6],   [2, 8],   [2, 10],   [2, 12], [2, 14],    [2, 16],    [2, 18],    [2, 20],    [2, 22],    [2, 24],    [2, 26],
    //        [3, 1],   [3, 3],   [3, 5],   [3, 7],   [3, 9],    [3, 11],   [3, 13], [3, 15],    [3, 17],    [3, 19],    [3, 21],    [3, 23],    [3, 25]
    // ];
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
  };

  Game.prototype.detectMatchingRegion = function(snoodKey) {
    var color = this.snoods[snoodKey].getColor();
    var keysToProcess = [snoodKey];
    var result = [];
    var visitedKeys = {};
    while (keysToProcess.length !== 0) {
      var nextKey = keysToProcess.shift();
      if (this.snoods[nextKey].getColor() === color) {
        result.push(nextKey);
        var offsets = [[-1, -1], [-1, 1], [0, -2], [0, 2], [1, -1], [1, 1]];
        offsets.forEach(function(offset) {
          var r = nextKey[0];
          var c = nextKey[1];
          var possibleKey = [r + offset[0], c + offset[1]];
          if (this.snoods[possibleKey] !== undefined) {
            if (visitedKeys[possibleKey] === undefined) {
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
        if (this.snoods[possibleKey] !== undefined) {
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
        if (this.snoods[rowColumn] === undefined) {
          // for (var snoodKey in this.snoods) {
          //   if (this.snoods.hasOwnProperty(snoodKey)) {
          //     if (!snap) {
          //       var x0 = this.snoods[snoodKey].center.x;
          //       var y0 = this.snoods[snoodKey].center.y;
          //       var d = Math.sqrt(Math.pow(x - x0, 2) + Math.pow(y - y0, 2));
          //       if (d < 2 * this.snoods[snoodKey].radius) {
          //         snap = true;
          //       }
          //     }
          //   }
          // }

          //

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
              if (d <= 2 * this.snoods[possibleKey].radius) {
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
        this.snoods[rowColumn] = this.movingSnood;
        this.movingSnood = null;
        var matchingRegion = this.detectMatchingRegion(rowColumn);
        var fallingRegion = [];
        if (matchingRegion.length >= 3) {
          for(var i = 0; i < matchingRegion.length; i++) {
            delete this.snoods[matchingRegion[i]];
          }
          var fallingRegion = this.detectFallingRegion();
          for(var i = 0; i < fallingRegion.length; i++) {
            this.snoods[fallingRegion[i]].velVector = {x: 0, y: -5};
            this.snoods[fallingRegion[i]].velocity = 1;
            this.moveableObjects.push(this.snoods[fallingRegion[i]]);
          }
        }
        this.nextSnood = this.launcher.getNextSnood();
        var bool = this.meter.update(fallingRegion.length + (matchingRegion.length >= 3 ? matchingRegion.length : 0));
        if (bool) {
          this.moveDown();
        }
      }
    }
  };

  Game.prototype.moveDown = function() {
    var verticalDistance = Math.sqrt(3) * 30;
    this.topLine.y += verticalDistance;
    //debugger;
    for (var snoodKey in this.snoods) {
      if (this.snoods.hasOwnProperty(snoodKey)) {
        var snood = this.snoods[snoodKey];
        snood.center.y += verticalDistance;
        snood.circle.centerY += verticalDistance;
      }
    }
    // for (var i = 0; i < this.snoods.length; i++) {
    //   var snood = this.snoods[i];
    //   snood.center.y += verticalDistance;
    //   snood.circle.centerY += verticalDistance;
    // }
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
    var deadLineY = this.yDim - 150;
    var deadLine = {};
    deadLine.render = function(ctx) {
      ctx.beginPath();
      ctx.moveTo(this.leftWallX, deadLineY);
      ctx.lineTo(this.rightWallX, deadLineY);
      ctx.stroke();
    }.bind(this);
    this.renderableObjects.push(deadLine);
  }

  Game.prototype.addTopLine = function() {
    this.topLine = {y: 115};
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
  }

  Game.prototype.start = function (canvasEl) {
    var ctx = canvasEl.getContext("2d");
    this.bindKeyHandlers();
    var animateCallback = function() {
      this.render(ctx);
      requestAnimationFrame(animateCallback);
    }.bind(this);
    animateCallback();
  };

  Game.prototype.render = function (ctx) {
    ctx.clearRect(0, 0, this.xDim, this.yDim);
    if (this.movingSnood !== null) {
      this.movingSnood.move();
    };

    this.moveableObjects.forEach(function(moveableObject){
      moveableObject.move();
    });

    this.handleCollisions();

    this.renderableObjects.forEach(function(renderableObject){
      renderableObject.render(ctx);
    }.bind(this));

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
    var that = this;
    var launcher = this.launcher;
    key('left', function() {launcher.rotate(1)});
    key('right', function() {launcher.rotate(-1)});
    key('a', function() {launcher.fire()});
  }

  window.Game = Game;

})();
