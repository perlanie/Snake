//intial variables
var width=600;//width of the canvas
var height=560;//height of the canvas

var xFood;//x position of food for the snake
var yFood;//y position of food for the snake
var score=0;//users score initalize to 0

//keyboard constants
var ESC = 27;
var SPACE = 32;
var LEFT = 37;
var UP = 38;
var RIGHT= 39;
var DOWN = 40;

var currDirection;


/*===================================================
MAIN
=====================================================*/

//draws the canvas
var gameCanvas=document.getElementById("canvas");
var bottomBoarder=gameCanvas.getContext("2d");
var snakeBody=gameCanvas.getContext("2d");
var snakeFood=gameCanvas.getContext("2d");
var scoreDisplay=gameCanvas.getContext("2d");
scoreDisplay.font="25px Georgia";
scoreDisplay.fillText("Score:"+score,250,590);

//black boarder for the playing field
bottomBoarder.fillStyle="black";
bottomBoarder.fillRect(0,height,width,5);
bottomBoarder.stroke();

var snake=[];//intializes the snake array to store the body parts of the snake

//intializes the snake
snake.push(new BodyParts(30,10,RIGHT)); 
snake.push(new BodyParts(20,10,RIGHT)); 
snake.push(new BodyParts(10,10,RIGHT)); 

spawnFood();//spawns the first food

drawSnake();//intializes the head of the snake

//sets the key down listener and sets the currDirection variable
document.addEventListener('keydown', function(event) {
	var keyPressed=event.keyCode;

	switch(keyPressed){
		case LEFT:
			if (currDirection!=RIGHT){
				currDirection = LEFT;
			}
			break;
		case RIGHT: 
			if (currDirection!=LEFT){
				currDirection = RIGHT;
			}			
			break;
		case UP:
			if (currDirection!=DOWN){
				currDirection = UP;
			}
			break;
		case DOWN:
			if (currDirection!=UP){
				currDirection = DOWN;
			}
			break;
		case SPACE:
			alert("GAME PAUSED!!!");
			break;
		case ESC:
			alert("Thanks for playing :) ")
	}
});

setInterval(function(){moveSnake()},100);//sets the interval for the snake to move by itself

/*======================================================================
BodyParts: Defines different parts of the snake (This is an Object constructor)
=========================================================================*/
function BodyParts(xpos,ypos,direction){
	this.xpos=xpos;
	this.ypos=ypos;
	this.direction=direction;

};

/*======================================================================
newTail: generates the new tail coordinates and direction
=========================================================================*/
function newTail(){
	//gets the last body part in the array 
	var curTail=snake[snake.length-1];
	var tailDir=curTail.direction; 

	//according to the last tail's direction the next tail is fully determined
	switch(tailDir){
		case RIGHT:
			return new BodyParts(curTail.xpos-10,curTail.ypos,tailDir);
		case LEFT:
			return new BodyParts(curTail.xpos+10,curTail.ypos,tailDir);
		case UP:
			return new BodyParts(curTail.xpos,curTail.ypos+10,tailDir);
		case DOWN:
			return new BodyParts(curTail.xpos,curTail.ypos-10,tailDir);
	};
}

/*======================================================================
switchPos: switches all the body parts with the one adjacent (<---)
=========================================================================*/
function switchPos(){
	
	//starting at the end of the array the coordinates and direction are shifted accordingly 
	for (var i=snake.length-1; i>0;i--){
		snake[i].xpos=snake[i-1].xpos;
		snake[i].ypos=snake[i-1].ypos;
		snake[i].direction=snake[i-1].direction;
	
	} 
	
}

/*======================================================================
bodyCollision: checks if the head collides with the body
=========================================================================*/
function bodyCollision(){
	
	for(var i=1; i<=snake.length-1;i++){
		if (snake[0].xpos==snake[i].xpos && snake[0].ypos==snake[i].ypos){
			alert("You bit yourself :( !!!! ");
			restart();
			
		}
		
	}
}
/*======================================================================
grow: eats the food and allows for the snake to grow a new body part
=========================================================================*/
function grow(){
	clearFood(xFood,yFood);
	spawnFood();
	showScore();//updates score

	//adds 2 new bodyparts to the snake
	snake.push(newTail());
	snake.push(newTail());
	
}

