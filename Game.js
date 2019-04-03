var GameCanvas;
var DrawContext;
var ctx;
var WKeyDown = false;
var AKeyDown = false;
var SKeyDown = false;
var DKeyDown = false;
var GameMode = 'Game';
var Won = false;


var Cars = [];
var Lanes = [];
var LaneColours = [
    'rgb(0, 0, 255)',
    'rgb(255, 100, 0)',
    'rgb(255, 125, 0)',
    'rgb(255, 150, 0)',
    'rgb(255, 175, 0)',
    'rgb(255, 200, 0)',
    'rgb(255, 225, 0)',
    'rgb(255, 250, 0)',
    'rgb(0, 0, 255)' 
];
var Player;
var FrogLives = [];
var FrogsSaved = [];
var FrogsSavedCount = 0;

function Frog(x, y, width, height, speed)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.update = function()
    {
        if (WKeyDown)
        {
            WKeyDown = false;
            this.y -= this.speed;

            if (this.y < 45)
            {
                this.y = 45;
            }
        }
        
        if (SKeyDown)
        {
            SKeyDown = false;
            this.y += this.speed;

            if (this.y > 525)
            {
                this.y = 525;
            }
        }

        if (AKeyDown)
        {
            AKeyDown = false;
            this.x -= this.speed;

            if (this.x < 30)
            {
                this.x = 30;
            }
        }
        
        if (DKeyDown)
        {
            DKeyDown = false;
            this.x += this.speed;

            if (this.x > 770)
            {
                this.x = 770;
            }
        }
        this.draw();
        this.dueCollision();

        if (this.y < 75)
        {
            this.y = 525;
            this.x = 375;
            FrogsSaved[FrogsSavedCount].alive = true;
            FrogsSavedCount++;
            
            if (FrogsSavedCount == 3)
            {
                GameMode = 'EndGame';
                Won = true;
            }
        }
        
    }
    this.draw = function()
    {
        var x = this.x - this.width / 2;
        var y = this.y - this.height / 2;

        ctx.fillStyle = 'rgb(0, 255, 0)';
        ctx.fillRect(x, y, this.width, this.height);
    }

    this.dueCollision = function()
    {
        for (var t = 0; t < Cars.length; t++)
        {
            var TotalWidth = this.width + Cars[t].width;
            var TotalHeight = this.height + Cars[t].height;

            var dx = Math.abs(Cars[t].x - this.x)
            var dy = Math.abs(Cars[t].y - this.y)

            if (dx <= TotalWidth / 2 && dy <= TotalHeight / 2)
            {
                this.y = 525;
                this.x = 375;
                FrogLives.splice(0,1); 
            }
            if(FrogLives.length == 0)
            {
                GameMode = 'EndGame';
                Won = false;   
            }
        }
    }
}

