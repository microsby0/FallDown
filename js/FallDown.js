

$( 'document' ).ready(function() { //intializing function
    var ctx = document.getElementById('canvas').getContext('2d');
    var HEIGHT = ctx.canvas.height;
    var WIDTH = ctx.canvas.width;
    var PLATFORM_HEIGHT=25;
    var BALL_RADIUS = 11;
    var SPACE_WIDTH = (BALL_RADIUS * 5);

    //Row variables
    var onScreenRows = [];
    var last; //to stop repeated row types
    var counter=0; //counter for when to make new row
    var first=true;
    var rowSprite = document.getElementById("row");

    //Ball variables
    var xball=ctx.canvas.width/2; //start in middle of canvas
    var yball=BALL_RADIUS; //start at top of canvas
    var dx=3;
    var dy= -3;

    //Gameplay variables
    var score =0;
    var left = false;
    var right = false;
    var isGameOver = false;
    var paused=false;

    //Opening title for game
    ctx.fillStyle="blue";
    ctx.font = "40px Helvetica";
    ctx.fillText("Press Space to start", (WIDTH/2)-((ctx.measureText("Press Space to Start").width)/2),180);
    ctx.fillStyle="black";
    ctx.font = "30px Helvetica";
    ctx.fillText("Press Enter to pause", (WIDTH/2)-((ctx.measureText("Press Space to Start").width)/2),230);

    function draw(){
        clear();
        if(isGameOver){
            gameOver();
        } else{
            if(counter===BALL_RADIUS*5 || first===true){ //Space between rows is 5x the ball radius or 2.5x the ball size
                addRow();
                updateScore();
                first=false;
                counter=0;
            }

                drawRows();
                drawBall(xball,yball,BALL_RADIUS);
            if(!paused){
                checkCollision();
                moveRows();
                moveBall();
                checkGamerOver();
                counter+=1;
            } else{
                ctx.fillStyle="red";
            ctx.font = "40px Helvetica";
            ctx.fillText("Paused", (WIDTH/2)-((ctx.measureText("Paused").width)/2),180);
            }
        }
    }

    function row(x1,width1,x2,width2,spacex){
        this.x1=x1;
        this.width1=width1;
        this.x2=x2;
        this.width2=width2;
        this.spacex=spacex;
        this.y=HEIGHT;
    }

    function addRow(){
        var rand = Math.floor(Math.random()*(WIDTH-SPACE_WIDTH)); //select a space starting point
        while(rand==last){
            rand = Math.floor(Math.random()*(WIDTH-SPACE_WIDTH));
        }
        last=rand;

        if(last===0){
            onScreenRows.push(new row(SPACE_WIDTH,WIDTH-SPACE_WIDTH,undefined,undefined,last));
        } else if(last===WIDTH-SPACE_WIDTH-1){
            onScreenRows.push(new row(0,WIDTH-SPACE_WIDTH,undefined,undefined,last));
        } else{
            onScreenRows.push(new row(0,last,last+SPACE_WIDTH,WIDTH-SPACE_WIDTH+last,last));
        }

    }

    function drawRows(){
        for(var i=0;i<onScreenRows.length;i++){ //draw each row that should be on the screen
            ctx.beginPath();
            ctx.rect(onScreenRows[i].x1,onScreenRows[i].y,onScreenRows[i].width1,PLATFORM_HEIGHT);
            if(onScreenRows[i].x2!==undefined){ //check if row has 2nd platform
                ctx.rect(onScreenRows[i].x2,onScreenRows[i].y,onScreenRows[i].width2,PLATFORM_HEIGHT);
            }
            ctx.closePath();
            ctx.fillStyle="rgb(0,0,0)";
            //ctx.fillStyle=pattern;
            ctx.fill();
        }
    }

    function moveRows(){
        for(var i=0;i<onScreenRows.length;i++){
            if(!paused){
                onScreenRows[i].y-=1; //move row up
            }
            if(onScreenRows[i].y < -20){ //if row is off screen, remove from array
                onScreenRows.splice(0, 1);
            }
        }
    }

    function drawBall(x,y,r){
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI*2, true);
        ctx.fillStyle="blue";
        ctx.closePath();
        ctx.fill();
    }

    function moveBall(){
        yball-=dy;
        if(left){
            if(xball-BALL_RADIUS >= 0){
                xball-=dx;
            }
        } else if(right){
            if(xball+BALL_RADIUS <= WIDTH){
                xball+=dx;
            }
        }
        dx=3; //reset dx if there was a collision
        dy=-3; //reset so it will fall if no longer on a platform
    }

    function checkCollision(){
        for(var f=0;f<onScreenRows.length;f++){
            //Check if ball is sitting on a platform
            if(yball+BALL_RADIUS >= onScreenRows[f].y && yball+BALL_RADIUS <= onScreenRows[f].y+3 && //checks if at same y as row, range of 3 because of different speeds
            (xball-BALL_RADIUS < onScreenRows[f].spacex || xball+BALL_RADIUS > onScreenRows[f].spacex+SPACE_WIDTH) ){  //checks if at same x as space
                dy=1;
            }
            //checks if ball is falling in a space by checking if top or bottom of ball is in between top and bottom of platform
            else if((yball+BALL_RADIUS >= onScreenRows[f].y+4 && yball+BALL_RADIUS <= onScreenRows[f].y+PLATFORM_HEIGHT) ||
                (yball-BALL_RADIUS >= onScreenRows[f].y+4 && yball-BALL_RADIUS <= onScreenRows[f].y+PLATFORM_HEIGHT)){ //if ball is falling and moving left
                if(xball-BALL_RADIUS <= onScreenRows[f].spacex && left){
                        dx=0;
                }
                if(xball+BALL_RADIUS >= onScreenRows[f].spacex+SPACE_WIDTH && right){
                        dx=0;
                }
            }
            //checks if ball is on bottom of canvas
            if(yball+BALL_RADIUS >= HEIGHT){
                yball=HEIGHT-BALL_RADIUS;
            }
        }
    }


    function checkGamerOver(){
        if(yball - BALL_RADIUS === 0){ //you lose
           isGameOver=true;
        }
    }

    function gameOver(){
        ctx.fillStyle="rgb(0,0,0)";
        ctx.font = "40px Helvetica";
        ctx.fillText("Game Over", (WIDTH/2)-((ctx.measureText("Game Over").width)/2),120); //be careful when changing canvas size

        ctx.font = "30px Helvetica";
        if(score<=10){
            ctx.fillText("Did you even try?",(WIDTH/2)-((ctx.measureText("Did you even try").width)/2),170);
        } else if (score <=20){
            ctx.fillText("You should stick to pong",(WIDTH/2)-((ctx.measureText("You should stick to pong").width)/2),170);
        } else{
            ctx.fillText("Great Job!",(WIDTH/2)-((ctx.measureText("Great Job").width)/2),170);
        }
    }

    function clear(){
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }

    function updateScore(){
        document.getElementById("score").innerHTML="<span>Score: </span>" + score;
        score++;
    }

    $(window).keypress(function(e) {
        if (e.keyCode === 32) { //if space bar is pressed
            return setInterval(function(){draw();},10);
        } else if(e.keyCode === 13){ //enter key
            if(paused){
                paused=false;
            } else{
                paused=true;
            }
        }
    });

    $(window).keydown(function(e) {
        if(e.keyCode === 37){ //left arrow
            left=true;
        } else if(e.keyCode === 39){ //right arrow
            right=true;
        }
    });

    $(window).keyup(function(e) {
        if(e.keyCode === 37){ //left arrow
            left=false;
        } else if(e.keyCode === 39){ //right arrow
            right=false;
        }
    });


});


