let canvas = document.getElementById('canvas');
ctx = canvas.getContext("2d");
let fs = require("fs");
let width = canvas.width;
let height = canvas.height;
let snakeBlock = 10;
let bigAppleBlock = 10;

let BlockWidth = width/snakeBlock;
let BlockHeight = height/snakeBlock;
let BlockWidthAppleBig = width/bigAppleBlock;
let BlockHeightAppleBig = height/bigAppleBlock;
let score = 0;
let request = require('request');
let gameover =0;
let drawBorder = function () {
  ctx.fillStyle = "Gray";
  ctx.fillRect(0,0, width, 10);
  ctx.fillRect(0,height-10, width, 10);
  ctx.fillRect(0,0,10, height);
  ctx.fillRect(width-10, 0, 10, height);
};

let drawScore = function () {
    let lis = document.getElementById("record1");
    lis.innerHTML = `Current: ${score}`;
};


//Для рекордов
function record() {
        let data = fs.readFileSync("records.txt", "utf8");
        let lis = document.getElementById("record");
        lis.innerHTML = `Best: ${data}`;
        if(score > data){
            fs.writeFileSync("records.txt", `${score}`);
        }
}



let gameOver = function () {
  clearInterval(intervalId);

    ctx.clearRect(0, 0, width, height);
    snake = {};
    apple = {};
    drawBorder();
    drawScore();

  ctx.fill();
  ctx.font = '60px Courier';
  ctx.fillStyle = 'Black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText("Game Over", width/2, height/2);
    ctx.font = '20px Courier';
  ctx.fillText("Click F5 for refresh", width/2, (height/2)+50);
    record();
    gameover = 1;
};

let circle = function (x, y, r, fillC) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    if(fillC){
        ctx.fill();
    }else{
        ctx.stroke();
    }
};

//конструктор блока
class Block{
    constructor(col, row, BlockSize){
        this.row = row;
        this.col = col;
        this.BlockSize = BlockSize;
    }

    drawSquare(color){
        let x = this.col * this.BlockSize;
        let y = this.row * this.BlockSize;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, this.BlockSize, this.BlockSize);
    }

    drawCircle(color) {
        let centerX = this.col * this.BlockSize + (this.BlockSize / 2);
        let centerY = this.row * this.BlockSize + (this.BlockSize / 2);
        ctx.fillStyle = color;
        circle(centerX, centerY, this.BlockSize/2, true);
    }
    
    equal(otherBlock){
        return this.row === otherBlock.row && this.col === otherBlock.col;
    }
}

//конструктор змеи
class Snake{
    constructor(){
        this.segments = [new Block(7,5,10),new Block(6,5,10),new Block(5,5,10)];
        this.direction = "right";
        this.nextDirection = "right";
    }

    draw(){
        for(let i =0; i < this.segments.length; i++){
            this.segments[i].drawSquare("Blue");
        }
    }

    move(){
        let head = this.segments[0];
        let newHead;
        this.direction = this.nextDirection;

        if(this.direction === "right"){
            newHead = new Block(head.col + 1, head.row, 10);
        }else if(this.direction === "down"){
            newHead = new Block(head.col, head.row+1, 10);
        }else if(this.direction === "left"){
            newHead = new Block(head.col-1, head.row, 10);
        }else if(this.direction === "up"){
            newHead = new Block(head.col, head.row-1, 10);
        }



        if(this.checkCollision(newHead)){
            gameOver();
            return;
        }
        this.segments.unshift(newHead);

        if(newHead.equal(apple.position)){
            score++;
            apple.move();
        }else{
            this.segments.pop();
        }

        for(let i = 0; i< this.segments.length-1; i++){
            if(this.segments[i].equal(apple.position)){
                score++;
                apple.move();
            }
        }
    }


