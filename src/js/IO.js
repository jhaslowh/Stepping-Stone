/** Keycodes */
var KEY_LEFT_SHIFT = 16;
var KEY_SPACE = 32;
var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;
var KEY_A = 65;
var KEY_B = 66;
var KEY_C = 67;
var KEY_D = 68;
var KEY_E = 69;
var KEY_F = 70;
var KEY_G = 71;
var KEY_H = 72;
var KEY_I = 73;
var KEY_J = 74;
var KEY_K = 75;
var KEY_L = 76;
var KEY_M = 77;
var KEY_N = 78;
var KEY_O = 79;
var KEY_P = 80;
var KEY_Q = 81;
var KEY_R = 82;
var KEY_S = 83;
var KEY_T = 84;
var KEY_U = 85;
var KEY_V = 86;
var KEY_W = 87;
var KEY_X = 88;
var KEY_Y = 89;
var KEY_Z = 90;

/** Initialize IO elements */
function initIO(){
  //listen to keyboard events
  addKeyboardEvents();
  addMouseEvents();
}

/** Add generic event */
function addEvent(node, name, func) 
{
  if(node.addEventListener) {
    node.addEventListener(name, func, false);
  } else if(node.attachEvent) {
    node.attachEvent(name, func);
  }
}

/** Add mouse events to the game */
function addMouseEvents()
{
  addEvent(document, "mousedown", function(e){
      mouse = {
    x:(e.clientX-renderer.domElement.getBoundingClientRect().left), 
    y:(e.clientY-renderer.domElement.getBoundingClientRect().top)};
  });
}

/** Add keyboard events to the game */
function addKeyboardEvents() 
{
  addEvent(document, "keydown", function(e) 
  {
    keyboard[e.keyCode] = true;
  });

  addEvent(document, "keyup", function(e) 
  {
    keyboard[e.keyCode] = false;
  });
}

/** Load resources files */ 
function loadResources() 
{
  /*gun_image = new Image();
  gun_image.src = 'images/gun.png';
  
  baby_sound = document.createElement("audio");
  document.body.appendChild(baby_sound);
  baby_sound.setAttribute("src", "sounds/baby.mp3");*/

}