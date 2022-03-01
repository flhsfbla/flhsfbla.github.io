
var width = 800;
var height = 200;
var canvas = document.getElementById("canvas");
var width = canvas.width;
var height = canvas.height;
var ctx = canvas.getContext("2d");

var fallSpeed = 0;
var isGround = false;

var velocity = 1.5;
var score= 10;
var actScore = 0;
var highScore = 0;

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
//create blocks
class Block {
    constructor(x, width) {
        this.x = x;
        this.y = height - 12;
        this.width = width;
        this.height = 24;
    }
    draw(){
        ctx.fillStyle = "purple";
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
    }
}

const blocks = [];
for(let i = 0; i < 4; i++){
    blocks[i] = new Block(width + i*100, 10);
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
    ctx.fillStyle = "purple";
    ctx.fillRect(playerState.x - 5, playerState.y - 5, playerState.width, playerState.height);
    for(let i = 0; i< blocks.length; i++){
        blocks[i].draw();
    }
    //score
    ctx.fillStyle = "black";
    ctx.font = "italic bold 10pt Tahoma";
    ctx.fillText("Score: " + score, 0, 15);
    ctx.fillText("Highscore: " + highScore, 0, 35);

}

function update(progress){
    //player update and movement
    let p = velocity;
    velocity += .0001;
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
    //block movement and collisions
    for(let i = 0; i < blocks.length; i++){
        blocks[i].x -= p;
        if(blocks[i].x < 0 - blocks[i].width/2){
            respawnBlock(blocks[i]);
        }
        if(collide(blocks[i], playerState)){
            end();
        }
    }
    //restart
    if(playerState.pressedKeys.r){
        reset();
    }
    //score
    actScore += p;
    score = Math.round(actScore / 10);
}

function end(){
    velocity = 0;
    fallSpeed = 0;
    isGround = false;
    if(score > highScore){
        highScore = score;
    }
}

function reset(){
    velocity = 1.5;
    for(let i = 0; i < blocks.length; i++){
        blocks[i].x = width + i*100;
    }
    playerState.y = height/2;
    isGround = false;
    fallSpeed = 0;
    actScore = 0;
}

function collide(obj1, player){
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