function FrogLife(x, y)
{
    this.x = x;
    this.y = y;
    this.width = 25;
    this.height = 25;
    this.update = function()
    {
        this.draw();
    }
    this.draw = function()
    {
        ctx.fillStyle = 'rgb(252, 16, 232)';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    FrogLives.push(this);
}

function FrogSaved(x, y)
{   
    this.alive = false
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 25;
    this.update = function()
    {
        this.draw();
    }
    this.draw = function()
    {
        if (this.alive)
        {
            ctx.fillStyle = 'rgb(0, 255, 0)';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    FrogsSaved.push(this);    
}

function Car(x, y, speed)
{
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 20;
    this.speed = speed;
    this.update = function()
    {
        this.x += this.speed;
        
        if (this.x > 825)
        {
            this.x = -25;
        }
        if (this.x < -25)
        {
            this.x = 825;
        }
        this.draw();
    }
    this.draw = function()
    {
        var x = this.x - this.width / 2;
        var y = this.y - this.height / 2;

        ctx.fillStyle = 'rgb(255, 0, 0)';
        ctx.fillRect(x, y, this.width, this.height);
    }
    Cars.push(this);
}

function Lane(x, y, colour)
{
    this.x = x;
    this.y = y;
    this.width = 800;
    this.height = 60;
    this.colour = colour;
    this.update = function()
    {
        this.draw();
    }
    this.draw = function()
    {
        ctx.fillStyle = this.colour;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    Lanes.push(this);
}

function StartGame()
{
    window.addEventListener('keydown', HandleKeyDownEvent, true);
    window.addEventListener('keyup', HandleKeyUpEvent, true);
    window.addEventListener('click', MouseClick, true);

    GameCanvas = document.getElementById('game_canvas');
    ctx = GameCanvas.getContext('2d');

    RestartGame();
    MainLoop();
}

function RestartGame()
{
    FrogsSaved = [];
    FrogLives = [];
    Cars = [];
    FrogsSavedCount = 0;

    Player = new Frog(375, 525, 50, 30, 30);

    var t = 0;

    for (var y = 0; y < 540; y += 60)
    {
        new Lane(0, y, LaneColours[t++]);
    }

    var StartLeft = true;

    for (var y = 75; y < 14 * 30 + 75; y += 30)
    {
        if(StartLeft)
        {
            new Car(-25, y, 3 + Math.random() * 6);    
        }
        else
        {
            new Car(825, y, -3 - Math.random() * 6);
        }

        StartLeft = !StartLeft;
    }

    for (var x = 700; x < 3 * 35 + 700; x += 35)
    {
        new FrogLife(x, 0);
    }
    
    for (var x = 0; x < 3 * 60; x += 60)
    {
        new FrogSaved(x, 0);
    }
}

function HandleKeyDownEvent(key_event)
{
    if (key_event.key == 'w' )
    {
        WKeyDown = true;
        
    }
    else if (key_event.key == 's' )
    {
        SKeyDown = true;
       
    }
    else if (key_event.key == 'a' )
    {
        AKeyDown = true;
        
    }
    else if (key_event.key == 'd' )
    {
        DKeyDown = true;
        
    }
}

function HandleKeyUpEvent(key_event)
{
    if (key_event.key == 'w')
    {
        WKeyDown = false;
        
    }
    else if (key_event.key == 's')
    {
        SKeyDown = false;
        
    }
    else if (key_event.key == 'a')
    {
        AKeyDown = false;
       
    }
    else if (key_event.key == 'd')
    {
        DKeyDown = false;
        
    }
}

function MouseClick(Event)
{
    var x = Event.layerX;
    var y = Event.layerY;

    if (x > 0 && x < 800 && y > 0 && y < 540 && GameMode == 'EndGame')
    {
        GameMode = 'Game';
        RestartGame();
    }
}

function DoEndGame()
{
    ctx.fillStyle = 'rgb(0, 183, 255)';
    ctx.fillRect(0, 0, 800, 540);
    
    ctx.fillStyle = 'rgb(0, 0, 255)';
    ctx.fillRect(200, 600, 400, 100);

    ctx.font = '50px Arial';
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillText('Restart Game', 245, 370);

    if (Won)
    {
        ctx.font = '50px Arial';
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillText('You Saved Them All!', 150, 200);
    }
    else
    {
        ctx.font = '50px Arial';
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillText('You Squashed Them All!', 120, 200);
    }
}

function MainLoop()
{
    ctx.clearRect(0, 0, 800, 540);
    
    if (GameMode == 'EndGame')
    {
        DoEndGame();
    }
    else
    {
        for (var t = 0; t < Lanes.length; t++)
        {
            Lanes[t].update();
        }

        for (var t2 = 0; t2 < Cars.length; t2++)
        {
            Cars[t2].update();
        }
        
        for (var t3 = 0; t3 < FrogLives.length; t3++)
        {
            FrogLives[t3].update();
        }

        for (var t4 = 0; t4 < FrogsSaved.length; t4++)
        {
            FrogsSaved[t4].update();
        }


        Player.update();
    }

    setTimeout(MainLoop, 16);
}

window.onload = function(e)
{
    console.log('Game Started');
    StartGame();
}

