/* James R Von Holle
 * 2016
 * For Physics 211x Web Project
 * examples.js
 * Actual game code for given examples 
 */

/* initialize global variables */
var player;
var platforms = [];

var Key = {
    _pressed: {},

    LEFT : 37,
    UP   : 38,
    RIGHT : 39,
    DOWN  : 40,

    isDown : function(keyCode) {
        return this._pressed[keyCode];
    },

    onKeydown : function(event) {
        this._pressed[event.keyCode] = true;
    },

    onKeyup : function(event) {
        delete this._pressed[event.keyCode];
    }
};

/* loadExample(num)
 * Takes a number
 * loads example with correct parameters
 * specified by num
 */
function loadExample(num) {
    var h = 70;
    var w = window.innerWidth  * 0.9 / 2;
    if( num == 0 ) {
        player = new component(30, 30, "red", w, h);
        player.gravity_type = 0;
        player.gravity = .5;
        platforms = make_platforms(0);
        board.start(0);
    }else if( num == 1 ) {
        player = new component(30, 30, "blue", w, h);
        player.gravity_type = 1;
        player.gravity = .05;
        player.gravitySpeed = 0;
        platforms = make_platforms(1);
        board.start(1);
    }else if( num == 2 ) {
        player = new component(30, 30, "red", w, h);
        player.gravity_type = 1;
        player.gravity = .05;
        player.mass = 1;
        platforms = make_platforms(2);
        board.start(2);
    }else if( num == 3 ) {
        player = new component(30, 30, "red", w, h);
        player.gravity_type = 1;
        player.gravity = .05;
        platforms = make_platforms(3);
        board.start(3);
    }else {
        player = new component(30, 30, "red", w, h);
        platforms = make_platforms(-1);
        board.start(-1);
    }
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
        this.canvas.height = window.innerHeight * 0.4;
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

function component(width, height, color, x, y, type) {
    this.type    = type;
    this.width   = width;
    this.height  = height;
    this.speedX  = 0;
    this.speedY  = 0;
    this.x       = x;
    this.y       = y;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = board.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        if( this.gravity_type == 1 ){
            this.gravitySpeed += this.gravity;
        } else {
            this.gravitySpeed = this.gravity;
        }
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    this.hitBottom = function() {
        var rockbottom = board.canvas.height - this.height;
        if( this.y > rockbottom ) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
            this.gravity = 0;
        }
    }
    this.crashWith = function( otherobj ) {
        var myleft  = this.x;
        var myright = this.x + (this.width);
        var mytop   = this.y;
        var mybot   = this.y + (this.height);

        var oleft  = otherobj.x;
        var oright = otherobj.x + (otherobj.width);
        var otop   = otherobj.y;
        var obot   = otherobj.y + (otherobj.height);
        
        var crash = true;
        if ( (mybot < otop) || (mytop > obot) || (myrigth < oleft) || (myleft > oright) ) 
            crash = false;
        return crash;
    }
}

function updateBoard() {
    var x, height, gap, minHiehgt, maxHeight, minGap, maxGap;

    board.clear();
    board.frameNo++;
    
    if (board.frameNo == 1 || everyinterval(150)) {
        x = board.canvas.width;
    }
    player.newPos();
    player.update();
}

function everyinterval(n) {
    return ((board.frameNo / n) % 1 == 0)
}

function make_platforms(num) {
    platforms = [1];
}

function move(dir) {
    player.image.src = "";
}