/*===================================================
moveSnake: moves the snake according to user using the arrow keys
=====================================================*/
function moveSnake(){
	var bitBody=bodyCollision();//checks if snake bit its own body

	if(currDirection == LEFT) {
		
		clearSnake();
		switchPos();
	
		//sets the new parameters for the head
		snake[0].xpos=snake[0].xpos-10;
		snake[0].direction=LEFT;
		
		if(snake[0].xpos>=0 && snake[0].xpos<=width-10){
			

			if (snake[0].xpos==xFood && snake[0].ypos==yFood ){
				grow();	
								
			}
			drawSnake();
		
		}
		else{
			restart();
		}
	}
	else if(currDirection == RIGHT) {
		
		clearSnake();
		switchPos();
		
		//sets the new parameters for the head
		snake[0].xpos=snake[0].xpos+10;
		snake[0].direction=RIGHT;
						
		if(snake[0].xpos>=0 && snake[0].xpos<=width-10){
			if (snake[0].xpos==xFood && snake[0].ypos==yFood){
				grow();
			}
			drawSnake();
		}
		else{
			restart();
		}
	}
	else if(currDirection == UP) {
		
		clearSnake();	
		switchPos();
		
		//sets the new parameters for the head
		snake[0].ypos=snake[0].ypos-10;
		snake[0].direction=UP;
			
		if(snake[0].ypos>=0 && snake[0].ypos<=height-10 ){
			if (snake[0].xpos==xFood && snake[0].ypos==yFood){
				grow();
				
			}
			drawSnake();
		}
		else{
			restart();
		}
	}
	else if(currDirection == DOWN) {
		clearSnake();
		switchPos();
		
		//sets the new parameters for the head
		snake[0].ypos=snake[0].ypos+10;
		snake[0].direction=DOWN

		if(snake[0].ypos>=0 && snake[0].ypos<=height-10){
			
			if (snake[0].xpos==xFood && snake[0].ypos==yFood){
				grow();
			}
			drawSnake();
		}
		else{
			restart();
		}
	}
	
	
}

/*===================================================
drawSnake: Draws the snake on the canvas
=====================================================*/
function drawSnake(){	

	snakeBody.fillStyle="blue";
	
	for (var i=0; i<=snake.length-1;i++){
		snakeBody.fillRect(snake[i].xpos,snake[i].ypos,10,10);
		snakeBody.stroke();

	}

	
}

/*===================================================
clearSnake: clears the snake on the canvas
=====================================================*/
function clearSnake(){	

	snakeBody.fillStyle="#00FF66";
	for (var i=0; i<=snake.length-1;i++){
		snakeBody.fillRect(snake[i].xpos,snake[i].ypos,10,10);
		snakeBody.stroke();
	}
}

/*===================================================
spawnFood: spawns food randomly on the board
=====================================================*/
function spawnFood(){
	var food={
		x: Math.round((Math.random() * (width-10))/10)*10,
		y: Math.round((Math.random() * (height-10))/10)*10
	};
	xFood=food.x;
	yFood=food.y;
	
	snakeFood.fillStyle="red";
	snakeFood.fillRect(xFood,yFood,10,10);
	snakeFood.stroke();
	
}

/*===================================================
clearFood: spawns food randomly on the board
=====================================================*/
function clearFood(){
	snakeFood.fillStyle="#00FF66";
	snakeFood.fillRect(xFood,yFood,10,10);
	snakeFood.stroke();
}

/*===================================================
showScore: spawns food randomly on the board
=====================================================*/
function showScore(){
	scoreDisplay.fillStyle="#00FF66";
	scoreDisplay.font="25px Georgia";
	scoreDisplay.fillText("Score:"+score,250,590);
	score=score+100;
	scoreDisplay.fillStyle="black";
	scoreDisplay.font="25px Georgia";
	scoreDisplay.fillText("Score:"+score,250,590);
}

/*===================================================
restart: spawns food randomly on the board
=====================================================*/
function restart(){
	var playAgain=confirm("You died :( would you like to play again?");
	if (!playAgain){
		alert("congrats :) your score is: "+score + ", Thanks for playing!");
	}
	else{
		alert("congrats :) your score is: "+score);
	}	
	//restarts the game
	scoreDisplay.fillStyle="#00FF66";
	scoreDisplay.font="25px Georgia";
	scoreDisplay.fillText("Score:"+score,250,590);
	score= -100;
	showScore();

	//black boarder for the playing field
	bottomBoarder.fillStyle="black";
	bottomBoarder.fillRect(0,height,width,5);
	bottomBoarder.stroke();
	
	currDirection=null;
	clearSnake();

	while(snake.length!=0){
		snake.pop();
	}
	//intializes new snake
	snake.push(new BodyParts(30,10,RIGHT));
	snake.push(new BodyParts(20,10,RIGHT)); 
	snake.push(new BodyParts(10,10,RIGHT));
	
	drawSnake();
	clearFood(xFood,yFood);
	spawnFood();

	
}






