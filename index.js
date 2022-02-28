var width = 800;
var height = 200;
var canvas = document.getElementById("canvas");
var width = canvas.width;
var height = canvas.height;
var ctx = canvas.getContext("2d");
ctx.fillStyle = "purple";

var fallSpeed = 0;
var isGround = false;

var velocity = 1;

var playerState = {
    x: 20,
    y: height / 2,
    width: 10,
    height: 10,
    pressedKeys: {
        left: false,
        right: false,
        up: false,
        down: false
    }
}

var block1 = {
    x: width,
    y: height - 12,
    width: 10,
    height: 24,
    draw: function(){
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
    }
}
var block2 = {
    x: width + 100,
    y: height - 12,
    width: 10,
    height: 24,
    draw: function(){
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
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
    32: 'up',
    82: 'r'

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

    ctx.fillRect(playerState.x - 5, playerState.y - 5, playerState.width, playerState.height);
    block1.draw();
    block2.draw();
}



function update(progress){
    //player update and movement
    let p = velocity;
    /*if(playerState.pressedKeys.left){
        playerState.x -= p;
    }
    if(playerState.pressedKeys.right){
        playerState.x += p;
    }
    */
    if(playerState.pressedKeys.up && isGround){
        fallSpeed = -3;
        isGround = false;
    }
    /*if(playerState.pressedKeys.down){
        playerState.y += p;
    }
    */
   //keep in bounds
    if (playerState.x > width - playerState.width/2) {
        playerState.x = width - playerState.width/2;
      }
      else if (playerState.x < 0 + playerState.width/2) {
        playerState.x = 0 + playerState.width/2;
      }
      if (playerState.y > height - playerState.height/2) {
        playerState.y = height - playerState.height/2;
        isGround = true;
      }
      else if (playerState.y < 0 + playerState.height/2) {
        playerState.y = 0 + playerState.height/2;
      }
    //falling
    if(!isGround){
        playerState.y += fallSpeed;
        fallSpeed += 0.1;
    }
    else if(fallSpeed > 0){
        fallSpeed = 0;
    }
    //block movement
    block1.x -= p;
    if(block1.x < 0 + block1.width/2){
        respawnBlock(block1);
    }
    if(block1.y > height - block1.height / 2){
        block1.y = height - block1.height / 2;
    }
    block2.x -= p;
    if(block2.x < 0 + block2.width/2){
        respawnBlock(block2);
    }
    if(block2.y > height - block2.height / 2){
        block2.y = height - block2.height / 2;
    }
    //collisions
    if(collide(block1, playerState)){
        end();
    }
    if(collide(block2, playerState)){
        end();
    }
    //restart
    if(playerState.pressedKeys.r){
        reset();
    }
}

function end(){
    velocity = 0;
}

function reset(){
    velocity = 1;
    block1.x = width;
    block1.y = height - 12;
    block2.x = width + 100;
    block2.y = height - 12;
    playerState.y = height/2;
    isGround = false;
    fallSpeed = 0;
}

function collide(obj1, player){
    //x - width, x + width
    //y - height, y + height
    //up left(x -width/2, y - height/2)
    //bottom left(x - width/2, y + height/2)
    //up right(x + widht/2. y - height/2)
    //bottom right(x + width/2, y + height/2)
    if(pointInObj(player.x - player.width/2, player.y-player.height/2, obj1)){
        return true;
    }
    if(pointInObj(player.x - player.width/2, player.y + player.height/2, obj1)){
        return true;
    }
    if(pointInObj(player.x + player.width/2, player.y - player.height/2, obj1)){
        return true;
    }
    if(pointInObj(player.x + player.width/2, player.y + player.height/2, obj1)){
        return true;
    }
    return false;
}

function pointInObj(x, y, obj){
    if(x >= obj.x - obj.width/2 && x <= obj.x+obj.width/2){
        if(y >= obj.y - obj.height/2 && y <= obj.y+obj.height/2){
            return true;
        }
    }
    return false;
}

function respawnBlock(block){
    var rand = Math.floor(Math.random()*150);
    block.x = width + rand + block.width;
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
