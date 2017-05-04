/*
 * James R Von Holle Jr
 * 2017
 * Demo of filling boxes algorithm
 * from proof given in MATH 307
 */

var board = {
    canvas : document.createElement("canvas"),

    start: function() {
        this.canvas.width  = Math.min( (window.innerWidth * 0.8), (window.innerHeight * .08));
        this.canvas.height = Math.min( (window.innerWidth * 0.8), (window.innerHeight * .08));
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    },

    clear : function() {
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
    }
}
