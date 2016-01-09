(function () {
  if (typeof Snood === "undefined") {
    window.Snood = {};
  }

  var Game = Snood.Game = function (xDim, yDim) {
    this.xDim = xDim;
    this.yDim = yDim;
    this.moveableObjects = [];
    this.renderableObjects = [];
    this.snoods = {};
    this.addWalls();
    this.addDeadLine();
    this.addTopLine();
    this.testSnoods()
    //this.nextSnood = null;
    this.launcher = new Snood.Launcher(this);
    this.renderableObjects.push(this.launcher);
  };

  Game.prototype.testSnoods = function() {
    //radius = 30
    var purple = "#a584d3";
    var blue = "#0004ff";
    var pink = "#f000ff";
    var green = "#6d7f00";
    var yellow = "#fdb058"
    var list = [
      {loc: [0, 0], color: purple},
      {loc: [0, 2], color: purple},
      {loc: [0, 4], color: purple},
      {loc: [0, 6], color: purple},
      {loc: [0, 8], color: purple},
      {loc: [1, 1], color: purple},
      {loc: [1, 3], color: purple},
      {loc: [1, 5], color: purple},
      {loc: [1, 7], color: purple},
      {loc: [2, 0], color: purple},
      {loc: [2, 2], color: green},
      {loc: [2, 4], color: green},
      {loc: [2, 6], color: green},
      {loc: [3, 1], color: purple},
      {loc: [3, 3], color: green},
      {loc: [3, 5], color: green},
      {loc: [4, 0], color: purple},
      {loc: [4, 2], color: purple},
      {loc: [4, 4], color: green}
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
      //debugger;
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
      if (this.snoods[0, i] !== undefined) {
        keysToProcess.push([0, i]);
      }
    }
    while (keysToProcess.length !== 0) {
      var nextKey = keysToProcess.shift();
      safeRegion[nextKey] = true;
      //-------------------
      var offsets = [[-1, -1], [-1, 1], [0, -2], [0, 2], [1, -1], [1, 1]];
      offsets.forEach(function(offset) {
        var r = nextKey[0];
        var c = nextKey[1];
        var possibleKey = [r + offset[0], c + offset[1]];
        if (this.snoods[possibleKey] !== undefined && this.snoods[possibleKey].getColor() != "#FF0000") {
          if (visitedKeys[possibleKey] === undefined) {
            keysToProcess.push(possibleKey);
          }
        }
      }.bind(this));
      //-------------------
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
    // var x = radius + this.leftWallX + c * radius;
    // var y = radius + this.topLine.y + (Math.sqrt(3) / 2) * r;
    //debugger;
    return ([x, y]);
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
    for (var i = 0; i < this.moveableObjects.length; i++) {
      var x = this.moveableObjects[i].center.x;
      var y = this.moveableObjects[i].center.y;
      var r = this.moveableObjects[i].radius;
      var rowColumn = this.rowColumn([x, y], r);
      var snap = false;


      if (this.moveableObjects[i].center.x - this.leftWallX < this.moveableObjects[i].radius) {
        this.moveableObjects[i].updateTrajectoryOnWallHit();
      }

      if (this.rightWallX - this.moveableObjects[i].center.x < this.moveableObjects[i].radius) {
        this.moveableObjects[i].updateTrajectoryOnWallHit();
      }

      if (this.moveableObjects[i].center.y - this.topLine.y < this.moveableObjects[i].radius) {
        snap = true;
      } else {
      //   for (var snoodKey in this.snoods) {
      //     if (this.snoods.hasOwnProperty(snoodKey)) {
      //       if (!snap) {
      //         var x0 = this.snoods[snoodKey].center.x;
      //         var y0 = this.snoods[snoodKey].center.y;
      //         var d = Math.sqrt(Math.pow(x - x0, 2) + Math.pow(y - y0, 2));
      //         if (d < 2 * this.snoods[snoodKey].radius) {
      //           snap = true;
      //         }
      //       }
      //     }
      //   }
      // }

        if (this.snoods[rowColumn] === undefined) {
          var offsets = [[-1, -1], [-1, 1], [0, -2], [0, 2], [1, -1], [1, 1]];
          offsets.forEach(function(offset) {
            var r = rowColumn[0];
            var c = rowColumn[1];
            var possibleKey = [r + offset[0], c + offset[1]];
            if (this.snoods[possibleKey] !== undefined) {
              //debugger;
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
        this.moveableObjects[i].move(newCenter);
        this.moveableObjects[i].velocity = 0;
        this.moveableObjects[i].velVector = {x: 0, y: 0};
        this.snoods[rowColumn] = this.moveableObjects[i];
        this.moveableObjects[i] = null;
        var region = this.detectMatchingRegion(rowColumn);
        if (region.length >= 3) {
          for(var i = 0; i < region.length; i++) {
            this.snoods[region[i]].setColor("#FF0000");
          }
          var fallingRegion = this.detectFallingRegion();
          for(var i = 0; i < fallingRegion.length; i++) {
            if (this.snoods[fallingRegion[i]].getColor() !== "#FF0000") {
              this.snoods[fallingRegion[i]].setColor("#0000FF");
              // this.snoods[fallingRegion[i]].velVector = {x: 0, y: -1};
              // this.snoods[fallingRegion[i]].velocity = -1;
              // this.moveableObjects.push(this.snoods[fallingRegion[i]]);
              // this.renderableObjects.push(this.snoods[fallingRegion[i]]);
              // delete this.snoods[fallingRegion[i]];
              // //debugger;
            }
          }
        }
      }
    }

    var newMoveableObjects = [];

    for(var i=0; i < this.moveableObjects.length; i++) {
      if (this.moveableObjects[i] !== null) {
        newMoveableObjects.push(this.moveableObjects[i]);
      }
    }

    this.moveableObjects = newMoveableObjects;
  }

  Game.prototype.addWalls = function() {
    var width = 1000;
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
    this.topLine = {y: 100};
    var y = this.topLine.y;
    this.topLine.render = function(ctx) {
      ctx.beginPath();
      ctx.moveTo(this.leftWallX, y);
      ctx.lineTo(this.rightWallX, y);
      ctx.stroke();
    }.bind(this);
    this.renderableObjects.push(this.topLine);
  }

  Game.prototype.dimensions = function() {
    return [this.xDim, this.yDim];
  };

  Game.prototype.addProjectile = function(projectile) {
    this.renderableObjects.push(projectile);
    this.moveableObjects.push(projectile);
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
  //this will empty the canvas
    ctx.clearRect(0, 0, this.xDim, this.yDim);
    this.moveableObjects.forEach(function(moveableObject){
      if (moveableObject.getColor !== undefined && moveableObject.getColor === "#0000FF") {
        debugger;
      }
      moveableObject.move();
    });

    this.handleCollisions();

    this.renderableObjects.forEach(function(renderableObject){
      renderableObject.render(ctx);
    }.bind(this));

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
