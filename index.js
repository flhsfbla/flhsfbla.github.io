var width = 800;
var height = 200;
var canvas = document.getElementById("canvas");
var width = canvas.width;
var height = canvas.height;
var ctx = canvas.getContext("2d");
ctx.fillStyle = "purple";
var pWidth = 10;
var pHeight = 10;
var fallSpeed = 0;
var isGround = false;

var playerState = {
    x: 20,
    y: height / 2,
    pressedKeys: {
        left: false,
        right: false,
        up: false,
        down: false
    }
}

var keyMap = {
    68: 'right',
    65: 'left',
    87: 'up',
    83: 'down',
    39: 'right',
    37: 'left',
    38: 'up',
    40: 'down',
    32: 'up'

}

function keydown(event){
    var key = keyMap[event.keyCode];
    playerState.pressedKeys[key] = true;
}

function keyup(event){
    var key = keyMap[event.keyCode];
    playerState.pressedKeys[key] = false;
}

window.addEventListener("keydown", keydown, false);
window.addEventListener("keyup", keyup, false);

function draw(){
    ctx.clearRect(0, 0, width, height);

    ctx.fillRect(playerState.x - 5, playerState.y - 5, pWidth, pHeight);
}

function update(progress){
    //player update and movement
    let p = progress / 10;
    if(playerState.pressedKeys.left){
        playerState.x -= p;
    }
    if(playerState.pressedKeys.right){
        playerState.x += p;
    }
    if(playerState.pressedKeys.up && isGround){
        fallSpeed = -4;
        isGround = false;
    }
    if(playerState.pressedKeys.down){
        playerState.y += p;
    }
    if (playerState.x > width - pWidth/2) {
        playerState.x = width - pWidth/2;
      }
      else if (playerState.x < 0 + pWidth/2) {
        playerState.x = 0 + pWidth/2;
      }
      if (playerState.y > height - pHeight/2) {
        playerState.y = height - pHeight/2;
        isGround = true;
      }
      else if (playerState.y < 0 + pHeight/2) {
        playerState.y = 0 + pHeight/2;
      }
    if(!isGround){
        playerState.y += fallSpeed;
        fallSpeed += 0.1;
    }
    else if(fallSpeed > 0){
        fallSpeed = 0;
    }
}

function loop(timestamp){
    var progress = timestamp - lastRender;
    
    update(progress);
    draw();
    lastRender = timestamp;
    window.requestAnimationFrame(loop);
}
var lastRender = 0;
window.requestAnimationFrame(loop);
