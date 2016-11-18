/* James R Von Holle
 * 2016
 * For Physics 211x Web Project
 * examples.js
 * Actual game code for given examples 
 */

/* initialize global variables */
var player;
var platforms = [];

/* loadExample(num)
 * Takes a number
 * loads example with correct parameters
 * specified by num
 */
function loadExample(num) {
    if( num == 0 ) {
        player = new component(30, 30, "red", 10, 120);
        player.gravity_type = 0;
        player.gravity = .5;
        platforms = make_platforms(0);
        board.start(0);
    }else if( num == 1 ) {
        player = new component(30, 30, "red", 10, 120);
        player.gravity_type = 1;
        player.gravity = .05;
        platforms = make_platforms(1);
        board.start(1);
    }else if( num == 2 ) {
        player = new component(30, 30, "red", 10, 120);
        player.gravity_type = 1;
        player.gravity = .05;
        player.mass = 1;
        platforms = make_platforms(2);
        board.start(2);
    }else if( num == 3 ) {
        player = new component(30, 30, "red", 10, 120);
        player.gravity_type = 1;
        player.gravity = .05;
        platforms = make_platforms(3);
        board.start(3);
    }else {
        player = new component(30, 30, "red", 10, 120);
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
     *
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
        this.interval = setInterval(updateGameArea, 20);
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

function 
