

$( document ).ready(function() { //intializing function
    var ctx = document.getElementById('canvas').getContext('2d');
    var HEIGHT = ctx.canvas.height;
    var WIDTH = ctx.canvas.width;
    var PLATFORM_HEIGHT=20;
    var BALL_RADIUS = 12;
    var SPACE_SIZE = (BALL_RADIUS * 3) + 20;
    var y=0; //counter for when to make new row
    var first=true;
    var left = false; var right = false;
    var gameOver = false;
    var onScreenRows = [];
    var last; //to stop repeated row types
    var xball=ctx.canvas.width/2;
    var yball=BALL_RADIUS;
    var dx=0;
    var dy= -3;
    var score =0;

    function draw(ctx){
        clear();
        if(!gameOver){
            if(y===BALL_RADIUS*5 || first===true){
                addRow();
                updateScore();
                first=false;
                y=0;
            }

            for(var i=0;i<onScreenRows.length;i++){ //draw each row that should be on the screen
                ctx.beginPath();
                ctx.rect(onScreenRows[i].x1,onScreenRows[i].y,onScreenRows[i].width1,PLATFORM_HEIGHT);
                if(onScreenRows[i].x2!==undefined){ //check if row has 2nd platform
                    ctx.rect(onScreenRows[i].x2,onScreenRows[i].y,onScreenRows[i].width2,PLATFORM_HEIGHT);
                }
                ctx.closePath();
                ctx.fill();

                onScreenRows[i].y-=1; //move row up
                if(onScreenRows[i].y < -20){ //if row is off screen, remove from array
                    onScreenRows.splice(0, 1);
                }
            }

            ball(xball,yball,BALL_RADIUS);

            yball-=dy;
            if(left){
                if(xball-BALL_RADIUS >= 0)
                    xball-=5;
            } else if(right){
                if(xball+BALL_RADIUS <= WIDTH)
                    xball+=5;
            }
            dy=-3;
            for(var f=0;f<onScreenRows.length;f++){
                if(yball+BALL_RADIUS <= onScreenRows[f].y+(BALL_RADIUS/2) && yball+BALL_RADIUS >= onScreenRows[f].y && //checks if at same y as row
                !(xball-BALL_RADIUS > onScreenRows[f].spacex && xball+BALL_RADIUS < onScreenRows[f].spacex+SPACE_SIZE) ){  //checks if at same x as space
                //added + half of radius to deal with mismatching starting point?
                    dy=1;
                }
            }
            y+=1;

            if(yball+BALL_RADIUS >= HEIGHT){ //You win
                yball=HEIGHT-BALL_RADIUS;
            }
            if(yball - BALL_RADIUS === 0){ //you lose
               gameOver=true;
            }
        }
        if(gameOver){
            ctx.font = "40px Helvetica";
            ctx.fillText("Game Over", 100,120); //be careful when changing canvas size
            if(score<=10){
                ctx.font = "30px Helvetica";
                ctx.fillText("Did you even try?",85,170);
            } else if (score <=20){
                ctx.font = "30px Helvetica";
                ctx.fillText("You should stick to pong",35,170);
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
        var rand = Math.floor(Math.random()*(WIDTH-SPACE_SIZE)); //select a space starting point
        while(rand==last){
            rand = Math.floor(Math.random()*(WIDTH-SPACE_SIZE));
        }
        last=rand;

        if(last===0){
            onScreenRows.push(new row(SPACE_SIZE,WIDTH-SPACE_SIZE,undefined,undefined,last));
        } else if(last===WIDTH-SPACE_SIZE-1){
            onScreenRows.push(new row(0,WIDTH-SPACE_SIZE,undefined,undefined,last));
        } else{
            onScreenRows.push(new row(0,last,last+SPACE_SIZE,WIDTH-SPACE_SIZE+last,last));
        }

    }

    function ball(x,y,r){
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
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

        } else if(e.keyCode === 13){ //enter key

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

    return setInterval(function(){draw(ctx);},10);
});


