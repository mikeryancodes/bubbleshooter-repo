(function(){
  if (typeof Snood === "undefined") {
    window.Snood = {};
  }

  var Launcher = Snood.Launcher = function(game) {
    this.game = game;
    this.angle = 90;
    this.launcherBaseCenter = {x: (canvasEl.width / 2), y: (canvasEl.height - 80)};
    this.launcherBaseRadius = 60;
    this.barrelRadius = 30;
    this.baseOfLauncher = new Circle(this.launcherBaseCenter.x, this.launcherBaseCenter.y, this.launcherBaseRadius, "#999999");

    this.barrelCircles = [];
    for (var i=0; i<4; i++) {
      this.barrelCircles.push(new Circle(this.baseOfLauncher.centerX, this.baseOfLauncher.centerY - (this.launcherBaseRadius + i * this.barrelRadius * 1.8), this.barrelRadius, "#CCCCCC"));
    }
  }

  Launcher.prototype.render = function(ctx, mouseX, mouseY) {
    var deltaX = mouseX - this.launcherBaseCenter.x;

    if (deltaX < 0 && deltaX < (250 * Math.cos(179 * 3.14159 / 180))) {
      deltaX = 250 * Math.cos(179 * 3.14159 / 180)
    }

    if (deltaX > 0 && deltaX > (250 * Math.cos(1 * 3.14159 / 180))) {
      deltaX = 250 * Math.cos(1 * 3.14159 / 180)
    }

    this.angle = Math.acos(deltaX / 250) * 180 / 3.14159;

    this.baseOfLauncher.render(ctx);
    this.updateBarrelCircles(this.angle);
    this.barrelCircles.forEach(function(barrelCircle){
      barrelCircle.render(ctx);
    });
  }

  Launcher.prototype.updateBarrelCircles = function(newDegrees) {
    var newRadians = this.angle * 3.14159 / 180;
    var x0 = this.launcherBaseCenter.x + this.launcherBaseRadius * Math.cos(newRadians);
    var y0 = this.launcherBaseCenter.y - this.launcherBaseRadius * Math.sin(newRadians);
    for(var i=0; i < 4; i++) {
      this.barrelCircles[i].centerX = x0 + (this.launcherBaseRadius * i * Math.cos(newRadians) * 0.9);
      this.barrelCircles[i].centerY = y0 - (this.launcherBaseRadius * i * Math.sin(newRadians) * 0.9);
    }
  }

  Launcher.prototype.rotate = function(degrees) {
    // var newDegrees = this.angle + degrees;
    // if (newDegrees > 180) {
    //   newDegrees = 180;
    // }
    // if (newDegrees < 0) {
    //   newDegrees = 0;
    // }
    // this.angle = newDegrees;
    // this.updateBarrelCircles(newDegrees);
  }

  Launcher.prototype.getNextSnood = function() {
    var colors = [];
    for (var color in Projectile.colors) {
      if (Projectile.colors.hasOwnProperty(color)) {
        colors.push(Projectile.colors[color]);
      }
    }
    var color = colors[Math.floor(Math.random() * colors.length)]
    return new Projectile({
      trajectory: null,
      radius: 30,
      color: color,
      center: {x: this.launcherBaseCenter.x, y: this.launcherBaseCenter.y},
      velVector: [0, 0],
      velocity: 0
    });
  }

  Launcher.prototype.fire = function() {
    var radians = this.angle * 3.14159 / 180;
    var velVector = {
      x: Math.cos(radians),
      y: Math.sin(radians)
    };

    if (this.game.nextSnood !== null) {
      this.game.nextSnood.velVector = velVector;
      this.game.nextSnood.velocity = 1;
      this.game.movingSnood = this.game.nextSnood.copy();
      this.game.nextSnood = null;
    }
    //debugger;
    // options = {
    //   trajectory: this.angle,
    //   color: Projectile.colors.green,
    //   center: {x: this.barrelCircles[3].centerX, y: this.barrelCircles[3].centerY},
    //   radius: this.barrelRadius,
    //   velVector: velVector
    // };
    // var newProjectile = new Snood.Projectile(options);
    // this.game.addProjectile(newProjectile);
  }

  window.Launcher = Launcher;

})();