    checkCollision(head){
        let leftCollision = (head.col === 0);
        let topCollision = (head.row === 0);
        let rightCollision = (head.col === BlockWidth-1 );
        let bottomCollision = (head.row === BlockHeight-1);
        let wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;
        let selfCollision = false;
        for (let i = 0; i < this.segments.length; i++) {
            if (head.equal(this.segments[i])) {
                selfCollision = true;
            }
        }
        return wallCollision || selfCollision;
    }

    setDirection(newDirection){
        if (this.direction === "up" && newDirection === "down") {
            return;
        } else if (this.direction === "right" && newDirection === "left") {
            return;
        } else if (this.direction === "down" && newDirection === "up") {
            return;
        } else if (this.direction === "left" && newDirection === "right") {
            return;
        }
        this.nextDirection = newDirection;
    }

}

// Задаем конструктор Apple (яблоко)
class Apple {
    constructor(a,b,c){
        this.c = c;
        this.position = new Block(a, b, c);
    }

    draw(){
        this.position.drawCircle("LimeGreen");
    }

    move(){
        let randomCol = Math.floor(Math.random() * (BlockWidthAppleBig - 12)) + 1;
        let randomRow = Math.floor(Math.random() * (BlockHeightAppleBig - 12)) + 1;
        this.position = new Block(randomCol, randomRow, this.c);

    }
}

//Создаем уровень сложности
let Speed = 100;
document.getElementById("Easy").style.color = 'LimeGreen';

document.getElementById("Easy").addEventListener( "click" , () =>{
    Speed=100;
    document.getElementById("Middle").style.color = 'gray';
    document.getElementById("Easy").style.color = 'LimeGreen';
    document.getElementById("Hard").style.color = 'gray';
});

document.getElementById("Middle").addEventListener( "click" , () =>{
    Speed=60;
    document.getElementById("Middle").style.color = 'LimeGreen';
    document.getElementById("Easy").style.color = 'gray';
    document.getElementById("Hard").style.color = 'gray';
});
let tmpSpeed =1;
document.getElementById("Hard").addEventListener( "click" , () =>{
    Speed=40;
    document.getElementById("Middle").style.color = 'gray';
    document.getElementById("Easy").style.color = 'gray';
    document.getElementById("Hard").style.color = 'LimeGreen';
});

let trigger = 0;
let pause = 1;
document.getElementById("start").addEventListener( "click" , () =>{
   trigger = 1;
    document.getElementById("start").disabled = true;
    document.getElementById("Easy").disabled = true;
    document.getElementById("Middle").disabled = true;
    document.getElementById("Hard").disabled = true;
    document.getElementById("start").style.color = 'Green';
});

document.getElementById("stop").addEventListener( "click" , () =>{
    pause = pause * (-1);
    trigger = trigger * (-1);
});

// Создаем объект-змейку и объект-яблоко
let snake = new Snake();
let apple = new Apple(10,10, bigAppleBlock);


// Преобразуем коды клавиш в направления
let directions = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
    116: "F5",
    65: "start"
};
// Задаем обработчик события keydown (клавиши-стрелки)
document.addEventListener("keydown", (event) => {
    let newDirection = directions[event.keyCode];
    //console.log(event);
    if (newDirection !== undefined) {

        if(gameover === 0) {
            snake.setDirection(newDirection);
        }
    }


    if(newDirection === directions[116]){
        window.location.reload();
    }



});


// Запускаем функцию анимации через setInterval
    ctx.clearRect(0, 0, width, height);
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();
    drawScore();
record(); //добавить рекорд
let myFunction = function(){
    clearInterval(intervalId);
    if (trigger === 1) {
        ctx.clearRect(0, 0, width, height);
        drawScore();
        snake.move();
        snake.draw();
        apple.draw();
        drawBorder();


    }else if (pause === -1 && trigger !==1) {
        ctx.font = '60px Courier';
        ctx.fillStyle = 'Black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText("Pause", width/2, height/2);
    }
      intervalId = setInterval(myFunction, Speed);
};
let intervalId = setInterval(myFunction, Speed);



