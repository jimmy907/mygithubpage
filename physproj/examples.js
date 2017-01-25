/* James R Von Holle
 * 2016
 * For Physics 211x Web Project
 * examples.js
 * Actual game code for given examples 
 */

/* initialize global variables */
var player;
var platform;
var h = 10;
var w = window.innerWidth * 0.9 / 2;

window.addEventListener('keyup', function(event) { clearmove(event); }, false);
window.addEventListener('keydown', function(event) { move(event); }, false);

/* makeEx[NUMBER]()
 * [NUMBER] changes with each example
 * loads example with correct parameters
 */
function makeExZero(g_type) {
    player = new component(30, 30, "red", w, h);
    player.gravity_type = g_type;
    player.gravity = .05;
    player.move = false;
    platforms = make_platforms(0);
    board.start(0);
    document.getElementById("close_butt").classList.toggle("show");
}
function makeExOne() {
    player = new component(30, 30, "blue", w, h);
    player.gravity_type = 1;
    player.gravity = .05;
    player.move = true;
    player.horz = false;
    board.start(1);
    document.getElementById("close_butt").classList.toggle("show");
}
function makeExTwo() {
    player = new component(30, 30, "red", w, h);
    player.gravity_type = 1;
    player.gravity = .05;
    player.move = true;
    player.horz = true;
    player.mass = 10;
    platforms = make_platforms(2);
    board.start(0);
    document.getElementById("close_butt").classList.toggle("show");
}
function makeGenEx() {
    player = new component(30, 30, "red", w, h);
    player.gravity_type = 0;
    player.gravity = .5;
    player.move = true;
    platforms = make_platforms(-1);
    board.start(-1);
    document.getElementById("close_butt").classList.toggle("show");
}

function make_platforms(num) {
    var thing = new component(30, 70, "purple", w+100, h);
    platform = thing;
    platform.gravity_type = 1;
    platform.gravity = player.gravity;
    platform.move = false;
    platform.friction = 4;
    platform.mass = 20;
}

/* board
 * struct containing data relevant to level structure
 * invariants:  
 *    ex is currently not used, but needs to be passed in
 */
var board = {
    /* canvas
     * area for example to be drawn on
     */
    canvas : document.createElement("canvas"),
    /* start(ex)
     * Takes a number
     * does nothing with that number
     * loads and draws canvas for example to live on
     */
    start  : function(ex) {
        this.canvas.width = window.innerWidth * 0.9;
        this.canvas.height = window.innerHeight * 0.9;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateBoard, 20);
    },
    /* clear()
     * takes nothing
     * returns nothing
     * clears the canvas so previously drawn components are removed
     */
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

/* conponent
 * this function acts as a class
 * defines all the needed functions for objects in  the
 * world, including player, platforms, text
 * invariants:
 *     width > 0 && height > 0
 */
function component(width, height, color, x, y, type) {
    /* members
     * type: color(default), image, text
     * widht, hieght: size of component's hitbox, size of rectangle drawn if type color
     * speedX/speedY: speed in the X and Y directions accordingly, +Y goes down, +X goes right
     * x/y: position of component on canvas
     * gravity_type: 0 for velocity, 1 for acceleration
     * gravitySpeed: current speed of gravity
     * gravity: acceleration of gravity
     * mass: simuated mass of object, used for collision simulation
     * friction: simulated friction with ground, used for collision simulation
     */
    this.type    = type;
    this.width   = width;
    this.height  = height;
    this.speedX  = 0;
    this.speedY  = 0;
    this.x       = x;
    this.y       = y;
    this.h_acc   = 0;
    this.gravitySpeed = 0;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.update = function() {
        ctx = board.context;
        if (type == "image"){
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        if( this.gravity_type == 1 ){
            this.gravitySpeed += this.gravity;
            this.speedX += this.h_acc;
        } else {
            this.gravitySpeed = this.gravity;
        }
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
        this.hitTop();
    }
    this.hitBottom = function() {
        var rockbottom = board.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
            this.gravity = 0;
        }
    }
    this.hitTop = function() {
        if (this.y < 0) {
            this.y = 0;
            this.gravitySpeed = 0;
            this.gravity = 0.05;
        }
        if (this.x < 0){
            this.h_acc = 0;
            this.speedX = 0;
            this.x = 0;
        }else if (this.x > board.canvas.width - this.width) {
            this.x = board.canvas.width - this.width;
        }
    }
    this.crashWith = function (otherobj) {
        var myleft  = this.x;
        var myright = this.x + (this.width);
        var mytop   = this.y;
        var mybot   = this.y + (this.height);

        var oleft  = otherobj.x;
        var oright = otherobj.x + (otherobj.width);
        var otop   = otherobj.y;
        var obot   = otherobj.y + (otherobj.height);
        
        var crash = true;
        if ( (mybot < otop) || (mytop > obot) || (myright < oleft) || (myleft > oright) ) 
            crash = false;
        return crash;
    }
    this.jump = function() {
        this.gravity = -.1;
    }
}

function updateBoard() {
    var x, height, gap, minHiehgt, maxHeight, minGap, maxGap;

    if (player.crashWith(platform) == true) {
        do_physics (player, platform);
        player.speedX = 0;
        player.h_acc = 0;
        if (player.x > platform.x)
            player.x += 1;
        else
            player.x -= 1;
        if (player.y > platform.y)
            player.y += 1;
        else
            player.y -= 1;
    }

    board.clear();
    board.frameNo++;
    
    if (board.frameNo == 1 || everyinterval(150)) {
        x = board.canvas.width;
    }
    player.newPos();
    player.update();
    platform.newPos();
    platform.update();
}

function do_physics (one, two) {
    var forceX = one.h_acc * one.mass;
    if (forceX < 0)
        forceX * -1;
    if (forceX > two.friction) {
        two.h_acc = one.h_acc / (two.mass / one.mass);
        one.h_acc = -one.h_acc / (two.mass / one.mass);
    }
}

function everyinterval(n) {
    return ((board.frameNo / n) % 1 == 0);
}


function move(dir) {
    if (player.move == true) {
        if (player.horz == true) {
            if (dir.keyCode == 38) /* up */
                player.jump();
            if (dir.keyCode == 37) /* left */
                player.h_acc = -0.5;
            if (dir.keyCode == 39) /* right */
                player.h_acc = 0.5;
        }else {
            if (dir.keyCode == 38) /* up */
                player.jump();
            if (dir.keyCode == 37) /* left */
                player.speedX = -1;
            if (dir.keyCode == 39) /* right */
                player.speedX = 1;
        }
    }
}

function clearmove(dir) {
    if (player.move) {
        if (dir.keyCode == 38) /* up */
            player.gravity=.05;
        if (dir.keyCode == 37) { /* left */
            player.speedX = 0;
        }if (dir.keyCode == 39) { /* right */
            player.speedX = 0;
        }
    }
}
