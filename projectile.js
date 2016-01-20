(function(){
  if (typeof Snood === "undefined") {
    window.Snood = {};
  };

  var Projectile = window.Projectile = Snood.Projectile = function(options) {
    this.trajectory = options.trajectory;
    this.radius = options.radius;
    this.center = options.center;
    this.circle = new Circle(options.center.x, options.center.y, options.radius, options.color);
    this.velocity = 20;

    this.velVector = options.velVector;
  };

  Projectile.colors = {
      red: "#FF0000",
      green: "#008000",
      aqua: "#00FFFF",
      blue: "#0000FF",
      purple: "#800080",
      orange: "#FFA500"
  };

  Projectile.prototype.copy = function() {
    options = {
      radius: this.radius,
      center: this.center,
      circle: this.circle,
      velocity: this.velocity,
      velVector: this.velVector
    };
    var copy = new Projectile(options);
    copy.setColor(this.circle.color);
    return copy;
  };

  Projectile.prototype.setColor = function(color) {
    this.circle.color = color;
  };

  Projectile.prototype.getColor = function() {
    return this.circle.color;
  };

  Projectile.prototype.move = function(newCenter) {
    if (newCenter !== undefined) {
      this.circle.centerX = newCenter.x;
      this.center.x = newCenter.x;
      this.circle.centerY = newCenter.y;
      this.center.y = newCenter.y;
    } else {
      if (this.velocity !== 0) {
        this.circle.centerX += this.velVector.x * this.velocity;
        this.center.x += this.velVector.x * this.velocity;

        this.circle.centerY -= this.velVector.y * this.velocity;
        this.center.y -= this.velVector.y * this.velocity;
      }
    }
  };

  Projectile.prototype.updateTrajectoryOnWallHit = function() {
    this.velVector.x *= -1;
  };

  Projectile.prototype.render = function(ctx) {
    this.circle.render(ctx);
  };
})();
