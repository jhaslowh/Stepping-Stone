"use strict";

// Input 
var keyboard = {};
var mouse = {x:0, y:0};

// Handlers 
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

// Game variables 
var gameState = "playing";
var level = new GameLevel();

// Beginning initialization 
function init(){
  //listen to keyboard events
  addKeyboardEvents();
  addMouseEvents();

  //load assets
  loadResources();
  
  // Set up level 
  level.init();
}

// Main Game loop 
function gameLoop() 
{
  // Update
  level.update();
  
  // Render
  level.draw();
}

function addEvent(node, name, func) 
{
  if(node.addEventListener) {
    node.addEventListener(name, func, false);
  } else if(node.attachEvent) {
    node.attachEvent(name, func);
  }
}

function addMouseEvents()
{
    addEvent(document, "mousedown", function(e){
        mouse = {
			x:(e.clientX-canvas.getBoundingClientRect().left), 
			y:(e.clientY-canvas.getBoundingClientRect().top)};
    });
}

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

// Play a sound file 
function playSound(file) 
{
  //var sound = document.createElement("audio");
  //sound.setAttribute("src", "sounds/" + file + ".mp3");
  //sound.play();
}

// Load out resources 
function loadResources() 
{
  /*gun_image = new Image();
  gun_image.src = 'images/gun.png';
  
  baby_sound = document.createElement("audio");
  document.body.appendChild(baby_sound);
  baby_sound.setAttribute("src", "sounds/baby.mp3");*/

}

//-----------------------------------------------------------------------------
//start the Game here
//-----------------------------------------------------------------------------

init();

//enter game loop
setInterval(gameLoop, 1000 / 100);


