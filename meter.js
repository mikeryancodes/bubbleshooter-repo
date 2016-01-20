(function () {
  if (typeof Snood === "undefined") {
    window.Snood = {};
  }

  var Meter = Snood.Meter = function (options) {
    this.meterLevel = 0;   // goes from 0 to 60;
    this.turn = 0;         //
    this.accSnoods = 0;    // how many accumulated snoods there are for the current increment

    this.turnMax = options.turnMax;      // number of turns before meter increments
    this.snoodsForInc = options.snoodsForInc; // number of snoods that have to be cleared every turnMax turns before the meter increments
    this.meterInc = options.meterInc;    // how much the meter increments
  };

  Meter.prototype.setGame = function(game) {
    this.game = game;
  }

  Meter.prototype.update = function(numberOfSnoods) {
    this.accSnoods += numberOfSnoods;
    var snoodGroups = Math.floor(this.accSnoods / this.snoodsForInc + 0.5);
    if (snoodGroups === 0) {
      this.turn += 1;
      if (this.turn === this.turnMax) {
        this.meterLevel += this.meterInc;
        this.turn = 0;
        if (this.meterLevel === 60) {
          this.turn = 0;
          this.accSnoods = 0;
          this.meterLevel = 0;
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      if (snoodGroups === 1) {
        this.turn = 0;
        this.accSnoods = 0;
        this.meterLevel = 0;  // ***
        return false;
      } else {
        this.meterLevel = 0; // ***
        // this.meterLevel -= (snoodGroups - 1) * this.meterInc;
        // if (this.meterLevel < 0) {
        //   this.meterLevel = 0;
        // }
        this.turn = 0;
        this.accSnoods = 0;
        return false;
      }
    }
  };

  Meter.prototype.render = function(ctx) {
    ctx.beginPath();

    ctx.rect(this.game.rightWallX + 40, this.game.yDim  / 2, 40, 300);
    //left, top, right, bottom

    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.stroke();

    ctx.beginPath()
    ctx.rect(this.game.rightWallX + 42, this.game.yDim / 2 + 300 - (300 * this.meterLevel / 60), 36, (300 * this.meterLevel / 60));
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.stroke();
  };

  window.Meter = Meter;
})();
