Array.prototype.random = function() {
return this[Math.floor(Math.random() * this.length)];
}

var width, height;
var scale = .8;
var colours = {
background: '#111'
};

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

resize();
window.addEventListener('resize', resize);

function resize() {
width = canvas.width = window.innerWidth * scale;
height = canvas.height = window.innerHeight * scale;
}

// Generate particles. Using a linked list. Quick as lighting ;D

var Particle = function(index, ctx) {

var api = {
  next: null,
  update: update
}

var pos = {
  x: Math.random() * width,
  y: Math.random() * height,
  z: Math.random()
};

var angleLerp = .025 + Math.random() * .05;
var angleBase = Math.PI*.5;
var angle = angleBase;
var angleModifier = Math.random() > .5 ? - Math.random() - .5 : Math.random() + .5;

var timeModifier = Math.random();

var speedBase = Particle.MIN_SPEED + Particle.MAX_SPEED * pos.z;
var speed = speedBase;

var size = Particle.MIN_SIZE + Particle.MAX_SIZE * pos.z;

function update(time) {

  // Update
  var d = distanceBetween(pos, mouse);
  var a = angleBetween(pos, mouse);
  if (d < Particle.SPEED_MODIFY_RADIUS) {
    var speedEffect = (1 - d/Particle.SPEED_MODIFY_RADIUS) * (1 + mouse.speedValue) * .5;
    speed += (speedEffect - speed) * .15;

    angle += angleModifier * size * mouse.speedValue * 0.02;
  }

  speed += (speedBase-speed) * .1;
  angle += (angleBase-angle) * angleLerp;

  var amod = angle + Math.cos(time * timeModifier * 0.001) * .25;

  pos.x += Math.cos(amod) * speed;
  pos.y += Math.sin(amod) * speed;

  // Check on stage
  if (pos.y > height + 10 || pos.x < -10 || pos.x > width + 10) {
    pos.y = -10;
    pos.x = Math.random() * width;
  }

  // Render
  ctx.fillStyle = 'white';
  ctx.fillRect(pos.x, pos.y, size, size);

  if (api.next) api.next.update(time);

}

return api;

}

Particle.MIN_SPEED = .5 * scale;
Particle.MAX_SPEED = 1 * scale;
Particle.MIN_SIZE = .5 * scale;
Particle.MAX_SIZE = 3 * scale;
Particle.SPEED_MODIFY_RADIUS = 150;

var particle = generate(5000);

function generate(count) {

var particle = new Particle(count, ctx);
particle.next = count - 1 > 0 ? generate(count - 1) : null;
return particle;

}

// Per frame updates

update();

function update(time) {

if (time !== undefined) {

  // Clear canvas

  ctx.clearRect(0, 0, width, height);

  // Update particles

  particle.update(time);

  mouse.speedTarget *= .95;
  mouse.speedCurrent += (mouse.speedTarget - mouse.speedCurrent) * .9;
  mouse.speedValue = mouse.speedCurrent < 5 ? mouse.speedCurrent / 5 : 5;

  Particle.SPEED_MODIFY_RADIUS = mouse.speedCurrent * 5;

}



requestAnimationFrame(update);

}

// Iteraction

var mouse = {
x:null,
y:null,
angle: 0,
speedTarget: 0,
speedCurrent: 0,
speedVal: 0
};

window.addEventListener('mousemove', mouseMoveHandler);

function mouseMoveHandler(event) {

event.x *= scale;
event.y *= scale;

if (mouse.x && mouse.y) {
  mouse.speedTarget = Math.min(distanceBetween(mouse, event), 20) * scale;

  mouse.angle = Math.atan2(event.y - mouse.y, event.x - mouse.x);
}

mouse.x = event.x * scale;
mouse.y = event.y * scale;
}

function distanceBetween(a, b) {
var x = a.x - b.x;
var y = a.y - b.y;
return Math.sqrt(x*x + y*y);
}

function angleBetween(a, b) {
return Math.atan2(a.y-b.y,a.x-b.x);
}
