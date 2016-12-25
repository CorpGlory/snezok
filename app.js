// DO YOU LIKE
// creative coding?
// go http://corpglory.com/join

Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
}

var width, height;
var scale = 1;
var colours = {
  background: '#111'
};

var canvas = $('#render').get()[0];
var ctx = canvas.getContext('2d');
var particles = Array(3500);

var GRect = function() {
  var api = {
    touch: touch,
    render: render
  }

  function touch(particle, pos) {
    return GeometryBitmap.getFill(pos.x, pos.y);
  }

  function render(ctx) {
    ctx.rect(x,y,width,height);
    //ctx.strokeStyle = '#ff0000';
    ctx.strokeStyle = 'rgba(150,150,150,1)';
    ctx.stroke();
  }

  return api;
}

var EditCursor = {}
EditCursor._localTime = 0;
EditCursor._opacity = 0;
EditCursor.update = function(time) {
  EditCursor._localTime += (time % Math.PI) / 30;
  if(EditCursor._localTime > Math.PI) {
    EditCursor._localTime -= Math.PI;
  }
  EditCursor._opacity = 0.3 + Math.abs(Math.sin(EditCursor._localTime));
}

EditCursor.render = function(ctx) {
  var pos = GeometryBitmap.getLastPosition();
  var w = 2;
  var h = GeometryBitmap.FONT_SIZE;
  var y = pos[1] - h/2 + h * 0.1;
  ctx.fillStyle = 'rgba(150,150,150,' + EditCursor._opacity + ')';
  ctx.fillRect(pos[0], y, w, h);
}

GeometryBitmap.init();
function resize() {
  width = canvas.width = window.innerWidth * scale;
  height = canvas.height = window.innerHeight * scale;
  GeometryBitmap.resize(width, height);
  if(particles[0]) {
    _.each(particles, function(p) {
      p.resize();
    })
  }

}
resize();
window.addEventListener('resize', resize);
GeometryBitmap.setText(TEXT);



//var grect = new GRect(width / 4, height / 4, width / 2, height / 2);

var Particle = function(ctx) {

  var pos = {
    x: Math.random() * width,
    y: Math.random() * height,
    z: Math.random()
  };

  var api = {
    update: update,
    touch: touch,
    resize: resize
  }

  var angleLerp = .025 + Math.random() * .05;
  var angleBase = Math.PI*.5;
  var angle = angleBase;
  var angleModifier = Math.random() > .5 ? - Math.random() - .5 : Math.random() + .5;

  var timeModifier = Math.random();

  var speedBase = Particle.MIN_SPEED + Particle.MAX_SPEED * pos.z;
  var speed = speedBase;

  var size = Particle.MIN_SIZE + Particle.MAX_SIZE * pos.z;
  var touched = false;
  var speedModityRadius = Particle.SPEED_MODIFY_RADIUS;

  function resize() {
    var ss = Math.min(canvas.width, canvas.height) / 1000;
    size = Particle.MIN_SIZE + Particle.MAX_SIZE * pos.z * ss;
    speedBase = Particle.MIN_SPEED + Particle.MAX_SPEED * pos.z * ss;
    speedModityRadius = Particle.SPEED_MODIFY_RADIUS * ss;
  }
  resize();

  // g object is something which can change my speed
  function touch(gobject) {
    touched = gobject.touch(this, pos);
  }

  function update(time) {

    // Update
    var d = distanceBetween(pos, mouse);
    var a = angleBetween(pos, mouse);

    if(touched) {
      speed = 0;
    }


    if (d < speedModityRadius) {
      var speedEffect = (1 - d / speedModityRadius);
      speedEffect *= (1 + mouse.speedValue) * 0.02;

      if(touched) {
        speedEffect *= 30;
      }
      //speedEffect = 0;

      speed += speedEffect;
      angle -= angleModifier * size * mouse.speedValue * 0.02;
    }


    speed += (speedBase - speed) * .03;

    angle += (angleBase - angle) * angleLerp;

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

  }

  return api;

}

Particle.MIN_SPEED = .1 * scale;
Particle.MAX_SPEED = 5 * scale;
Particle.MIN_SIZE = .6 * scale;
Particle.MAX_SIZE = 2 * scale;
Particle.SPEED_MODIFY_RADIUS = 250;

var particles = _.map(particles, function() {
  return new Particle(ctx);
});


// Per frame updates
update();

var grect = new GRect();
function update(time) {

  if (time !== undefined) {

    // Clear canvas

    ctx.clearRect(0, 0, width, height);

    // Update particles

    _.each(particles, function(p, i) {
      p.touch(grect);
      p.update(time);
    });



    //grect.render(ctx);

    if(EDIT_MODE) {
      EditCursor.update(time);
      EditCursor.render(ctx);
    }

    updateMouse();

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
  speedValue: 0,
  health: 0
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

document.ontouchmove = function(e) {
  if(e.touches.length == 1){ // Only deal with one finger
    var touch = e.touches[0]; // Get the information for finger #1
    mouseMoveHandler({
      x:touch.pageX, y: touch.pageY
    })
  }
  e.preventDefault();
}

function updateMouse(time) {

  mouse.speedTarget *= .95;
  if(mouse.speedTarget < 0.1) {
    mouse.speedTarget = 0;
  }
  mouse.speedCurrent += (mouse.speedTarget - mouse.speedCurrent) * 0.9;
  mouse.speedValue = mouse.speedCurrent < 5 ? mouse.speedCurrent / 5 : 5;
}

function distanceBetween(a, b) {
  var x = a.x - b.x;
  var y = a.y - b.y;
  return Math.sqrt(x*x + y*y);
}

function angleBetween(a, b) {
  return Math.atan2(a.y-b.y, a.x-b.x);
}

if(EDIT_MODE) {
  TextInput.init();
} else {
  $('.viewFooter').show();
}

function gotoEdit() {
  window.location = '#/edit/' + strEncode(TEXT);
  window.location.reload(true);
}
