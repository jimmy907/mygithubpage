/*
 * James R Von Holle
 * 2016
 * For Physics 211x Web Project
 * web_stuff.js
 * Handles functions unrelated to examples
 */

/* Show list of examples in menu-bar */
showExList = function() {
    var elem = document.getElementById("exList");
    elem.classList.toggle("show");
}
/* Hide list if click is outside of it*/
window.onclick = function(e) {
    if (!e.target.matches('.drop_butt')) {
        var dropdowns = document.getElementsByClassName("ex_list");
        for (var i = 0; i < dropdowns.length; ++i) {
            var openDropdown = dropdowns[i];
            if(openDropdown.classList.contains('show'))
                openDropdown.classList.remove('show');
        }
    }
}
