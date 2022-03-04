var width = 800;
var height = 200;
var canvas = document.getElementById("canvas");
var width = canvas.width;
var height = canvas.height;
var ctx = canvas.getContext("2d");

var fallSpeed = 0;
var isGround = false;
var isAlive = true;

var velocity = 1.5;
var score= 10;
var actScore = 0;
var highScore = 0;

//create player
class Player{
    constructor(img){
        this.x = 20;
        this.y = height/2;
        this.width = 10;
        this.height = 10;
        this.pressedKeys = {
            left: false,
            right: false,
            up: false,
            down: false
        }
        this.img = img;
        this.i = 0;
    }
    draw(){
        //ctx.fillStyle = "purple";
        //ctx.fillRect(this.x - 5, this.y - 5, this.width, this.height);
        //ctx.drawImage(playerImg, this.x - 7, this.y - 11);
        if(this.i%30 <= 15 && isGround && velocity != 0){
            ctx.drawImage(playerImg, 765, 3, 44, 45, this.x - 11, this.y - 18, 22, 23);
        }else if(this.i&30 >= 15 && isGround && velocity != 0){
            ctx.drawImage(playerImg, 809, 3, 44, 45, this.x - 11, this.y - 18, 22, 23);
        }else if(velocity == 0){
            ctx.drawImage(playerImg, 853, 3, 44, 45, this.x - 11, this.y - 18, 22, 23);
        }else{
            ctx.drawImage(playerImg, 677, 3, 44, 45, this.x - 11, this.y - 18, 22, 23);
        }
        this.i++;
        this.i%1000;
    }
}
var player = new Player(playerImg);
var playerHead = new Player(null);
playerHead.x = player.x + 5;
playerHead.y = player.y -10;
var playerImg = new Image();
playerImg.src = '/images/offline-sprite-1x.png';
playerImg.onload = player.draw;

//create blocks
class Block {
    constructor(x, width) {
        this.x = x;
        this.y = height - 12;
        this.width = width;
        this.height = 24;
        this.onBoard = true;
        this.id = 1;
    }
    draw(){
        ctx.fillStyle = "purple";
        //ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        switch (this.id){
            case 1:
                //1 big
                ctx.drawImage(blockImg, 332, 3, 24, 46, this.x - 6, this.y - 12, 12, 24);
                this.height = 24;
                this.width = 12;
                break;
            case 2:
                //2 big
                ctx.drawImage(blockImg, 357, 3, 50, 48, this.x - 12, this.y - 12, 25, 24);
                this.height = 24;
                this.width = 25;
                break;
            case 3:
                //1 small
                ctx.drawImage(blockImg, 228, 3, 16, 34, this.x - 4, this.y - 6, 8, 17);
                this.height = 17;
                this.width = 8;
                break;
            case 4:
                //2 small
                ctx.drawImage(blockImg, 245, 3, 34, 34, this.x - 9, this.y - 6, 17, 17);
                this.height = 17;
                this.width = 17;
                break;
            case 5:
                //3 small
                ctx.drawImage(blockImg, 279, 3, 51, 34, this.x - 13, this.y - 6, 26, 17);
                this.height = 17;
                this.width = 26;
                break;
            case 6:
                //2 big 2 small
                ctx.drawImage(blockImg, 407, 3, 75, 50, this.x - 19, this.y - 13, 38, 25);
                this.height = 25;
                this.width = 38;
                break;
        }
    }
}

const blocks = [];
for(let i = 0; i < 3; i++){
    blocks[i] = new Block(width + i*100, 10);
}
var blockImg = new Image();
blockImg.src = '/images/offline-sprite-1x.png';
blockImg.onload = draw();
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
    player.pressedKeys[key] = true;
}

function keyup(event){
    var key = keyMap[event.keyCode];
    player.pressedKeys[key] = false;
}

window.addEventListener("keydown", keydown, false);
window.addEventListener("keyup", keyup, false);

function draw(){
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "purple";
    //ctx.fillRect(playerHead.x - 5, playerHead.y - 5, playerHead.width, playerHead.height);
    player.draw();
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
    if(player.pressedKeys.up && isGround){
        fallSpeed = -3;
        isGround = false;
    }
    //keep in bounds
    if (player.x > width - player.width/2) {
        player.x = width - player.width/2;
      }
      else if (player.x < 0 + player.width/2) {
        player.x = 0 + player.width/2;
      }
    if (player.y > height - player.height/2) {
        player.y = height - player.height/2;
        isGround = true;
    }
    else if (player.y < 0 + player.height/2) {
        player.y = 0 + player.height/2;
    }
    //falling
    if(!isGround){
        player.y += fallSpeed;
        playerHead.y += fallSpeed;
        fallSpeed += 0.1;
    }
    else if(fallSpeed > 0){
        fallSpeed = 0;
    }
    //block movement and collisions
    for(let i = 0; i < blocks.length; i++){
        blocks[i].x -= p;
        if(blocks[i].x < 0 - blocks[i].width/2 && blocks[i].onBoard == true){
            respawnBlock(blocks[i]);
            blocks[i].onBoard = false;
        }
        if(collide(blocks[i], player) || collide(blocks[i], playerHead)){
            end();
        }
    }
    //restart
    if(player.pressedKeys.r || (player.pressedKeys.up && isAlive == false)){
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
    var delayInMilliseconds = 50;
    setTimeout(function() {
        if(velocity == 0){
            isAlive = false;
        }
    }, delayInMilliseconds);
}

function reset(){
    velocity = 1.5;
    for(let i = 0; i < blocks.length; i++){
        blocks[i].x = width + i*100;
    }
    player.y = height/2;
    playerHead.y = player.y -10;
    isGround = false;
    fallSpeed = 0;
    actScore = 0;
    isAlive = true;
}

function collide(obj1, obj2){
    if(pointInObj(obj2.x - obj2.width/2, obj2.y-obj2.height/2, obj1)){
        return true;
    }
    if(pointInObj(obj2.x + obj2.width/2, obj2.y - obj2.height/2, obj1)){
        return true;
    }
    if(pointInObj(obj2.x - obj2.width/2, obj2.y + obj2.height/2, obj1)){
        return true;
    }
    if(pointInObj(obj2.x + obj2.width/2, obj2.y + obj2.height/2, obj1)){
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
    //block.x = width + rand + block.width;
    var randId = Math.floor(Math.random()*120);
    if(randId <= 30){
        block.id = 1;
    }else if(randId <= 60){
        block.id = 3;
    }else if(randId <= 80){
        block.id = 4;
    }else if(randId <= 100){
        block.id = 2;
    }else if(randId <= 110){
        block.id = 5;
    }else if(randId <= 120){
        block.id = 6;
    }else{
        block.id = 1;
    }
    var delayInMilliseconds = Math.floor(Math.random()*200);
    setTimeout(function() {
        block.x = width + block.width;
        block.onBoard = true;
    }, delayInMilliseconds);
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
